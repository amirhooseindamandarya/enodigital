import Link from "next/link";
import { and, desc, eq, lte, ilike, or, type SQL } from "drizzle-orm";
import { Badge, PageTitle, Table, inputCls, subTone, td } from "@/account/ui";
import { Filters, Pager } from "@/admin/pager";
import { fa, nFa, pageOf, subStatusFa } from "@/admin/util";
import { requireStaff } from "@/server/auth/guards";
import { db, schema } from "@/server/db";
import { effectiveSubStatus, sweepExpired } from "@/server/orders";
import { getSettings } from "@/server/settings";
import { daysLeft, fmtDate } from "@/lib/money";
import { cn } from "@/lib/utils";

export const metadata = { title: "اشتراک‌ها" };
type Q = { status?: string; product?: string; expiring?: string; q?: string; page?: string };

export default async function AdminSubs({ searchParams }: { searchParams: Promise<Q> }) {
  await requireStaff();
  await sweepExpired();
  const sp = await searchParams;
  const { page, limit, offset } = pageOf(sp);
  const settings = await getSettings();
  const products = await db.query.products.findMany();
  const conds: SQL[] = [];
  if (sp.status && schema.subStatusEnum.enumValues.includes(sp.status as never)) conds.push(eq(schema.subscriptions.status, sp.status as never));
  if (sp.product) conds.push(eq(schema.subscriptions.productId, Number(sp.product)));
  if (sp.expiring) conds.push(eq(schema.subscriptions.status, "active"), lte(schema.subscriptions.endsAt, new Date(Date.now() + settings.expiryWarnDays * 86400_000)));
  if (sp.q?.trim()) {
    const users = await db.select({ id: schema.users.id }).from(schema.users).where(or(ilike(schema.users.name, `%${sp.q.trim()}%`), ilike(schema.users.phone, `%${sp.q.trim()}%`), ilike(schema.users.company, `%${sp.q.trim()}%`)));
    conds.push(users.length ? or(...users.map((u) => eq(schema.subscriptions.userId, u.id)))! : eq(schema.subscriptions.id, -1));
  }
  const rows = await db.query.subscriptions.findMany({ where: conds.length ? and(...conds) : undefined, orderBy: sp.expiring ? schema.subscriptions.endsAt : desc(schema.subscriptions.id), limit: limit + 1, offset, with: { user: true, product: true, plan: true } });
  return (
    <>
      <PageTitle title="اشتراک‌ها" />
      <Filters>
        <label className="grow"><span className="mb-1 block text-[12.5px] font-bold text-ink-3">مشتری</span><input name="q" defaultValue={sp.q} placeholder="نام، موبایل یا شرکت" className={cn(inputCls, "h-11")} /></label>
        <label><span className="mb-1 block text-[12.5px] font-bold text-ink-3">محصول</span><select name="product" defaultValue={sp.product ?? ""} className={cn(inputCls, "h-11 w-40")}><option value="">همه</option>{products.map((p) => <option key={p.id} value={p.id}>{fa(p.name)}</option>)}</select></label>
        <label><span className="mb-1 block text-[12.5px] font-bold text-ink-3">وضعیت</span><select name="status" defaultValue={sp.status ?? ""} className={cn(inputCls, "h-11 w-44")}><option value="">همه</option>{Object.entries(subStatusFa).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
        <label className="flex h-11 items-center gap-2 text-[14px] font-semibold"><input type="checkbox" name="expiring" value="1" defaultChecked={!!sp.expiring} className="size-4 accent-[var(--color-amber)]" />رو به پایان</label>
      </Filters>
      <Table head={["#", "مشتری", "محصول / پلن", "پایان", "دسترسی", "وضعیت"]} empty={rows.length === 0 ? <p className="p-6 text-center text-[14px] text-ink-3">اشتراکی پیدا نشد.</p> : null}>
        {rows.slice(0, limit).map((s) => {
          const st = effectiveSubStatus(s);
          const left = daysLeft(s.endsAt);
          return (
            <tr key={s.id} className="hover:bg-paper/60">
              <td className={td}><Link href={`/admin/subscriptions/${s.id}/`} className="font-bold hover:underline">{s.id}</Link></td>
              <td className={td}><Link href={`/admin/customers/${s.userId}/`} className="font-semibold hover:underline">{s.user.company || s.user.name}</Link><span className="block text-[12.5px] text-ink-3" dir="ltr">{s.user.phone}</span></td>
              <td className={td}>{fa(s.product.name)}<span className="block text-[12.5px] text-ink-3">{fa(s.plan.name)}</span></td>
              <td className={td}>{s.endsAt ? fmtDate(s.endsAt) : "—"}{st === "active" && s.endsAt && <span className={cn("block text-[12.5px]", left <= settings.expiryWarnDays ? "font-bold text-amber-ink" : "text-ink-3")}>{nFa(Math.max(0, left))} روز</span>}</td>
              <td className={td}>{s.accessUrl || s.accessNote ? <Badge tone="green">ثبت شده</Badge> : st === "active" ? <Badge tone="amber">در انتظار</Badge> : "—"}</td>
              <td className={td}><Badge tone={subTone[st]}>{subStatusFa[st]}</Badge></td>
            </tr>
          );
        })}
      </Table>
      <Pager page={page} hasNext={rows.length > limit} base="/admin/subscriptions/" query={{ status: sp.status, product: sp.product, expiring: sp.expiring, q: sp.q }} />
    </>
  );
}
