import Link from "next/link";
import { and, count, desc, eq, gte, inArray, lte, sql, type SQL } from "drizzle-orm";
import { Badge, Btn, Card, Empty, PageTitle, Stat, orderTone, ticketTone } from "@/account/ui";
import { RevenueChart } from "@/admin/revenue-chart";
import { fa, nFa, orderStatusFa, ticketStatusFa } from "@/admin/util";
import { requireStaff } from "@/server/auth/guards";
import { db, schema } from "@/server/db";
import { orderNumber, sweepExpired } from "@/server/orders";
import { getSettings } from "@/server/settings";
import { daysLeft, fmtDate, fmtToman } from "@/lib/money";

export const metadata = { title: "پیشخوان" };

export default async function AdminHome({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const me = await requireStaff();
  const { denied } = await searchParams;
  await sweepExpired();
  const settings = await getSettings();
  const since30 = new Date(Date.now() - 30 * 86400_000);
  const since14 = new Date(Date.now() - 15 * 86400_000);
  const warnUntil = new Date(Date.now() + settings.expiryWarnDays * 86400_000);
  const countWhere = (t: Parameters<ReturnType<typeof db.select>["from"]>[0], w: SQL | undefined) => db.select({ c: count() }).from(t).where(w).then((r) => r[0]?.c ?? 0);
  const paid = inArray(schema.orders.status, ["paid", "completed"]);

  const [rev30, paid30, awaiting, toProcess, activeSubs, expiring, customers, newCustomers, openTickets, recentPaid, latest, expiringList, tickets] = await Promise.all([
    db.select({ s: sql<number>`coalesce(sum(${schema.orders.total}), 0)`.mapWith(Number) }).from(schema.orders).where(and(paid, gte(schema.orders.paidAt, since30))).then((r) => r[0]?.s ?? 0),
    countWhere(schema.orders, and(paid, gte(schema.orders.paidAt, since30))),
    countWhere(schema.orders, eq(schema.orders.status, "pending")),
    countWhere(schema.orders, eq(schema.orders.status, "paid")),
    countWhere(schema.subscriptions, eq(schema.subscriptions.status, "active")),
    countWhere(schema.subscriptions, and(eq(schema.subscriptions.status, "active"), lte(schema.subscriptions.endsAt, warnUntil))),
    countWhere(schema.users, eq(schema.users.role, "customer")),
    countWhere(schema.users, and(eq(schema.users.role, "customer"), gte(schema.users.createdAt, since30))),
    countWhere(schema.tickets, inArray(schema.tickets.status, ["open", "customer_reply"])),
    db.select({ total: schema.orders.total, paidAt: schema.orders.paidAt }).from(schema.orders).where(and(paid, gte(schema.orders.paidAt, since14))),
    db.query.orders.findMany({ orderBy: desc(schema.orders.id), limit: 8, with: { items: true } }),
    db.query.subscriptions.findMany({ where: and(eq(schema.subscriptions.status, "active"), lte(schema.subscriptions.endsAt, warnUntil)), orderBy: schema.subscriptions.endsAt, limit: 8, with: { user: true, product: true } }),
    db.query.tickets.findMany({ where: inArray(schema.tickets.status, ["open", "customer_reply"]), orderBy: desc(schema.tickets.updatedAt), limit: 6, with: { user: true } }),
  ]);

  // درآمد ۱۴ روز اخیر به تفکیک روز (به وقت تهران)
  const tehranDay = (d: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tehran", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
  const byDay = new Map<string, number>();
  for (const o of recentPaid) if (o.paidAt) byDay.set(tehranDay(o.paidAt), (byDay.get(tehranDay(o.paidAt)) ?? 0) + o.total);
  const chart = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(Date.now() - (13 - i) * 86400_000);
    const day = tehranDay(d);
    return { day, amount: byDay.get(day) ?? 0, label: new Intl.DateTimeFormat("fa-IR-u-ca-persian", { month: "numeric", day: "numeric", timeZone: "Asia/Tehran" }).format(d) };
  });

  return (
    <>
      <PageTitle title={`سلام، ${me.name.split(" ")[0]}`} lead="وضعیت فروش، اشتراک‌ها و درخواست‌ها در یک نگاه." />
      {denied && <p className="mb-4 rounded-xl bg-[#e5484d]/8 p-3 text-[14px] text-[#c8333a]">این بخش فقط برای مدیر کل است.</p>}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="درآمد ۳۰ روز اخیر" value={<span className="text-[22px]">{fmtToman(rev30)}</span>} tone="green" href="/admin/orders/?status=paid" />
        <Stat label="سفارش پرداخت‌شده (۳۰ روز)" value={nFa(paid30)} tone="blue" href="/admin/orders/" />
        <Stat label="در انتظار رسیدگی" value={nFa(toProcess)} tone={toProcess ? "amber" : "gray"} href="/admin/orders/?status=paid" />
        <Stat label="در انتظار پرداخت" value={nFa(awaiting)} tone="gray" href="/admin/orders/?status=pending" />
        <Stat label="اشتراک فعال" value={nFa(activeSubs)} tone="green" href="/admin/subscriptions/?status=active" />
        <Stat label={`پایان تا ${nFa(settings.expiryWarnDays)} روز آینده`} value={nFa(expiring)} tone={expiring ? "amber" : "gray"} href="/admin/subscriptions/?expiring=1" />
        <Stat label="مشتریان (۳۰ روز اخیر)" value={<>{nFa(customers)} <span className="text-[14px] font-bold text-teal-700">+{nFa(newCustomers)}</span></>} tone="blue" href="/admin/customers/" />
        <Stat label="درخواست پشتیبانی باز" value={nFa(openTickets)} tone={openTickets ? "amber" : "gray"} href="/admin/tickets/" />
      </div>

      <Card title="درآمد روزانه (۱۴ روز اخیر، تومان)" className="mt-6"><RevenueChart data={chart} /></Card>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card title="آخرین سفارش‌ها" action={<Btn href="/admin/orders/" variant="ghost" size="sm">همه</Btn>}>
          {latest.length === 0 ? <Empty>هنوز سفارشی ثبت نشده است.</Empty> : (
            <ul className="divide-y divide-line">
              {latest.map((o) => (
                <li key={o.id}>
                  <Link href={`/admin/orders/${o.id}/`} className="flex items-center justify-between gap-3 py-2.5 hover:opacity-80">
                    <span className="min-w-0"><b dir="ltr">{orderNumber(o.id)}</b><span className="block truncate text-[13px] text-ink-3">{o.buyer.name} · {fa(o.items[0]?.title)}</span></span>
                    <span className="flex shrink-0 flex-col items-end gap-1"><Badge tone={orderTone[o.status]}>{orderStatusFa[o.status]}</Badge><span className="text-[13px] font-bold">{fmtToman(o.total)}</span></span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <div className="grid content-start gap-6">
          <Card title="اشتراک‌های رو به پایان" action={<Btn href="/admin/subscriptions/?expiring=1" variant="ghost" size="sm">همه</Btn>}>
            {expiringList.length === 0 ? <p className="text-[14px] text-ink-3">موردی نیست.</p> : (
              <ul className="divide-y divide-line text-[14px]">
                {expiringList.map((s) => (
                  <li key={s.id}><Link href={`/admin/subscriptions/${s.id}/`} className="flex justify-between gap-3 py-2.5 hover:opacity-80"><span>{s.user.name} · {fa(s.product.name)}</span><span className="text-amber-ink">{nFa(Math.max(0, daysLeft(s.endsAt)))} روز · {fmtDate(s.endsAt)}</span></Link></li>
                ))}
              </ul>
            )}
          </Card>
          <Card title="درخواست‌های باز" action={<Btn href="/admin/tickets/" variant="ghost" size="sm">همه</Btn>}>
            {tickets.length === 0 ? <p className="text-[14px] text-ink-3">موردی نیست.</p> : (
              <ul className="divide-y divide-line text-[14px]">
                {tickets.map((t) => (
                  <li key={t.id}><Link href={`/admin/tickets/${t.id}/`} className="flex items-center justify-between gap-3 py-2.5 hover:opacity-80"><span className="min-w-0 truncate">{t.subject} <span className="text-ink-3">· {t.user.name}</span></span><Badge tone={ticketTone[t.status]}>{ticketStatusFa[t.status]}</Badge></Link></li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
