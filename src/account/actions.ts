"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { and, eq, or, sql } from "drizzle-orm";
import { isLocale } from "@/cms/i18n";
import type { Locale } from "@/cms/types";
import { db, schema } from "@/server/db";
import { hashPassword, passwordProblem, verifyPassword } from "@/server/auth/password";
import { createSession, destroySession, getCurrentUser, revokeAllSessions, revokeOtherSessions } from "@/server/auth/session";
import { limited } from "@/server/rate-limit";
import { latinDigits, normalizeEmail, normalizePhone } from "@/server/phone";
import { consumeOtp, issueOtp } from "@/server/sms";
import { createOrder } from "@/server/orders";
import { startPayment } from "@/server/checkout";
import { gateway } from "@/server/payments";
import { getSettings } from "@/server/settings";
import { at, type AKey } from "./i18n";
import { accHref, safeNext } from "./context";
import type { ActionState } from "./form";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const loc = (fd: FormData): Locale => { const l = str(fd, "locale"); return isLocale(l) ? l : "fa"; };
const fail = (l: Locale, k: AKey): ActionState => ({ error: at(k, l) });
const nul = (v: string) => v || null;

async function mustUser(l: Locale) {
  const u = await getCurrentUser();
  if (!u) redirect(accHref(l, "login"));
  return u;
}

/* ------------------------------------------------------------------ */
/* ورود، ثبت‌نام، خروج                                                  */
/* ------------------------------------------------------------------ */
export async function loginAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const l = loc(fd);
  const id = latinDigits(str(fd, "identifier"));
  const password = String(fd.get("password") ?? "");
  if (!id || !password) return fail(l, "errRequired");
  if (await limited("login", 10, 15 * 60_000, id.toLowerCase())) return fail(l, "errTooMany");
  const phone = normalizePhone(id);
  const email = normalizeEmail(id);
  if (!phone && !email) return fail(l, "errCredentials");
  const user = await db.query.users.findFirst({
    where: phone ? eq(schema.users.phone, phone) : sql`lower(${schema.users.email}) = ${email}`,
  });
  if (!user || user.status !== "active" || !(await verifyPassword(password, user.passwordHash))) return fail(l, "errCredentials");
  await createSession(user.id);
  redirect(safeNext(str(fd, "next"), l));
}

export async function registerAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const l = loc(fd);
  const name = str(fd, "name");
  const phone = normalizePhone(str(fd, "phone"));
  const emailRaw = str(fd, "email");
  const email = emailRaw ? normalizeEmail(emailRaw) : null;
  const password = String(fd.get("password") ?? "");
  if (await limited("register", 8, 60 * 60_000)) return fail(l, "errTooMany");
  if (name.length < 2) return fail(l, "errName");
  if (!phone) return fail(l, "errPhone");
  if (emailRaw && !email) return fail(l, "errEmail");
  if (passwordProblem(password)) return fail(l, "errPasswordShort");
  const exists = await db.query.users.findFirst({ where: email ? or(eq(schema.users.phone, phone), sql`lower(${schema.users.email}) = ${email}`) : eq(schema.users.phone, phone) });
  if (exists) return fail(l, exists.phone === phone ? "errPhoneTaken" : "errEmailTaken");
  const [u] = await db.insert(schema.users).values({ name: name.slice(0, 120), phone, email, passwordHash: await hashPassword(password), locale: l }).returning({ id: schema.users.id });
  await createSession(u.id);
  redirect(safeNext(str(fd, "next"), l));
}

export async function logoutAction(fd: FormData) {
  const l = loc(fd);
  await destroySession();
  redirect(accHref(l, "login"));
}

/** بازیابی رمز: مرحلهٔ ۱ ارسال کد، مرحلهٔ ۲ تأیید کد و رمز جدید */
export async function forgotAction(prev: ActionState, fd: FormData): Promise<ActionState> {
  const l = loc(fd);
  const phone = normalizePhone(str(fd, "phone"));
  if (!phone) return fail(l, "errPhone");

  if (str(fd, "step") !== "verify") {
    if (await limited("otp", 5, 15 * 60_000, phone)) return fail(l, "errTooMany");
    const user = await db.query.users.findFirst({ where: eq(schema.users.phone, phone) });
    let devCode: string | undefined;
    if (user && user.status === "active") {
      const r = await issueOtp(phone, "reset");
      if (!r.ok) return fail(l, r.reason === "limit" ? "errTooMany" : "errSms");
      devCode = r.devCode;
    }
    // پاسخ یکسان، چه شماره ثبت شده باشد چه نه
    return { ok: at("codeSent", l), data: { step: "verify", phone, devCode } };
  }

  const keep = { step: "verify", phone, devCode: prev?.data?.devCode };
  if (await limited("otp-verify", 10, 15 * 60_000, phone)) return { ...fail(l, "errTooMany"), data: keep };
  const password = String(fd.get("password") ?? "");
  if (passwordProblem(password)) return { ...fail(l, "errPasswordShort"), data: keep };
  if (!(await consumeOtp(phone, "reset", latinDigits(str(fd, "code"))))) return { ...fail(l, "errCode"), data: keep };
  const user = await db.query.users.findFirst({ where: eq(schema.users.phone, phone) });
  if (!user) return { ...fail(l, "errCode"), data: keep };
  await db.update(schema.users).set({ passwordHash: await hashPassword(password) }).where(eq(schema.users.id, user.id));
  await revokeAllSessions(user.id);
  await createSession(user.id);
  redirect(accHref(l));
}

/* ------------------------------------------------------------------ */
/* پروفایل و امنیت                                                       */
/* ------------------------------------------------------------------ */
export async function profileAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const l = loc(fd);
  const u = await mustUser(l);
  const name = str(fd, "name");
  const emailRaw = str(fd, "email");
  const email = emailRaw ? normalizeEmail(emailRaw) : null;
  if (name.length < 2) return fail(l, "errName");
  if (emailRaw && !email) return fail(l, "errEmail");
  if (email) {
    const other = await db.query.users.findFirst({ where: and(sql`lower(${schema.users.email}) = ${email}`, sql`${schema.users.id} <> ${u.id}`) });
    if (other) return fail(l, "errEmailTaken");
  }
  const pref = str(fd, "pref_locale");
  await db.update(schema.users).set({
    name: name.slice(0, 120), email,
    locale: isLocale(pref) ? pref : u.locale,
    company: nul(str(fd, "company").slice(0, 200)),
    nationalId: nul(latinDigits(str(fd, "nationalId")).slice(0, 20)),
    economicCode: nul(latinDigits(str(fd, "economicCode")).slice(0, 20)),
    postalCode: nul(latinDigits(str(fd, "postalCode")).slice(0, 20)),
    address: nul(str(fd, "address").slice(0, 500)),
  }).where(eq(schema.users.id, u.id));
  revalidatePath("/account", "layout");
  return { ok: at("saved", l) };
}

export async function passwordAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const l = loc(fd);
  const u = await mustUser(l);
  if (await limited("pw", 10, 15 * 60_000, String(u.id))) return fail(l, "errTooMany");
  const row = await db.query.users.findFirst({ where: eq(schema.users.id, u.id) });
  if (!row || !(await verifyPassword(String(fd.get("current") ?? ""), row.passwordHash))) return fail(l, "errWrongPassword");
  const next = String(fd.get("password") ?? "");
  if (passwordProblem(next)) return fail(l, "errPasswordShort");
  await db.update(schema.users).set({ passwordHash: await hashPassword(next) }).where(eq(schema.users.id, u.id));
  await revokeOtherSessions(u.id, u.sessionId);
  return { ok: at("passwordChanged", l) };
}

export async function signOutOthersAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const l = loc(fd);
  const u = await mustUser(l);
  await revokeOtherSessions(u.id, u.sessionId);
  revalidatePath("/account/security");
  return { ok: at("signedOutOthers", l) };
}

/* ------------------------------------------------------------------ */
/* خرید و پرداخت                                                         */
/* ------------------------------------------------------------------ */
export async function checkoutAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const l = loc(fd);
  const u = await mustUser(l);
  if (fd.get("agree") !== "1") return fail(l, "errAgree");
  if (await limited("checkout", 20, 15 * 60_000, String(u.id))) return fail(l, "errTooMany");
  const settings = await getSettings();
  const g = gateway();
  const r = await createOrder({
    userId: u.id,
    planId: Number(fd.get("plan")),
    renewSubscriptionId: Number(fd.get("renew")) || null,
    couponCode: str(fd, "coupon") || null,
    customerNote: str(fd, "note") || null,
    locale: l,
  });
  if (!r.ok) return fail(l, r.error === "plan" || r.error === "subscription" || r.error === "user" ? "planUnavailable" : (r.error as AKey));
  const order = await db.query.orders.findFirst({ where: eq(schema.orders.id, r.orderId) });
  if (!order || order.status !== "pending") redirect(accHref(l, `orders/${r.orderId}`, { pay: "ok" }));
  if (!g) {
    if (settings.allowManualPayment) redirect(accHref(l, `orders/${r.orderId}`, { manual: 1 }));
    redirect(accHref(l, `orders/${r.orderId}`, { pay: "gateway" }));
  }
  const p = await startPayment(r.orderId, u.id);
  if (!p.ok) redirect(accHref(l, `orders/${r.orderId}`, { pay: "gateway" }));
  redirect(p.redirectUrl);
}

export async function payOrderAction(fd: FormData) {
  const l = loc(fd);
  const u = await mustUser(l);
  const id = Number(fd.get("order"));
  const p = await startPayment(id, u.id);
  if (!p.ok) redirect(accHref(l, `orders/${id}`, { pay: "gateway" }));
  redirect(p.redirectUrl);
}

export async function cancelOrderAction(fd: FormData) {
  const l = loc(fd);
  const u = await mustUser(l);
  const id = Number(fd.get("order"));
  await db.update(schema.orders).set({ status: "cancelled" }).where(and(eq(schema.orders.id, id), eq(schema.orders.userId, u.id), eq(schema.orders.status, "pending")));
  revalidatePath("/account", "layout");
  redirect(accHref(l, `orders/${id}`));
}

/* ------------------------------------------------------------------ */
/* پشتیبانی                                                             */
/* ------------------------------------------------------------------ */
export async function newTicketAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const l = loc(fd);
  const u = await mustUser(l);
  const subject = str(fd, "subject").slice(0, 200);
  const body = str(fd, "body").slice(0, 5000);
  if (!subject || !body) return fail(l, "errRequired");
  if (await limited("ticket", 10, 60 * 60_000, String(u.id))) return fail(l, "errTooMany");
  const pr = str(fd, "priority");
  const orderId = Number(fd.get("order")) || null;
  const ownOrder = orderId ? await db.query.orders.findFirst({ where: and(eq(schema.orders.id, orderId), eq(schema.orders.userId, u.id)) }) : null;
  const [t] = await db.insert(schema.tickets).values({
    userId: u.id, subject, priority: pr === "low" || pr === "high" ? pr : "normal", orderId: ownOrder ? ownOrder.id : null,
  }).returning({ id: schema.tickets.id });
  await db.insert(schema.ticketMessages).values({ ticketId: t.id, authorId: u.id, isStaff: false, body });
  redirect(accHref(l, `tickets/${t.id}`));
}

export async function replyTicketAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const l = loc(fd);
  const u = await mustUser(l);
  const id = Number(fd.get("ticket"));
  const body = str(fd, "body").slice(0, 5000);
  if (!body) return fail(l, "errRequired");
  const t = await db.query.tickets.findFirst({ where: and(eq(schema.tickets.id, id), eq(schema.tickets.userId, u.id)) });
  if (!t || t.status === "closed") return fail(l, "ticketClosed");
  await db.insert(schema.ticketMessages).values({ ticketId: id, authorId: u.id, isStaff: false, body });
  await db.update(schema.tickets).set({ status: "customer_reply" }).where(eq(schema.tickets.id, id));
  revalidatePath(`/account/tickets/${id}`);
  return { ok: " " };
}

export async function closeTicketAction(fd: FormData) {
  const l = loc(fd);
  const u = await mustUser(l);
  const id = Number(fd.get("ticket"));
  await db.update(schema.tickets).set({ status: "closed" }).where(and(eq(schema.tickets.id, id), eq(schema.tickets.userId, u.id)));
  redirect(accHref(l, `tickets/${id}`));
}
