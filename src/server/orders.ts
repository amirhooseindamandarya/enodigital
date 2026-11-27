import "server-only";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { db, schema } from "./db";
import { getSettings } from "./settings";
import type { BuyerSnapshot, L10n } from "./db/schema";

export type Period = (typeof schema.periodEnum.enumValues)[number];

/* ------------------------------------------------------------------ */
/* کاتالوگ                                                              */
/* ------------------------------------------------------------------ */
export async function activeCatalog(productKey?: string) {
  const prods = await db.query.products.findMany({
    where: productKey ? and(eq(schema.products.active, true), eq(schema.products.key, productKey)) : eq(schema.products.active, true),
    orderBy: [asc(schema.products.sort), asc(schema.products.id)],
    with: { plans: { where: eq(schema.plans.active, true), orderBy: [asc(schema.plans.sort), asc(schema.plans.price)] } },
  });
  return prods.filter((p) => p.plans.length > 0);
}

/* ------------------------------------------------------------------ */
/* کوپن                                                                 */
/* ------------------------------------------------------------------ */
export type CouponCheck = { ok: true; coupon: typeof schema.coupons.$inferSelect } | { ok: false; reason: "notfound" | "expired" | "used" | "product" | "inactive" };

export async function checkCoupon(code: string, productId: number): Promise<CouponCheck> {
  const c = await db.query.coupons.findFirst({ where: sql`upper(${schema.coupons.code}) = upper(${code.trim()})` });
  if (!c) return { ok: false, reason: "notfound" };
  if (!c.active) return { ok: false, reason: "inactive" };
  if (c.expiresAt && c.expiresAt < new Date()) return { ok: false, reason: "expired" };
  if (c.maxUses != null && c.usedCount >= c.maxUses) return { ok: false, reason: "used" };
  if (c.productId && c.productId !== productId) return { ok: false, reason: "product" };
  return { ok: true, coupon: c };
}

/* ------------------------------------------------------------------ */
/* محاسبهٔ مبلغ                                                         */
/* ------------------------------------------------------------------ */
export function computeTotals(unitPrice: number, quantity: number, coupon: { kind: "percent" | "fixed"; value: number } | null, taxRate: number) {
  const subtotal = unitPrice * quantity;
  let discount = 0;
  if (coupon) discount = coupon.kind === "percent" ? Math.floor((subtotal * Math.min(100, coupon.value)) / 100) : Math.min(subtotal, coupon.value * 10);
  const taxable = subtotal - discount;
  const tax = Math.round((taxable * taxRate) / 100);
  return { subtotal, discount, tax, total: taxable + tax };
}

/* ------------------------------------------------------------------ */
/* ثبت سفارش                                                            */
/* ------------------------------------------------------------------ */
export type CreateOrderInput = {
  userId: number;
  planId: number;
  renewSubscriptionId?: number | null;
  couponCode?: string | null;
  customerNote?: string | null;
  locale: string;
};
export type CreateOrderResult = { ok: true; orderId: number } | { ok: false; error: "plan" | "subscription" | `coupon_${Exclude<CouponCheck, { ok: true }>["reason"]}` | "user" };

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  const plan = await db.query.plans.findFirst({ where: and(eq(schema.plans.id, input.planId), eq(schema.plans.active, true)), with: { product: true } });
  if (!plan || !plan.product.active) return { ok: false, error: "plan" };
  const user = await db.query.users.findFirst({ where: eq(schema.users.id, input.userId) });
  if (!user || user.status !== "active") return { ok: false, error: "user" };

  if (input.renewSubscriptionId) {
    const sub = await db.query.subscriptions.findFirst({ where: and(eq(schema.subscriptions.id, input.renewSubscriptionId), eq(schema.subscriptions.userId, user.id)) });
    if (!sub || sub.productId !== plan.productId || sub.status === "cancelled") return { ok: false, error: "subscription" };
  }

  let coupon: { kind: "percent" | "fixed"; value: number; code: string } | null = null;
  if (input.couponCode?.trim()) {
    const c = await checkCoupon(input.couponCode, plan.productId);
    if (!c.ok) return { ok: false, error: `coupon_${c.reason}` };
    coupon = { kind: c.coupon.kind, value: c.coupon.value, code: c.coupon.code };
  }

  const settings = await getSettings();
  const totals = computeTotals(plan.price, 1, coupon, settings.taxRate);
  const buyer: BuyerSnapshot = { name: user.name, phone: user.phone, email: user.email, company: user.company, nationalId: user.nationalId, economicCode: user.economicCode, postalCode: user.postalCode, address: user.address };
  const title: L10n = {
    fa: `${plan.product.name.fa} — ${plan.name.fa}`,
    en: `${plan.product.name.en || plan.product.name.fa} — ${plan.name.en || plan.name.fa}`,
    ar: `${plan.product.name.ar || plan.product.name.fa} — ${plan.name.ar || plan.name.fa}`,
  };

  const orderId = await db.transaction(async (tx) => {
    const [o] = await tx.insert(schema.orders).values({
      userId: user.id, status: totals.total === 0 ? "paid" : "pending", ...totals, taxRate: settings.taxRate,
      couponCode: coupon?.code ?? null, buyer, customerNote: input.customerNote?.slice(0, 2000) || null, locale: input.locale,
    }).returning({ id: schema.orders.id });
    await tx.insert(schema.orderItems).values({
      orderId: o.id, productId: plan.productId, planId: plan.id, renewSubscriptionId: input.renewSubscriptionId ?? null,
      title, period: plan.period, durationDays: plan.durationDays, unitPrice: plan.price, quantity: 1,
    });
    return o.id;
  });

  // سفارش رایگان (مثلاً کوپن ۱۰۰٪) بلافاصله فعال می‌شود
  if (totals.total === 0) await fulfillOrder(orderId, null);
  return { ok: true, orderId };
}

/* ------------------------------------------------------------------ */
/* پس از پرداخت: فعال‌سازی یا تمدید اشتراک                              */
/* ------------------------------------------------------------------ */
/** idempotent: اگر سفارش قبلاً پرداخت شده باشد کاری نمی‌کند */
export async function fulfillOrder(orderId: number, payment: { id: number; refId?: string; cardPan?: string; raw?: unknown } | null, opts: { manual?: boolean } = {}) {
  return db.transaction(async (tx) => {
    // قفل ردیف سفارش برای جلوگیری از فعال‌سازی دوباره در درخواست‌های هم‌زمان
    const [order] = await tx.select().from(schema.orders).where(eq(schema.orders.id, orderId)).for("update");
    if (!order) return { ok: false as const };
    const already = await tx.query.orderItems.findMany({ where: eq(schema.orderItems.orderId, orderId) });
    const now = new Date();

    if (payment) {
      await tx.update(schema.payments).set({ status: "paid", refId: payment.refId ?? null, cardPan: payment.cardPan ?? null, raw: payment.raw ?? null, verifiedAt: now }).where(eq(schema.payments.id, payment.id));
    }
    if (order.paidAt && order.status !== "pending" && order.status !== "failed") return { ok: true as const, already: true };

    await tx.update(schema.orders).set({ status: "paid", paidAt: now, ...(opts.manual ? { adminNote: sql`coalesce(${schema.orders.adminNote} || E'\\n', '') || 'پرداخت دستی تأیید شد'` } : {}) }).where(eq(schema.orders.id, orderId));
    if (order.couponCode) await tx.update(schema.coupons).set({ usedCount: sql`${schema.coupons.usedCount} + 1` }).where(sql`upper(${schema.coupons.code}) = upper(${order.couponCode})`);

    for (const it of already) {
      const days = it.durationDays * it.quantity;
      if (it.renewSubscriptionId) {
        const [sub] = await tx.select().from(schema.subscriptions).where(eq(schema.subscriptions.id, it.renewSubscriptionId)).for("update");
        if (sub) {
          const base = sub.endsAt && sub.endsAt > now ? sub.endsAt : now;
          await tx.update(schema.subscriptions).set({
            planId: it.planId, status: "active", startsAt: sub.startsAt ?? now,
            endsAt: new Date(base.getTime() + days * 86400_000), lastOrderId: orderId,
          }).where(eq(schema.subscriptions.id, sub.id));
          continue;
        }
      }
      await tx.insert(schema.subscriptions).values({
        userId: order.userId, productId: it.productId, planId: it.planId, status: "active",
        startsAt: now, endsAt: it.period === "one_time" && days === 0 ? null : new Date(now.getTime() + days * 86400_000), lastOrderId: orderId,
      });
    }
    return { ok: true as const, already: false };
  });
}

/** وضعیت واقعی اشتراک (اشتراک فعالِ گذشته از تاریخ = منقضی) */
export function effectiveSubStatus(s: { status: string; endsAt: Date | null }) {
  if (s.status === "active" && s.endsAt && s.endsAt < new Date()) return "expired" as const;
  return s.status as (typeof schema.subStatusEnum.enumValues)[number];
}

/** به‌روزرسانی دسته‌ای اشتراک‌های منقضی (در داشبورد مدیریت اجرا می‌شود) */
export async function sweepExpired() {
  await db.update(schema.subscriptions).set({ status: "expired" }).where(and(eq(schema.subscriptions.status, "active"), sql`${schema.subscriptions.endsAt} < now()`));
}

export async function userOrders(userId: number) {
  return db.query.orders.findMany({ where: eq(schema.orders.userId, userId), orderBy: desc(schema.orders.id), with: { items: true } });
}

export async function cancelPendingOrders(ids: number[]) {
  if (ids.length) await db.update(schema.orders).set({ status: "cancelled" }).where(and(inArray(schema.orders.id, ids), eq(schema.orders.status, "pending")));
}

export const orderNumber = (id: number) => `ENO-${1000 + id}`;
