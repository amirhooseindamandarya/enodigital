/**
 * مدل دادهٔ فروش اشتراک (MySQL 8 / MariaDB 10.5+):
 * کاربران، محصولات و پلن‌ها، سفارش‌ها، پرداخت‌ها، اشتراک‌ها، کوپن، تیکت و تنظیمات.
 * مبالغ همه عدد صحیح‌اند: قیمت ریالی به «ریال» و قیمت دلاری به «سنت»؛ مبلغ سفارش همیشه ریال است.
 * زمان‌ها به UTC ذخیره می‌شوند.
 */
import { relations } from "drizzle-orm";
import {
  bigint, boolean, customType, datetime, index, int, mysqlEnum, mysqlTable, text, uniqueIndex, varchar,
} from "drizzle-orm/mysql-core";

export type L10n = { fa: string; en?: string; ar?: string };
export type L10nList = { fa: string[]; en?: string[]; ar?: string[] };

/** JSON که در MySQL (نوع JSON) و MariaDB (LONGTEXT) یکسان کار کند */
const json = <T>(name: string) =>
  customType<{ data: T; driverData: string | T }>({
    dataType: () => "json",
    toDriver: (v) => JSON.stringify(v) as unknown as T,
    fromDriver: (v) => (typeof v === "string" ? (JSON.parse(v) as T) : v),
  })(name);

/** کلید اصلی BIGINT UNSIGNED AUTO_INCREMENT (سازگار با MySQL و MariaDB؛ SERIAL در MariaDB خطا می‌دهد) */
const id = () => bigint("id", { mode: "number", unsigned: true }).autoincrement().primaryKey();
/** کلید خارجی به serial (BIGINT UNSIGNED) */
const ref = (name: string) => bigint(name, { mode: "number", unsigned: true });
const money = (name: string) => bigint(name, { mode: "number" }).notNull().default(0);
const time = (name: string) => datetime(name, { mode: "date", fsp: 3 });
const created = () => time("created_at").notNull().$defaultFn(() => new Date());
const updated = () => time("updated_at").notNull().$defaultFn(() => new Date()).$onUpdate(() => new Date());

export const ROLES = ["customer", "staff", "admin"] as const;
export const USER_STATUS = ["active", "blocked"] as const;
export const PERIODS = ["monthly", "quarterly", "semiannual", "yearly", "one_time"] as const;
export const ORDER_STATUS = ["pending", "paid", "completed", "cancelled", "failed", "refunded"] as const;
export const PAYMENT_STATUS = ["initiated", "paid", "failed", "cancelled"] as const;
export const SUB_STATUS = ["pending", "active", "expired", "cancelled", "suspended"] as const;
export const COUPON_KIND = ["percent", "fixed"] as const;
export const TICKET_STATUS = ["open", "answered", "customer_reply", "closed"] as const;
export const TICKET_PRIORITY = ["low", "normal", "high"] as const;
/** IRR: قیمت به ریال · USD: قیمت به سنت (هنگام خرید با نرخ روز به ریال تبدیل می‌شود) */
export const CURRENCIES = ["IRR", "USD"] as const;
export type Currency = (typeof CURRENCIES)[number];
/** fixed: قابل خرید آنلاین · quote: قیمت توافقی (درخواست مشاوره) */
export const SERVICE_PRICING = ["fixed", "quote"] as const;

/** سازگاری با کدهای قبلی (schema.xxxEnum.enumValues) */
const en = <T extends readonly string[]>(enumValues: T) => ({ enumValues });
export const roleEnum = en(ROLES);
export const periodEnum = en(PERIODS);
export const orderStatusEnum = en(ORDER_STATUS);
export const paymentStatusEnum = en(PAYMENT_STATUS);
export const subStatusEnum = en(SUB_STATUS);
export const ticketStatusEnum = en(TICKET_STATUS);

/* ---------------- کاربران و نشست‌ها ---------------- */
export const users = mysqlTable("users", {
  id: id(),
  name: varchar("name", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  /** همیشه با حروف کوچک ذخیره می‌شود */
  email: varchar("email", { length: 190 }),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: mysqlEnum("role", ROLES).notNull().default("customer"),
  status: mysqlEnum("status", USER_STATUS).notNull().default("active"),
  locale: varchar("locale", { length: 5 }).notNull().default("fa"),
  company: varchar("company", { length: 200 }),
  nationalId: varchar("national_id", { length: 20 }),
  economicCode: varchar("economic_code", { length: 20 }),
  postalCode: varchar("postal_code", { length: 20 }),
  address: text("address"),
  createdAt: created(),
  updatedAt: updated(),
  lastLoginAt: time("last_login_at"),
}, (t) => [uniqueIndex("users_phone_uq").on(t.phone), uniqueIndex("users_email_uq").on(t.email)]);

export const sessions = mysqlTable("sessions", {
  /** sha256 توکن؛ خود توکن فقط در کوکی کاربر است */
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: ref("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: time("expires_at").notNull(),
  createdAt: created(),
  lastSeenAt: time("last_seen_at").notNull().$defaultFn(() => new Date()),
  ip: varchar("ip", { length: 64 }),
  userAgent: varchar("user_agent", { length: 300 }),
}, (t) => [index("sessions_user_idx").on(t.userId)]);

export const otpCodes = mysqlTable("otp_codes", {
  id: id(),
  phone: varchar("phone", { length: 20 }).notNull(),
  purpose: varchar("purpose", { length: 20 }).notNull(),
  codeHash: varchar("code_hash", { length: 64 }).notNull(),
  attempts: int("attempts").notNull().default(0),
  expiresAt: time("expires_at").notNull(),
  usedAt: time("used_at"),
  createdAt: created(),
}, (t) => [index("otp_phone_idx").on(t.phone, t.purpose)]);

/* ---------------- محصولات و پلن‌ها ---------------- */
export const products = mysqlTable("products", {
  id: id(),
  key: varchar("key", { length: 50 }).notNull().unique(),
  name: json<L10n>("name").notNull(),
  description: json<L10n>("description").notNull(),
  active: boolean("active").notNull().default(true),
  sort: int("sort").notNull().default(0),
  createdAt: created(),
  updatedAt: updated(),
});

export const plans = mysqlTable("plans", {
  id: id(),
  productId: ref("product_id").notNull().references(() => products.id, { onDelete: "restrict" }),
  name: json<L10n>("name").notNull(),
  description: json<L10n>("description").notNull(),
  features: json<L10nList>("features").notNull(),
  price: money("price"),
  currency: mysqlEnum("currency", CURRENCIES).notNull().default("IRR"),
  period: mysqlEnum("period", PERIODS).notNull().default("monthly"),
  durationDays: int("duration_days").notNull().default(30),
  highlighted: boolean("highlighted").notNull().default(false),
  active: boolean("active").notNull().default(true),
  sort: int("sort").notNull().default(0),
  createdAt: created(),
  updatedAt: updated(),
}, (t) => [index("plans_product_idx").on(t.productId)]);

/* ---------------- خدمات دیجیتال ---------------- */
export const serviceCategories = mysqlTable("service_categories", {
  id: id(),
  slug: varchar("slug", { length: 60 }).notNull(),
  name: json<L10n>("name").notNull(),
  description: json<L10n>("description").notNull(),
  active: boolean("active").notNull().default(true),
  sort: int("sort").notNull().default(0),
  createdAt: created(),
  updatedAt: updated(),
}, (t) => [uniqueIndex("svc_cat_slug_uq").on(t.slug)]);

export const services = mysqlTable("services", {
  id: id(),
  categoryId: ref("category_id").notNull().references(() => serviceCategories.id, { onDelete: "restrict" }),
  slug: varchar("slug", { length: 80 }).notNull(),
  name: json<L10n>("name").notNull(),
  summary: json<L10n>("summary").notNull(),
  features: json<L10nList>("features").notNull(),
  pricing: mysqlEnum("pricing", SERVICE_PRICING).notNull().default("fixed"),
  price: money("price"),
  currency: mysqlEnum("currency", CURRENCIES).notNull().default("IRR"),
  /** واحد قیمت، مثلاً «هر صفحه» یا «ماهانه» (اختیاری) */
  unit: json<L10n>("unit").notNull(),
  /** مدت تحویل (روز کاری؛ ۰ = نمایش داده نشود) */
  deliveryDays: int("delivery_days").notNull().default(0),
  highlighted: boolean("highlighted").notNull().default(false),
  active: boolean("active").notNull().default(true),
  sort: int("sort").notNull().default(0),
  createdAt: created(),
  updatedAt: updated(),
}, (t) => [uniqueIndex("svc_slug_uq").on(t.slug), index("svc_cat_idx").on(t.categoryId)]);

/* ---------------- سفارش و پرداخت ---------------- */
export type BuyerSnapshot = { name: string; phone: string; email?: string | null; company?: string | null; nationalId?: string | null; economicCode?: string | null; postalCode?: string | null; address?: string | null };

export const orders = mysqlTable("orders", {
  id: id(),
  userId: ref("user_id").notNull().references(() => users.id, { onDelete: "restrict" }),
  status: mysqlEnum("status", ORDER_STATUS).notNull().default("pending"),
  subtotal: money("subtotal"),
  discount: money("discount"),
  taxRate: int("tax_rate").notNull().default(0),
  tax: money("tax"),
  total: money("total"),
  couponCode: varchar("coupon_code", { length: 32 }),
  buyer: json<BuyerSnapshot>("buyer").notNull(),
  /** برای جست‌وجوی سریع در پنل (نام، موبایل و شرکت خریدار) */
  buyerSearch: varchar("buyer_search", { length: 400 }),
  customerNote: text("customer_note"),
  adminNote: text("admin_note"),
  locale: varchar("locale", { length: 5 }).notNull().default("fa"),
  createdAt: created(),
  updatedAt: updated(),
  paidAt: time("paid_at"),
}, (t) => [index("orders_user_idx").on(t.userId), index("orders_status_idx").on(t.status), index("orders_paid_idx").on(t.paidAt)]);

export const orderItems = mysqlTable("order_items", {
  id: id(),
  orderId: ref("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  /** قلم اشتراک: productId + planId · قلم خدمت: serviceId */
  productId: ref("product_id").references(() => products.id),
  planId: ref("plan_id").references(() => plans.id),
  serviceId: ref("service_id").references(() => services.id),
  /** اگر پر باشد، این قلم تمدید همین اشتراک است */
  renewSubscriptionId: ref("renew_subscription_id"),
  title: json<L10n>("title").notNull(),
  period: mysqlEnum("period", PERIODS).notNull(),
  durationDays: int("duration_days").notNull(),
  /** مبلغ ریالی هر واحد (پس از تبدیل ارز) */
  unitPrice: money("unit_price"),
  quantity: int("quantity").notNull().default(1),
  /** قیمت اصلی کالا در زمان خرید (ریال یا سنت) و نرخ دلار به تومان که برای تبدیل استفاده شد */
  currency: mysqlEnum("currency", CURRENCIES).notNull().default("IRR"),
  listPrice: money("list_price"),
  exchangeRate: int("exchange_rate"),
}, (t) => [index("items_order_idx").on(t.orderId), index("items_renew_idx").on(t.renewSubscriptionId), index("items_service_idx").on(t.serviceId)]);

export const payments = mysqlTable("payments", {
  id: id(),
  orderId: ref("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  gateway: varchar("gateway", { length: 30 }).notNull(),
  amount: money("amount"),
  authority: varchar("authority", { length: 100 }),
  refId: varchar("ref_id", { length: 100 }),
  cardPan: varchar("card_pan", { length: 30 }),
  status: mysqlEnum("status", PAYMENT_STATUS).notNull().default("initiated"),
  message: varchar("message", { length: 500 }),
  raw: json<unknown>("raw"),
  createdAt: created(),
  verifiedAt: time("verified_at"),
}, (t) => [uniqueIndex("payments_authority_uq").on(t.gateway, t.authority), index("payments_order_idx").on(t.orderId)]);

/* ---------------- اشتراک‌ها ---------------- */
export const subscriptions = mysqlTable("subscriptions", {
  id: id(),
  userId: ref("user_id").notNull().references(() => users.id, { onDelete: "restrict" }),
  productId: ref("product_id").notNull().references(() => products.id),
  planId: ref("plan_id").notNull().references(() => plans.id),
  status: mysqlEnum("status", SUB_STATUS).notNull().default("pending"),
  startsAt: time("starts_at"),
  endsAt: time("ends_at"),
  /** اطلاعات دسترسی که تیم پس از راه‌اندازی برای مشتری ثبت می‌کند */
  accessUrl: varchar("access_url", { length: 500 }),
  accessNote: text("access_note"),
  lastOrderId: ref("last_order_id"),
  createdAt: created(),
  updatedAt: updated(),
}, (t) => [index("subs_user_idx").on(t.userId), index("subs_ends_idx").on(t.endsAt), index("subs_order_idx").on(t.lastOrderId)]);

/* ---------------- کوپن ---------------- */
export const coupons = mysqlTable("coupons", {
  id: id(),
  /** همیشه با حروف بزرگ ذخیره می‌شود */
  code: varchar("code", { length: 32 }).notNull(),
  kind: mysqlEnum("kind", COUPON_KIND).notNull().default("percent"),
  value: int("value").notNull(),
  productId: ref("product_id").references(() => products.id, { onDelete: "set null" }),
  maxUses: int("max_uses"),
  usedCount: int("used_count").notNull().default(0),
  expiresAt: time("expires_at"),
  active: boolean("active").notNull().default(true),
  createdAt: created(),
}, (t) => [uniqueIndex("coupons_code_uq").on(t.code)]);

/* ---------------- پشتیبانی ---------------- */
export const tickets = mysqlTable("tickets", {
  id: id(),
  userId: ref("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  subject: varchar("subject", { length: 200 }).notNull(),
  status: mysqlEnum("status", TICKET_STATUS).notNull().default("open"),
  priority: mysqlEnum("priority", TICKET_PRIORITY).notNull().default("normal"),
  orderId: ref("order_id").references(() => orders.id, { onDelete: "set null" }),
  createdAt: created(),
  updatedAt: updated(),
}, (t) => [index("tickets_user_idx").on(t.userId), index("tickets_status_idx").on(t.status)]);

export const ticketMessages = mysqlTable("ticket_messages", {
  id: id(),
  ticketId: ref("ticket_id").notNull().references(() => tickets.id, { onDelete: "cascade" }),
  authorId: ref("author_id").references(() => users.id, { onDelete: "set null" }),
  isStaff: boolean("is_staff").notNull().default(false),
  body: text("body").notNull(),
  createdAt: created(),
}, (t) => [index("msgs_ticket_idx").on(t.ticketId)]);

/* ---------------- تنظیمات و گزارش فعالیت ---------------- */
export const settings = mysqlTable("settings", {
  key: varchar("key", { length: 50 }).primaryKey(),
  value: json<unknown>("value").notNull(),
  updatedAt: updated(),
});

export const auditLogs = mysqlTable("audit_logs", {
  id: id(),
  actorId: ref("actor_id").references(() => users.id, { onDelete: "set null" }),
  action: varchar("action", { length: 30 }).notNull(),
  entity: varchar("entity", { length: 30 }).notNull(),
  entityId: varchar("entity_id", { length: 64 }),
  data: json<unknown>("data"),
  createdAt: created(),
}, (t) => [index("audit_entity_idx").on(t.entity, t.entityId)]);

/* ---------------- روابط ---------------- */
export const usersRel = relations(users, ({ many }) => ({ orders: many(orders), subscriptions: many(subscriptions), tickets: many(tickets) }));
export const productsRel = relations(products, ({ many }) => ({ plans: many(plans) }));
export const plansRel = relations(plans, ({ one }) => ({ product: one(products, { fields: [plans.productId], references: [products.id] }) }));
export const ordersRel = relations(orders, ({ one, many }) => ({ user: one(users, { fields: [orders.userId], references: [users.id] }), items: many(orderItems), payments: many(payments) }));
export const orderItemsRel = relations(orderItems, ({ one }) => ({ order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }), plan: one(plans, { fields: [orderItems.planId], references: [plans.id] }), product: one(products, { fields: [orderItems.productId], references: [products.id] }), service: one(services, { fields: [orderItems.serviceId], references: [services.id] }) }));
export const serviceCategoriesRel = relations(serviceCategories, ({ many }) => ({ services: many(services) }));
export const servicesRel = relations(services, ({ one }) => ({ category: one(serviceCategories, { fields: [services.categoryId], references: [serviceCategories.id] }) }));
export const paymentsRel = relations(payments, ({ one }) => ({ order: one(orders, { fields: [payments.orderId], references: [orders.id] }) }));
export const subscriptionsRel = relations(subscriptions, ({ one }) => ({ user: one(users, { fields: [subscriptions.userId], references: [users.id] }), product: one(products, { fields: [subscriptions.productId], references: [products.id] }), plan: one(plans, { fields: [subscriptions.planId], references: [plans.id] }) }));
export const ticketsRel = relations(tickets, ({ one, many }) => ({ user: one(users, { fields: [tickets.userId], references: [users.id] }), messages: many(ticketMessages) }));
export const ticketMessagesRel = relations(ticketMessages, ({ one }) => ({ ticket: one(tickets, { fields: [ticketMessages.ticketId], references: [tickets.id] }), author: one(users, { fields: [ticketMessages.authorId], references: [users.id] }) }));
