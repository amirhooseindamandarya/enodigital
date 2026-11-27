import Link from "next/link";
import { desc, eq, inArray } from "drizzle-orm";
import { Badge, PageTitle, Table, inputCls, td, ticketTone } from "@/account/ui";
import { Filters, Pager } from "@/admin/pager";
import { pageOf, priorityFa, ticketStatusFa } from "@/admin/util";
import { requireStaff } from "@/server/auth/guards";
import { db, schema } from "@/server/db";
import { fmtDate } from "@/lib/money";
import { cn } from "@/lib/utils";

export const metadata = { title: "پشتیبانی" };

export default async function AdminTickets({ searchParams }: { searchParams: Promise<{ status?: string; page?: string }> }) {
  await requireStaff();
  const sp = await searchParams;
  const { page, limit, offset } = pageOf(sp);
  const status = sp.status ?? "pending";
  const where = status === "all" ? undefined : status === "pending" ? inArray(schema.tickets.status, ["open", "customer_reply"]) : eq(schema.tickets.status, status as never);
  const rows = await db.query.tickets.findMany({ where, orderBy: desc(schema.tickets.updatedAt), limit: limit + 1, offset, with: { user: true } });
  return (
    <>
      <PageTitle title="درخواست‌های پشتیبانی" />
      <Filters>
        <label><span className="mb-1 block text-[12.5px] font-bold text-ink-3">نمایش</span>
          <select name="status" defaultValue={status} className={cn(inputCls, "h-11 w-56")}><option value="pending">نیازمند پاسخ</option><option value="all">همه</option>{Object.entries(ticketStatusFa).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        </label>
      </Filters>
      <Table head={["#", "موضوع", "مشتری", "اولویت", "آخرین تغییر", "وضعیت"]} empty={rows.length === 0 ? <p className="p-6 text-center text-[14px] text-ink-3">موردی نیست.</p> : null}>
        {rows.slice(0, limit).map((t) => (
          <tr key={t.id} className="hover:bg-paper/60">
            <td className={td}>{t.id}</td>
            <td className={td}><Link href={`/admin/tickets/${t.id}/`} className="font-bold hover:underline">{t.subject}</Link></td>
            <td className={td}>{t.user.name}</td>
            <td className={td}>{t.priority === "high" ? <Badge tone="red">{priorityFa.high}</Badge> : priorityFa[t.priority]}</td>
            <td className={td}>{fmtDate(t.updatedAt, "fa", true)}</td>
            <td className={td}><Badge tone={ticketTone[t.status]}>{ticketStatusFa[t.status]}</Badge></td>
          </tr>
        ))}
      </Table>
      <Pager page={page} hasNext={rows.length > limit} base="/admin/tickets/" query={{ status }} />
    </>
  );
}
