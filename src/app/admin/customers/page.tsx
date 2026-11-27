import Link from "next/link";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { Badge, Btn, PageTitle, Table, inputCls, td } from "@/account/ui";
import { Filters, Pager } from "@/admin/pager";
import { nFa, pageOf } from "@/admin/util";
import { requireStaff } from "@/server/auth/guards";
import { db, schema } from "@/server/db";
import { latinDigits } from "@/server/phone";
import { fmtDate, fmtToman } from "@/lib/money";
import { cn } from "@/lib/utils";

export const metadata = { title: "مشتریان" };

export default async function Customers({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  await requireStaff();
  const sp = await searchParams;
  const { page, limit, offset } = pageOf(sp);
  const q = latinDigits(sp.q?.trim() ?? "");
  const where = and(eq(schema.users.role, "customer"), q ? or(ilike(schema.users.name, `%${q}%`), ilike(schema.users.phone, `%${q}%`), ilike(schema.users.email, `%${q}%`), ilike(schema.users.company, `%${q}%`)) : undefined);
  const rows = await db.select({
    u: schema.users,
    orders: sql<number>`(select count(*)::int from orders o where o.user_id = ${schema.users.id} and o.status in ('paid','completed'))`,
    spent: sql<number>`(select coalesce(sum(o.total),0)::bigint from orders o where o.user_id = ${schema.users.id} and o.status in ('paid','completed'))`,
    active: sql<number>`(select count(*)::int from subscriptions s where s.user_id = ${schema.users.id} and s.status = 'active')`,
  }).from(schema.users).where(where).orderBy(desc(schema.users.id)).limit(limit + 1).offset(offset);
  return (
    <>
      <PageTitle title="مشتریان" action={<Btn href="/admin/customers/new/">مشتری جدید</Btn>} />
      <Filters><label className="grow"><span className="mb-1 block text-[12.5px] font-bold text-ink-3">جست‌وجو</span><input name="q" defaultValue={sp.q} placeholder="نام، موبایل، ایمیل یا شرکت" className={cn(inputCls, "h-11")} /></label></Filters>
      <Table head={["نام", "تماس", "عضویت", "سفارش موفق", "مجموع خرید", "اشتراک فعال"]} empty={rows.length === 0 ? <p className="p-6 text-center text-[14px] text-ink-3">مشتری‌ای پیدا نشد.</p> : null}>
        {rows.slice(0, limit).map(({ u, orders, spent, active }) => (
          <tr key={u.id} className="hover:bg-paper/60">
            <td className={td}><Link href={`/admin/customers/${u.id}/`} className="font-bold hover:underline">{u.name}</Link>{u.company && <span className="block text-[12.5px] text-ink-3">{u.company}</span>}{u.status === "blocked" && <Badge tone="red">مسدود</Badge>}</td>
            <td className={td}><span dir="ltr" className="block">{u.phone}</span>{u.email && <span dir="ltr" className="block text-[12.5px] text-ink-3">{u.email}</span>}</td>
            <td className={td}>{fmtDate(u.createdAt)}</td>
            <td className={td}>{nFa(orders)}</td>
            <td className={cn(td, "font-bold")}>{fmtToman(Number(spent))}</td>
            <td className={td}>{active ? <Badge tone="green">{nFa(active)}</Badge> : "—"}</td>
          </tr>
        ))}
      </Table>
      <Pager page={page} hasNext={rows.length > limit} base="/admin/customers/" query={{ q: sp.q }} />
    </>
  );
}
