import Link from "next/link";
import { and, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { Badge, PageTitle, Table, orderTone, td, inputCls } from "@/account/ui";
import { Filters, Pager } from "@/admin/pager";
import { fa, orderStatusFa, pageOf } from "@/admin/util";
import { requireStaff } from "@/server/auth/guards";
import { latinDigits } from "@/server/phone";
import { db, schema } from "@/server/db";
import { orderNumber } from "@/server/orders";
import { fmtDate, fmtToman } from "@/lib/money";
import { cn } from "@/lib/utils";

export const metadata = { title: "سفارش‌ها" };
type Q = { status?: string; q?: string; page?: string };

export default async function AdminOrders({ searchParams }: { searchParams: Promise<Q> }) {
  await requireStaff();
  const sp = await searchParams;
  const { page, limit, offset } = pageOf(sp);
  const conds: SQL[] = [];
  if (sp.status && schema.orderStatusEnum.enumValues.includes(sp.status as never)) conds.push(eq(schema.orders.status, sp.status as never));
  const q = latinDigits(sp.q?.trim() ?? "");
  if (q) {
    const num = Number(q.replace(/^ENO-/i, "")) - 1000;
    conds.push(or(
      Number.isInteger(num) && num > 0 ? eq(schema.orders.id, num) : sql`false`,
      ilike(sql`${schema.orders.buyer}->>'name'`, `%${q}%`),
      ilike(sql`${schema.orders.buyer}->>'phone'`, `%${q}%`),
      ilike(sql`coalesce(${schema.orders.buyer}->>'company','')`, `%${q}%`),
    )!);
  }
  const rows = await db.query.orders.findMany({ where: conds.length ? and(...conds) : undefined, orderBy: desc(schema.orders.id), limit: limit + 1, offset, with: { items: true } });
  return (
    <>
      <PageTitle title="سفارش‌ها" />
      <Filters>
        <label className="grow"><span className="mb-1 block text-[12.5px] font-bold text-ink-3">جست‌وجو</span><input name="q" defaultValue={sp.q} placeholder="شمارهٔ سفارش، نام، موبایل یا شرکت" className={cn(inputCls, "h-11")} /></label>
        <label><span className="mb-1 block text-[12.5px] font-bold text-ink-3">وضعیت</span>
          <select name="status" defaultValue={sp.status ?? ""} className={cn(inputCls, "h-11 w-44")}><option value="">همه</option>{Object.entries(orderStatusFa).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        </label>
      </Filters>
      <Table head={["سفارش", "مشتری", "محصول / پلن", "تاریخ", "مبلغ", "وضعیت"]} empty={rows.length === 0 ? <p className="p-6 text-center text-[14px] text-ink-3">سفارشی پیدا نشد.</p> : null}>
        {rows.slice(0, limit).map((o) => (
          <tr key={o.id} className="hover:bg-paper/60">
            <td className={td}><Link href={`/admin/orders/${o.id}/`} className="font-bold hover:underline" dir="ltr">{orderNumber(o.id)}</Link></td>
            <td className={td}><span className="block font-semibold">{o.buyer.company || o.buyer.name}</span><span className="text-[12.5px] text-ink-3" dir="ltr">{o.buyer.phone}</span></td>
            <td className={td}>{fa(o.items[0]?.title)}</td>
            <td className={td}>{fmtDate(o.createdAt, "fa", true)}</td>
            <td className={cn(td, "font-bold")}>{fmtToman(o.total)}</td>
            <td className={td}><Badge tone={orderTone[o.status]}>{orderStatusFa[o.status]}</Badge></td>
          </tr>
        ))}
      </Table>
      <Pager page={page} hasNext={rows.length > limit} base="/admin/orders/" query={{ status: sp.status, q: sp.q }} />
    </>
  );
}
