import Link from "next/link";
import { notFound } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { Badge, Card, PageTitle, orderTone, subTone, ticketTone } from "@/account/ui";
import { CustomerForm } from "@/admin/customer-form";
import { fa, orderStatusFa, roleFa, subStatusFa, ticketStatusFa } from "@/admin/util";
import { requireStaff } from "@/server/auth/guards";
import { db, schema } from "@/server/db";
import { effectiveSubStatus, orderNumber } from "@/server/orders";
import { fmtDate, fmtToman } from "@/lib/money";

export const metadata = { title: "مشتری" };

export default async function Customer({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff();
  const id = Number((await params).id);
  const u = await db.query.users.findFirst({ where: eq(schema.users.id, id) });
  if (!u) notFound();
  const [orders, subs, tickets] = await Promise.all([
    db.query.orders.findMany({ where: eq(schema.orders.userId, id), orderBy: desc(schema.orders.id), limit: 20 }),
    db.query.subscriptions.findMany({ where: eq(schema.subscriptions.userId, id), orderBy: desc(schema.subscriptions.id), with: { product: true, plan: true } }),
    db.query.tickets.findMany({ where: eq(schema.tickets.userId, id), orderBy: desc(schema.tickets.id), limit: 10 }),
  ]);
  const { passwordHash: _p, ...safe } = u; void _p;
  return (
    <>
      <PageTitle title={u.name} lead={`عضویت: ${fmtDate(u.createdAt)} · آخرین ورود: ${fmtDate(u.lastLoginAt, "fa", true)}${u.role !== "customer" ? ` · ${roleFa[u.role]}` : ""}`} />
      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <CustomerForm u={safe} />
        <div className="grid content-start gap-6">
          <Card title="اشتراک‌ها">
            {subs.length === 0 ? <p className="text-[14px] text-ink-3">—</p> : <ul className="grid gap-2 text-[14px]">{subs.map((s) => { const st = effectiveSubStatus(s); return <li key={s.id}><Link href={`/admin/subscriptions/${s.id}/`} className="flex items-center justify-between gap-2 rounded-xl bg-paper p-3 hover:opacity-80"><span>{fa(s.product.name)} · {fa(s.plan.name)}<span className="block text-[12.5px] text-ink-3">تا {fmtDate(s.endsAt)}</span></span><Badge tone={subTone[st]}>{subStatusFa[st]}</Badge></Link></li>; })}</ul>}
          </Card>
          <Card title="سفارش‌ها">
            {orders.length === 0 ? <p className="text-[14px] text-ink-3">—</p> : <ul className="grid gap-2 text-[14px]">{orders.map((o) => <li key={o.id}><Link href={`/admin/orders/${o.id}/`} className="flex items-center justify-between gap-2 rounded-xl bg-paper p-3 hover:opacity-80"><span dir="ltr">{orderNumber(o.id)}</span><span className="flex items-center gap-2">{fmtToman(o.total)}<Badge tone={orderTone[o.status]}>{orderStatusFa[o.status]}</Badge></span></Link></li>)}</ul>}
          </Card>
          <Card title="درخواست‌های پشتیبانی">
            {tickets.length === 0 ? <p className="text-[14px] text-ink-3">—</p> : <ul className="grid gap-2 text-[14px]">{tickets.map((t) => <li key={t.id}><Link href={`/admin/tickets/${t.id}/`} className="flex items-center justify-between gap-2 rounded-xl bg-paper p-3 hover:opacity-80"><span className="truncate">{t.subject}</span><Badge tone={ticketTone[t.status]}>{ticketStatusFa[t.status]}</Badge></Link></li>)}</ul>}
          </Card>
        </div>
      </div>
    </>
  );
}
