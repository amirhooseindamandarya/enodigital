import "server-only";
import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";
import { db, schema } from "./db";
import { gateway, gatewayByName } from "./payments";
import { fulfillOrder, orderNumber } from "./orders";

export async function appUrl() {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
  return `${proto}://${host}`;
}

const accountPrefix = (locale: string) => (locale === "en" || locale === "ar" ? `/${locale}` : "");
export const orderPagePath = (locale: string, id: number) => `${accountPrefix(locale)}/account/orders/${id}/`;

export type StartPaymentResult = { ok: true; redirectUrl: string } | { ok: false; error: "order" | "gateway" | "gateway_error"; message?: string };

/** آغاز پرداخت یک سفارش در انتظار پرداخت */
export async function startPayment(orderId: number, userId: number): Promise<StartPaymentResult> {
  const order = await db.query.orders.findFirst({ where: and(eq(schema.orders.id, orderId), eq(schema.orders.userId, userId)) });
  if (!order || (order.status !== "pending" && order.status !== "failed") || order.total <= 0) return { ok: false, error: "order" };
  const g = gateway();
  if (!g) return { ok: false, error: "gateway" };
  const base = await appUrl();
  try {
    const start = await g.request({
      amount: order.total,
      orderId: order.id,
      callbackUrl: `${base}/api/payments/callback/?gw=${g.name}&order=${order.id}`,
      description: `سفارش ${orderNumber(order.id)}`,
      mobile: order.buyer.phone.startsWith("09") ? order.buyer.phone : undefined,
      email: order.buyer.email,
    });
    await db.insert(schema.payments).values({ orderId: order.id, gateway: g.name, amount: order.total, authority: start.authority, status: "initiated" });
    if (order.status === "failed") await db.update(schema.orders).set({ status: "pending" }).where(eq(schema.orders.id, order.id));
    return { ok: true, redirectUrl: start.redirectUrl };
  } catch (e) {
    return { ok: false, error: "gateway_error", message: e instanceof Error ? e.message : undefined };
  }
}

/** بازگشت از درگاه: تأیید پرداخت و فعال‌سازی سفارش. مسیر صفحهٔ نتیجه را برمی‌گرداند */
export async function handleCallback(gw: string, authority: string, status: string): Promise<string> {
  const payment = await db.query.payments.findFirst({ where: and(eq(schema.payments.gateway, gw), eq(schema.payments.authority, authority)), with: { order: true } });
  if (!payment) return "/account/orders/?pay=unknown";
  const page = orderPagePath(payment.order.locale, payment.orderId);
  if (payment.status === "paid") return `${page}?pay=ok`;

  if (status !== "OK") {
    await db.update(schema.payments).set({ status: "cancelled", message: "انصراف کاربر یا خطای درگاه" }).where(eq(schema.payments.id, payment.id));
    return `${page}?pay=cancelled`;
  }
  const g = gatewayByName(gw);
  if (!g) return `${page}?pay=failed`;
  const v = await g.verify(authority, payment.amount);
  if (!v.ok) {
    await db.update(schema.payments).set({ status: "failed", message: v.message ?? null, raw: v.raw ?? null }).where(eq(schema.payments.id, payment.id));
    return `${page}?pay=failed`;
  }
  await fulfillOrder(payment.orderId, { id: payment.id, refId: v.refId, cardPan: v.cardPan, raw: v.raw });
  return `${page}?pay=ok`;
}
