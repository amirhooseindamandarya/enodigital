/**
 * مدل دادهٔ فروش اشتراک: کاربران، محصولات و پلن‌ها، سفارش‌ها، پرداخت‌ها، اشتراک‌ها، کوپن، تیکت و تنظیمات.
 * مبالغ همه به «ریال» و عدد صحیح ذخیره می‌شوند.
 */
import { relations, sql } from "drizzle-orm";
import { bigint, boolean, index, integer, jsonb, pgEnum, pgTable, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export type L10n = { fa: string; en?: string; ar?: string };
export type L10nList = { fa: string[]; en?: string[]; ar?: string[] };

const money = (name: string) => bigint(name, { mode: "number" }).notNull().default(0);
const created = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
const updated = () => timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date());

export const roleEnum = pgEnum("user_role", ["customer", "staff", "admin"]);
export const userStatusEnum = pgEnum("user_status", ["active", "blocked"]);
export const periodEnum = pgEnum("billing_period", ["monthly", "quarterly", "semiannual", "yearly", "one_time"]);
export const orderStatusEnum = pgEnum("order_status", ["pending", "paid", "completed", "cancelled", "failed", "refunded"]);
export const paymentStatusEnum = pgEnum("payment_status", ["initiated", "paid", "failed", "cancelled"]);
export const subStatusEnum = pgEnum("subscription_status", ["pending", "active", "expired", "cancelled", "suspended"]);
export const couponKindEnum = pgEnum("coupon_kind", ["percent", "fixed"]);
export const ticketStatusEnum = pgEnum("ticket_status", ["open", "answered", "customer_reply", "closed"]);
export const ticketPriorityEnum = pgEnum("ticket_priority", ["low", "normal", "high"]);

/* ---------------- کاربران و نشست‌ها ---------------- */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").notNull().default("customer"),
  status: userStatusEnum("status").notNull().default("active"),
  locale: text("locale").notNull().default("fa"),
  /** اطلاعات صورت‌حساب رسمی */
  company: text("company"),
  nationalId: text("national_id"),
  economicCode: text("economic_code"),
  postalCode: text("postal_code"),
  address: text("address"),
  createdAt: created(),
  updatedAt: updated(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
}, (t) => [uniqueIndex("users_phone_uq").on(t.phone), uniqueIndex("users_email_uq").on(sql`lower(${t.email})`)]);

export const sessions = pgTable("sessions", {
  /** sha256 توکن؛ خود توکن فقط در کوکی کاربر است */
  id: text("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: created(),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
  ip: text("ip"),
  userAgent: text("user_agent"),
}, (t) => [index("sessions_user_idx").on(t.userId)]);

export const otpCodes = pgTable("otp_codes", {
  id: serial("id").primaryKey(),
  phone: text("phone").notNull(),
  purpose: text("purpose").notNull(),
  codeHash: text("code_hash").notNull(),
  attempts: integer("attempts").notNull().default(0),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: created(),
}, (t) => [index("otp_phone_idx").on(t.phone, t.purpose)]);

/* ---------------- محصولات و پلن‌ها ---------------- */
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  name: jsonb("name").$type<L10n>().notNull(),
  description: jsonb("description").$type<L10n>().notNull().default({ fa: "" }),
  active: boolean("active").notNull().default(true),
  sort: integer("sort").notNull().default(0),
  createdAt: created(),
  updatedAt: updated(),
});

export const plans = pgTable("plans", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "restrict" }),
  name: jsonb("name").$type<L10n>().notNull(),
  description: jsonb("description").$type<L10n>().notNull().default({ fa: "" }),
  features: jsonb("features").$type<L10nList>().notNull().default({ fa: [] }),
  price: money("price"),
  period: periodEnum("period").notNull().default("monthly"),
  durationDays: integer("duration_days").notNull().default(30),
  highlighted: boolean("highlighted").notNull().default(false),
  active: boolean("active").notNull().default(true),
  sort: integer("sort").notNull().default(0),
  createdAt: created(),
  updatedAt: updated(),
}, (t) => [index("plans_product_idx").on(t.productId)]);

/* ---------------- سفارش و پرداخت ---------------- */
export type BuyerSnapshot = { name: string; phone: string; email?: string | null; company?: string | null; nationalId?: string | null; economicCode?: string | null; postalCode?: string | null; address?: string | null };

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "restrict" }),
  status: orderStatusEnum("status").notNull().default("pending"),
  subtotal: money("subtotal"),
  discount: money("discount"),
  taxRate: integer("tax_rate").notNull().default(0),
  tax: money("tax"),
  total: money("total"),
  couponCode: text("coupon_code"),
  buyer: jsonb("buyer").$type<BuyerSnapshot>().notNull(),
  customerNote: text("customer_note"),
  adminNote: text("admin_note"),
  locale: text("locale").notNull().default("fa"),
  createdAt: created(),
  updatedAt: updated(),
  paidAt: timestamp("paid_at", { withTimezone: true }),
}, (t) => [index("orders_user_idx").on(t.userId), index("orders_status_idx").on(t.status)]);

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id").notNull().references(() => products.id),
  planId: integer("plan_id").notNull().references(() => plans.id),
  /** اگر پر باشد، این قلم تمدید همین اشتراک است */
  renewSubscriptionId: integer("renew_subscription_id"),
  title: jsonb("title").$type<L10n>().notNull(),
  period: periodEnum("period").notNull(),
  durationDays: integer("duration_days").notNull(),
  unitPrice: money("unit_price"),
  quantity: integer("quantity").notNull().default(1),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  gateway: text("gateway").notNull(),
  amount: money("amount"),
  authority: text("authority"),
  refId: text("ref_id"),
  cardPan: text("card_pan"),
  status: paymentStatusEnum("status").notNull().default("initiated"),
  message: text("message"),
  raw: jsonb("raw"),
  createdAt: created(),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
}, (t) => [uniqueIndex("payments_authority_uq").on(t.gateway, t.authority), index("payments_order_idx").on(t.orderId)]);

/* ---------------- اشتراک‌ها ---------------- */
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "restrict" }),
  productId: integer("product_id").notNull().references(() => products.id),
  planId: integer("plan_id").notNull().references(() => plans.id),
  status: subStatusEnum("status").notNull().default("pending"),
  startsAt: timestamp("starts_at", { withTimezone: true }),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  /** اطلاعات دسترسی که تیم پس از راه‌اندازی برای مشتری ثبت می‌کند */
  accessUrl: text("access_url"),
  accessNote: text("access_note"),
  lastOrderId: integer("last_order_id"),
  createdAt: created(),
  updatedAt: updated(),
}, (t) => [index("subs_user_idx").on(t.userId), index("subs_ends_idx").on(t.endsAt)]);

/* ---------------- کوپن ---------------- */
export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(),
  kind: couponKindEnum("kind").notNull().default("percent"),
  value: integer("value").notNull(),
  productId: integer("product_id").references(() => products.id, { onDelete: "set null" }),
  maxUses: integer("max_uses"),
  usedCount: integer("used_count").notNull().default(0),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  active: boolean("active").notNull().default(true),
  createdAt: created(),
}, (t) => [uniqueIndex("coupons_code_uq").on(sql`upper(${t.code})`)]);

/* ---------------- پشتیبانی ---------------- */
export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  subject: text("subject").notNull(),
  status: ticketStatusEnum("status").notNull().default("open"),
  priority: ticketPriorityEnum("priority").notNull().default("normal"),
  orderId: integer("order_id").references(() => orders.id, { onDelete: "set null" }),
  createdAt: created(),
  updatedAt: updated(),
}, (t) => [index("tickets_user_idx").on(t.userId), index("tickets_status_idx").on(t.status)]);

export const ticketMessages = pgTable("ticket_messages", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id").notNull().references(() => tickets.id, { onDelete: "cascade" }),
  authorId: integer("author_id").references(() => users.id, { onDelete: "set null" }),
  isStaff: boolean("is_staff").notNull().default(false),
  body: text("body").notNull(),
  createdAt: created(),
});

/* ---------------- تنظیمات و گزارش فعالیت ---------------- */
export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: updated(),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  actorId: integer("actor_id").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: text("entity_id"),
  data: jsonb("data"),
  createdAt: created(),
}, (t) => [index("audit_entity_idx").on(t.entity, t.entityId)]);

/* ---------------- روابط ---------------- */
export const usersRel = relations(users, ({ many }) => ({ orders: many(orders), subscriptions: many(subscriptions), tickets: many(tickets) }));
export const productsRel = relations(products, ({ many }) => ({ plans: many(plans) }));
export const plansRel = relations(plans, ({ one }) => ({ product: one(products, { fields: [plans.productId], references: [products.id] }) }));
export const ordersRel = relations(orders, ({ one, many }) => ({ user: one(users, { fields: [orders.userId], references: [users.id] }), items: many(orderItems), payments: many(payments) }));
export const orderItemsRel = relations(orderItems, ({ one }) => ({ order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }), plan: one(plans, { fields: [orderItems.planId], references: [plans.id] }), product: one(products, { fields: [orderItems.productId], references: [products.id] }) }));
export const paymentsRel = relations(payments, ({ one }) => ({ order: one(orders, { fields: [payments.orderId], references: [orders.id] }) }));
export const subscriptionsRel = relations(subscriptions, ({ one }) => ({ user: one(users, { fields: [subscriptions.userId], references: [users.id] }), product: one(products, { fields: [subscriptions.productId], references: [products.id] }), plan: one(plans, { fields: [subscriptions.planId], references: [plans.id] }) }));
export const ticketsRel = relations(tickets, ({ one, many }) => ({ user: one(users, { fields: [tickets.userId], references: [users.id] }), messages: many(ticketMessages) }));
export const ticketMessagesRel = relations(ticketMessages, ({ one }) => ({ ticket: one(tickets, { fields: [ticketMessages.ticketId], references: [tickets.id] }), author: one(users, { fields: [ticketMessages.authorId], references: [users.id] }) }));
