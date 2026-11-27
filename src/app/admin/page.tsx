import Link from "next/link";
import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
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
  const since30 = sql`now() - interval '30 days'`;
  const warnUntil = new Date(Date.now() + settings.expiryWarnDays * 86400_000);
  const count = (t: Parameters<typeof db.select>[0] extends never ? never : any, w: any) => db.select({ c: sql<number>`count(*)::int` }).from(t).where(w).then((r) => r[0]?.c ?? 0); // eslint-disable-line @typescript-eslint/no-explicit-any

  const [rev30, paid30, awaiting, toProcess, activeSubs, expiring, customers, newCustomers, openTickets, series, latest, expiringList, tickets] = await Promise.all([
    db.select({ s: sql<number>`coalesce(sum(${schema.orders.total}),0)::bigint` }).from(schema.orders).where(and(inArray(schema.orders.status, ["paid", "completed"]), gte(schema.orders.paidAt, since30))).then((r) => Number(r[0]?.s ?? 0)),
    count(schema.orders, and(inArray(schema.orders.status, ["paid", "completed"]), gte(schema.orders.paidAt, since30))),
    count(schema.orders, eq(schema.orders.status, "pending")),
    count(schema.orders, eq(schema.orders.status, "paid")),
    count(schema.subscriptions, eq(schema.subscriptions.status, "active")),
    count(schema.subscriptions, and(eq(schema.subscriptions.status, "active"), lte(schema.subscriptions.endsAt, warnUntil))),
    count(schema.users, eq(schema.users.role, "customer")),
    count(schema.users, and(eq(schema.users.role, "customer"), gte(schema.users.createdAt, since30))),
    count(schema.tickets, inArray(schema.tickets.status, ["open", "customer_reply"])),
    db.execute<{ day: string; amount: string }>(sql`
      select to_char(d, 'YYYY-MM-DD') as day, coalesce(sum(o.total),0)::bigint as amount
      from generate_series((now() at time zone 'Asia/Tehran')::date - 13, (now() at time zone 'Asia/Tehran')::date, interval '1 day') d
      left join orders o on o.status in ('paid','completed') and (o.paid_at at time zone 'Asia/Tehran')::date = d::date
      group by d order by d`),
    db.query.orders.findMany({ orderBy: desc(schema.orders.id), limit: 8, with: { items: true } }),
    db.query.subscriptions.findMany({ where: and(eq(schema.subscriptions.status, "active"), lte(schema.subscriptions.endsAt, warnUntil)), orderBy: schema.subscriptions.endsAt, limit: 8, with: { user: true, product: true } }),
    db.query.tickets.findMany({ where: inArray(schema.tickets.status, ["open", "customer_reply"]), orderBy: desc(schema.tickets.updatedAt), limit: 6, with: { user: true } }),
  ]);
  const chart = [...series].map((r) => ({ day: r.day, amount: Number(r.amount), label: new Intl.DateTimeFormat("fa-IR-u-ca-persian", { month: "numeric", day: "numeric" }).format(new Date(`${r.day}T12:00:00+03:30`)) }));

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
