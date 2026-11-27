import "server-only";
import { and, desc, eq, inArray, sql, count } from "drizzle-orm";
import type { Locale } from "@/cms/types";
import { db, schema } from "@/server/db";
import type { L10n, L10nList } from "@/server/db/schema";
import { effectiveSubStatus } from "@/server/orders";

export const lt = (v: L10n | null | undefined, l: Locale) => (v ? v[l] || v.fa : "");
export const ltList = (v: L10nList | null | undefined, l: Locale) => (v ? (v[l]?.length ? v[l]! : v.fa) : []);

export async function userSubscriptions(userId: number) {
  const rows = await db.query.subscriptions.findMany({ where: eq(schema.subscriptions.userId, userId), orderBy: desc(schema.subscriptions.id), with: { product: true, plan: true } });
  return rows.map((s) => ({ ...s, effective: effectiveSubStatus(s) }));
}

export async function dashboardData(userId: number) {
  const [subs, recent, pending, tickets] = await Promise.all([
    userSubscriptions(userId),
    db.query.orders.findMany({ where: eq(schema.orders.userId, userId), orderBy: desc(schema.orders.id), limit: 5, with: { items: true } }),
    db.select({ n: count() }).from(schema.orders).where(and(eq(schema.orders.userId, userId), eq(schema.orders.status, "pending"))),
    db.select({ n: count() }).from(schema.tickets).where(and(eq(schema.tickets.userId, userId), inArray(schema.tickets.status, ["open", "answered", "customer_reply"]))),
  ]);
  return { subs, recent, pending: pending[0]?.n ?? 0, openTickets: tickets[0]?.n ?? 0 };
}

export async function userOrder(userId: number, id: number) {
  return db.query.orders.findFirst({
    where: and(eq(schema.orders.id, id), eq(schema.orders.userId, userId)),
    with: { items: true, payments: { orderBy: desc(schema.payments.id) } },
  });
}
