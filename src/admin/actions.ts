"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { and, eq, ne, sql, count, or } from "drizzle-orm";
import { db, schema } from "@/server/db";
import { hashPassword, passwordProblem, verifyPassword } from "@/server/auth/password";
import { createSession, destroySession, revokeAllSessions } from "@/server/auth/session";
import { requireStaff } from "@/server/auth/guards";
import { limited } from "@/server/rate-limit";
import { latinDigits, normalizeEmail, normalizePhone } from "@/server/phone";
import { fulfillOrder, orderNumber } from "@/server/orders";
import { notify } from "@/server/sms";
import { audit } from "@/server/audit";
import { getSettings, saveSettings, type StoreSettings } from "@/server/settings";
import type { ActionState } from "@/account/form";

const s = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const n = (fd: FormData, k: string) => { const v = Number(latinDigits(s(fd, k)).replace(/[,٬\s]/g, "")); return Number.isFinite(v) ? v : 0; };
const b = (fd: FormData, k: string) => fd.get(k) === "on" || fd.get(k) === "1";
const nul = (v: string) => v || null;
const l10n = (fd: FormData, k: string) => ({ fa: s(fd, `${k}_fa`), en: s(fd, `${k}_en`), ar: s(fd, `${k}_ar`) });
const lines = (fd: FormData, k: string) => s(fd, k).split("\n").map((x) => x.trim()).filter(Boolean);
const ok = (msg = "ذخیره شد."): ActionState => ({ ok: msg });
const err = (msg: string): ActionState => ({ error: msg });
const KEY = /^[a-z][a-z0-9_-]*$/;
const PERIODS = schema.periodEnum.enumValues;

/* ------------------------------------------------------------------ */
/* ورود                                                                 */
/* ------------------------------------------------------------------ */
export async function adminLoginAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const id = latinDigits(s(fd, "identifier"));
  const pw = String(fd.get("password") ?? "");
  if (!id || !pw) return err("شماره/ایمیل و رمز عبور را وارد کنید.");
  if (await limited("admin-login", 8, 15 * 60_000, id.toLowerCase())) return err("تلاش‌ها بیش از حد بود؛ چند دقیقهٔ دیگر امتحان کنید.");
  const phone = normalizePhone(id);
  const email = normalizeEmail(id);
  const user = phone ? await db.query.users.findFirst({ where: eq(schema.users.phone, phone) })
    : email ? await db.query.users.findFirst({ where: eq(schema.users.email, email) }) : undefined;
  if (!user || user.role === "customer" || user.status !== "active" || !(await verifyPassword(pw, user.passwordHash))) return err("اطلاعات ورود درست نیست یا دسترسی مدیریت ندارید.");
  await createSession(user.id);
  await audit(user.id, "login", "user", user.id);
  redirect("/admin/");
}

export async function adminLogoutAction() {
  await destroySession();
  redirect("/admin/login/");
}

/* ------------------------------------------------------------------ */
/* محصولات و پلن‌ها                                                     */
/* ------------------------------------------------------------------ */
export async function saveProductAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const me = await requireStaff(true);
  const id = n(fd, "id");
  const key = s(fd, "key").toLowerCase();
  const name = l10n(fd, "name");
  if (!KEY.test(key)) return err("شناسه باید با حرف انگلیسی کوچک شروع شود و فقط حرف، عدد، - و _ داشته باشد.");
  if (!name.fa) return err("نام فارسی محصول لازم است.");
  const dup = await db.query.products.findFirst({ where: id ? and(eq(schema.products.key, key), ne(schema.products.id, id)) : eq(schema.products.key, key) });
  if (dup) return err("این شناسه برای محصول دیگری استفاده شده است.");
  const values = { key, name, description: l10n(fd, "desc"), active: b(fd, "active"), sort: n(fd, "sort") };
  if (id) await db.update(schema.products).set(values).where(eq(schema.products.id, id));
  else {
    const [p] = await db.insert(schema.products).values(values).$returningId();
    await audit(me.id, "create", "product", p.id, { key });
    redirect(`/admin/products/${p.id}/`);
  }
  await audit(me.id, "update", "product", id, { key });
  revalidatePath("/admin", "layout");
  return ok();
}

export async function savePlanAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const me = await requireStaff(true);
  const id = n(fd, "id");
  const productId = n(fd, "productId");
  const name = l10n(fd, "name");
  const period = s(fd, "period") as (typeof PERIODS)[number];
  const priceToman = n(fd, "price");
  const durationDays = Math.round(n(fd, "durationDays"));
  if (!name.fa) return err("نام فارسی پلن لازم است.");
  if (!PERIODS.includes(period)) return err("دورهٔ پرداخت نامعتبر است.");
  if (priceToman < 0) return err("قیمت نمی‌تواند منفی باشد.");
  if (durationDays < 0 || (period !== "one_time" && durationDays < 1)) return err("مدت اشتراک (روز) را وارد کنید.");
  const product = await db.query.products.findFirst({ where: eq(schema.products.id, productId) });
  if (!product) return err("محصول پیدا نشد.");
  const values = {
    productId, name, description: l10n(fd, "desc"),
    features: { fa: lines(fd, "features_fa"), en: lines(fd, "features_en"), ar: lines(fd, "features_ar") },
    price: Math.round(priceToman) * 10, period, durationDays, highlighted: b(fd, "highlighted"), active: b(fd, "active"), sort: n(fd, "sort"),
  };
  if (id) await db.update(schema.plans).set(values).where(eq(schema.plans.id, id));
  else await db.insert(schema.plans).values(values);
  await audit(me.id, id ? "update" : "create", "plan", id || undefined, { productId, price: values.price });
  revalidatePath("/admin", "layout");
  return ok(id ? "ذخیره شد." : "پلن اضافه شد.");
}

export async function deletePlanAction(fd: FormData) {
  const me = await requireStaff(true);
  const id = n(fd, "id");
  const plan = await db.query.plans.findFirst({ where: eq(schema.plans.id, id) });
  if (!plan) redirect("/admin/products/");
  const [used] = await db.select({ c: count() }).from(schema.orderItems).where(eq(schema.orderItems.planId, id));
  if ((used?.c ?? 0) > 0) await db.update(schema.plans).set({ active: false }).where(eq(schema.plans.id, id));
  else await db.delete(schema.plans).where(eq(schema.plans.id, id));
  await audit(me.id, used?.c ? "deactivate" : "delete", "plan", id);
  redirect(`/admin/products/${plan.productId}/`);
}

/* ------------------------------------------------------------------ */
/* سفارش‌ها                                                              */
/* ------------------------------------------------------------------ */
export async function orderStatusAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const me = await requireStaff();
  const id = n(fd, "id");
  const status = s(fd, "status") as (typeof schema.orderStatusEnum.enumValues)[number];
  const order = await db.query.orders.findFirst({ where: eq(schema.orders.id, id) });
  if (!order) return err("سفارش پیدا نشد.");
  if (status === "paid" && !order.paidAt) {
    // تأیید پرداخت دستی: اشتراک فعال/تمدید می‌شود
    await fulfillOrder(id, null, { manual: true });
    notify(order.buyer.phone, "order_paid", orderNumber(id));
  } else if (schema.orderStatusEnum.enumValues.includes(status)) {
    await db.update(schema.orders).set({ status }).where(eq(schema.orders.id, id));
  } else return err("وضعیت نامعتبر است.");
  await db.update(schema.orders).set({ adminNote: nul(s(fd, "adminNote")) }).where(eq(schema.orders.id, id));
  await audit(me.id, "status", "order", id, { from: order.status, to: status });
  revalidatePath("/admin", "layout");
  return ok();
}

/* ------------------------------------------------------------------ */
/* اشتراک‌ها                                                             */
/* ------------------------------------------------------------------ */
export async function saveSubscriptionAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const me = await requireStaff();
  const id = n(fd, "id");
  const sub = await db.query.subscriptions.findFirst({ where: eq(schema.subscriptions.id, id) });
  if (!sub) return err("اشتراک پیدا نشد.");
  const status = s(fd, "status") as (typeof schema.subStatusEnum.enumValues)[number];
  if (!schema.subStatusEnum.enumValues.includes(status)) return err("وضعیت نامعتبر است.");
  const day = (k: string) => { const v = s(fd, k); return v ? new Date(`${v}T00:00:00+03:30`) : null; };
  let endsAt = day("endsAt") ?? sub.endsAt;
  const extend = Math.round(n(fd, "extendDays"));
  if (extend) endsAt = new Date((endsAt && endsAt > new Date() ? endsAt : new Date()).getTime() + extend * 86400_000);
  const accessUrl = s(fd, "accessUrl");
  if (accessUrl && !/^https?:\/\//.test(accessUrl)) return err("آدرس دسترسی باید با https:// شروع شود.");
  await db.update(schema.subscriptions).set({
    status: extend && status === "expired" ? "active" : status,
    startsAt: day("startsAt") ?? sub.startsAt, endsAt,
    accessUrl: nul(accessUrl), accessNote: nul(s(fd, "accessNote").slice(0, 2000)),
  }).where(eq(schema.subscriptions.id, id));
  await audit(me.id, "update", "subscription", id, { status, extend });
  revalidatePath("/admin", "layout");
  return ok();
}

/* ------------------------------------------------------------------ */
/* مشتریان                                                              */
/* ------------------------------------------------------------------ */
export async function saveCustomerAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const me = await requireStaff();
  const id = n(fd, "id");
  const name = s(fd, "name");
  const phone = normalizePhone(s(fd, "phone"));
  const emailRaw = s(fd, "email");
  const email = emailRaw ? normalizeEmail(emailRaw) : null;
  if (name.length < 2) return err("نام لازم است.");
  if (!phone) return err("شمارهٔ موبایل معتبر نیست.");
  if (emailRaw && !email) return err("ایمیل معتبر نیست.");
  const dup = await db.query.users.findFirst({ where: and(id ? ne(schema.users.id, id) : sql`true`, email ? or(eq(schema.users.phone, phone), eq(schema.users.email, email)) : eq(schema.users.phone, phone)) });
  if (dup) return err(dup.phone === phone ? "این شماره برای کاربر دیگری ثبت شده است." : "این ایمیل برای کاربر دیگری ثبت شده است.");
  const values = {
    name, phone, email,
    company: nul(s(fd, "company")), nationalId: nul(latinDigits(s(fd, "nationalId"))), economicCode: nul(latinDigits(s(fd, "economicCode"))),
    postalCode: nul(latinDigits(s(fd, "postalCode"))), address: nul(s(fd, "address")),
    status: (s(fd, "status") === "blocked" ? "blocked" : "active") as "active" | "blocked",
  };
  const pw = String(fd.get("password") ?? "");
  if (!id) {
    if (passwordProblem(pw)) return err("برای کاربر جدید رمز عبور حداقل ۸ نویسه‌ای تعیین کنید.");
    const [u] = await db.insert(schema.users).values({ ...values, passwordHash: await hashPassword(pw) }).$returningId();
    await audit(me.id, "create", "user", u.id);
    redirect(`/admin/customers/${u.id}/`);
  }
  const target = await db.query.users.findFirst({ where: eq(schema.users.id, id) });
  if (!target) return err("کاربر پیدا نشد.");
  if (target.role !== "customer" && me.role !== "admin") return err("فقط مدیر کل می‌تواند حساب کارکنان را ویرایش کند.");
  await db.update(schema.users).set(values).where(eq(schema.users.id, id));
  if (values.status === "blocked") await revokeAllSessions(id);
  if (pw) {
    if (passwordProblem(pw)) return err("رمز عبور جدید باید حداقل ۸ نویسه باشد.");
    await db.update(schema.users).set({ passwordHash: await hashPassword(pw) }).where(eq(schema.users.id, id));
    await revokeAllSessions(id);
  }
  await audit(me.id, "update", "user", id, { status: values.status, passwordReset: !!pw });
  revalidatePath("/admin", "layout");
  return ok();
}

/* ------------------------------------------------------------------ */
/* کوپن                                                                 */
/* ------------------------------------------------------------------ */
export async function saveCouponAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const me = await requireStaff(true);
  const id = n(fd, "id");
  const code = s(fd, "code").toUpperCase();
  const kind = s(fd, "kind") === "fixed" ? "fixed" : "percent";
  const value = Math.round(n(fd, "value"));
  if (!/^[A-Z0-9_-]{3,32}$/.test(code)) return err("کد باید ۳ تا ۳۲ نویسهٔ انگلیسی، عدد، - یا _ باشد.");
  if (value <= 0 || (kind === "percent" && value > 100)) return err("مقدار تخفیف نامعتبر است (درصد بین ۱ تا ۱۰۰).");
  const dup = await db.query.coupons.findFirst({ where: and(eq(schema.coupons.code, code), id ? ne(schema.coupons.id, id) : sql`true`) });
  if (dup) return err("این کد قبلاً ساخته شده است.");
  const exp = s(fd, "expiresAt");
  const values = {
    code, kind: kind as "percent" | "fixed", value,
    productId: n(fd, "productId") || null,
    maxUses: s(fd, "maxUses") ? Math.round(n(fd, "maxUses")) : null,
    expiresAt: exp ? new Date(`${exp}T23:59:59+03:30`) : null,
    active: b(fd, "active"),
  };
  if (id) await db.update(schema.coupons).set(values).where(eq(schema.coupons.id, id));
  else await db.insert(schema.coupons).values(values);
  await audit(me.id, id ? "update" : "create", "coupon", id || code);
  revalidatePath("/admin", "layout");
  return ok(id ? "ذخیره شد." : "کد تخفیف ساخته شد.");
}

export async function deleteCouponAction(fd: FormData) {
  const me = await requireStaff(true);
  const id = n(fd, "id");
  await db.delete(schema.coupons).where(eq(schema.coupons.id, id));
  await audit(me.id, "delete", "coupon", id);
  redirect("/admin/coupons/");
}

/* ------------------------------------------------------------------ */
/* تیکت                                                                 */
/* ------------------------------------------------------------------ */
export async function staffReplyAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const me = await requireStaff();
  const id = n(fd, "ticket");
  const body = s(fd, "body").slice(0, 5000);
  const t = await db.query.tickets.findFirst({ where: eq(schema.tickets.id, id), with: { user: true } });
  if (!t) return err("تیکت پیدا نشد.");
  if (body) {
    await db.insert(schema.ticketMessages).values({ ticketId: id, authorId: me.id, isStaff: true, body });
    notify(t.user.phone, "ticket_reply", String(id));
  }
  const st = s(fd, "status") as (typeof schema.ticketStatusEnum.enumValues)[number];
  await db.update(schema.tickets).set({ status: schema.ticketStatusEnum.enumValues.includes(st) ? st : body ? "answered" : t.status }).where(eq(schema.tickets.id, id));
  await audit(me.id, "reply", "ticket", id);
  revalidatePath("/admin", "layout");
  return { ok: body ? "پاسخ ارسال شد." : "وضعیت ذخیره شد." };
}

/* ------------------------------------------------------------------ */
/* تنظیمات و کارکنان                                                     */
/* ------------------------------------------------------------------ */
export async function saveSettingsAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const me = await requireStaff(true);
  const cur = await getSettings();
  const tax = n(fd, "taxRate");
  if (tax < 0 || tax > 50) return err("درصد مالیات نامعتبر است.");
  const v: StoreSettings = {
    ...cur,
    taxRate: tax,
    expiryWarnDays: Math.max(1, Math.round(n(fd, "expiryWarnDays")) || 14),
    allowManualPayment: b(fd, "allowManualPayment"),
    manualPaymentNote: s(fd, "manualPaymentNote").slice(0, 1000),
    seller: {
      name: s(fd, "seller_name"), nationalId: latinDigits(s(fd, "seller_nationalId")), economicCode: latinDigits(s(fd, "seller_economicCode")),
      registrationNo: latinDigits(s(fd, "seller_registrationNo")), postalCode: latinDigits(s(fd, "seller_postalCode")), address: s(fd, "seller_address"), phone: s(fd, "seller_phone"),
    },
  };
  await saveSettings(v);
  await audit(me.id, "update", "settings", "store");
  return ok();
}

export async function saveStaffAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const me = await requireStaff(true);
  const id = n(fd, "id");
  const role = s(fd, "role") as "customer" | "staff" | "admin";
  if (!["customer", "staff", "admin"].includes(role)) return err("نقش نامعتبر است.");
  if (id) {
    if (id === me.id && role !== "admin") return err("نمی‌توانید نقش مدیر کل را از خودتان بگیرید.");
    await db.update(schema.users).set({ role }).where(eq(schema.users.id, id));
    await audit(me.id, "role", "user", id, { role });
    revalidatePath("/admin", "layout");
    return ok();
  }
  const phone = normalizePhone(s(fd, "phone"));
  if (!phone) return err("شمارهٔ موبایل معتبر نیست.");
  const existing = await db.query.users.findFirst({ where: eq(schema.users.phone, phone) });
  if (existing) {
    await db.update(schema.users).set({ role }).where(eq(schema.users.id, existing.id));
    await audit(me.id, "role", "user", existing.id, { role });
  } else {
    const name = s(fd, "name");
    const pw = String(fd.get("password") ?? "");
    if (name.length < 2) return err("نام لازم است.");
    if (passwordProblem(pw)) return err("رمز عبور حداقل ۸ نویسه.");
    const [u] = await db.insert(schema.users).values({ name, phone, passwordHash: await hashPassword(pw), role }).$returningId();
    await audit(me.id, "create", "user", u.id, { role });
  }
  revalidatePath("/admin", "layout");
  return ok("کاربر به کارکنان اضافه شد.");
}
