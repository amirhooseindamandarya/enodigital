import "server-only";
import { createHash, randomInt } from "node:crypto";
import { and, desc, eq, gt, isNull, sql } from "drizzle-orm";
import { db, schema } from "./db";

/**
 * پیامک. SMS_DRIVER=kavenegar ← کاوه‌نگار (KAVENEGAR_API_KEY و قالب‌های verify)
 * در غیر این صورت پیام فقط در لاگ سرور نوشته می‌شود (محیط توسعه).
 */
export const smsDriver = () => (process.env.SMS_DRIVER === "kavenegar" && process.env.KAVENEGAR_API_KEY ? "kavenegar" : "log");

async function kavenegarLookup(receptor: string, template: string, token: string) {
  const key = process.env.KAVENEGAR_API_KEY!;
  const qs = new URLSearchParams({ receptor, template, token });
  const res = await fetch(`https://api.kavenegar.com/v1/${key}/verify/lookup.json?${qs}`, { cache: "no-store", signal: AbortSignal.timeout(15_000) });
  const json = (await res.json().catch(() => ({}))) as { return?: { status?: number } };
  if (json.return?.status !== 200) throw new Error(`kavenegar ${json.return?.status ?? res.status}`);
}

/** ارسال پیام قالب‌دار (کد تأیید، اطلاع‌رسانی سفارش) */
export async function sendTemplate(phone: string, template: "otp" | "order_paid" | "ticket_reply", token: string) {
  if (smsDriver() === "log") {
    console.info(`[sms:${template}] → ${phone}: ${token}`);
    return;
  }
  const map = { otp: process.env.KAVENEGAR_TEMPLATE_OTP, order_paid: process.env.KAVENEGAR_TEMPLATE_ORDER, ticket_reply: process.env.KAVENEGAR_TEMPLATE_TICKET };
  const tpl = map[template];
  if (!tpl) return; // اطلاع‌رسانی اختیاری است
  await kavenegarLookup(phone, tpl, token.replace(/\s/g, ""));
}

/** اطلاع‌رسانی بدون توقف جریان اصلی */
export function notify(phone: string, template: "order_paid" | "ticket_reply", token: string) {
  if (!phone.startsWith("09")) return;
  sendTemplate(phone, template, token).catch((e) => console.error("[sms]", e));
}

/* ---------------- کد یک‌بارمصرف ---------------- */
const sha = (s: string) => createHash("sha256").update(s).digest("hex");
const OTP_TTL = 5 * 60_000;

/** ساخت و ارسال کد؛ برمی‌گرداند آیا ارسال شد (و در محیط توسعه خود کد را) */
export async function issueOtp(phone: string, purpose: string) {
  const recent = await db.select({ n: sql<number>`count(*)::int` }).from(schema.otpCodes)
    .where(and(eq(schema.otpCodes.phone, phone), eq(schema.otpCodes.purpose, purpose), gt(schema.otpCodes.createdAt, new Date(Date.now() - 60 * 60_000))));
  if ((recent[0]?.n ?? 0) >= 5) return { ok: false as const, reason: "limit" as const };
  const code = String(randomInt(100000, 1000000));
  await db.insert(schema.otpCodes).values({ phone, purpose, codeHash: sha(`${purpose}:${phone}:${code}`), expiresAt: new Date(Date.now() + OTP_TTL) });
  try {
    await sendTemplate(phone, "otp", code);
  } catch (e) {
    console.error("[otp]", e);
    return { ok: false as const, reason: "sms" as const };
  }
  return { ok: true as const, devCode: smsDriver() === "log" && process.env.NODE_ENV !== "production" ? code : undefined };
}

export async function consumeOtp(phone: string, purpose: string, code: string) {
  const row = await db.query.otpCodes.findFirst({
    where: and(eq(schema.otpCodes.phone, phone), eq(schema.otpCodes.purpose, purpose), isNull(schema.otpCodes.usedAt), gt(schema.otpCodes.expiresAt, new Date())),
    orderBy: desc(schema.otpCodes.id),
  });
  if (!row || row.attempts >= 5) return false;
  if (row.codeHash !== sha(`${purpose}:${phone}:${code.trim()}`)) {
    await db.update(schema.otpCodes).set({ attempts: row.attempts + 1 }).where(eq(schema.otpCodes.id, row.id));
    return false;
  }
  await db.update(schema.otpCodes).set({ usedAt: new Date() }).where(eq(schema.otpCodes.id, row.id));
  return true;
}
