import { desc } from "drizzle-orm";
import { PageTitle, Table, td } from "@/account/ui";
import { Pager } from "@/admin/pager";
import { pageOf } from "@/admin/util";
import { requireStaff } from "@/server/auth/guards";
import { db, schema } from "@/server/db";
import { fmtDate } from "@/lib/money";

export const metadata = { title: "گزارش فعالیت" };

const ACTION: Record<string, string> = { login: "ورود", create: "ایجاد", update: "ویرایش", delete: "حذف", deactivate: "غیرفعال‌سازی", status: "تغییر وضعیت", role: "تغییر نقش", reply: "پاسخ" };
const ENTITY: Record<string, string> = { user: "کاربر", product: "محصول", plan: "پلن", order: "سفارش", subscription: "اشتراک", coupon: "کد تخفیف", ticket: "تیکت", settings: "تنظیمات" };

export default async function Audit({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  await requireStaff(true);
  const sp = await searchParams;
  const { page, limit, offset } = pageOf(sp, 50);
  const rows = await db.query.auditLogs.findMany({ orderBy: desc(schema.auditLogs.id), limit: limit + 1, offset, with: undefined });
  const users = await db.query.users.findMany({ columns: { id: true, name: true } });
  const name = (id: number | null) => users.find((u) => u.id === id)?.name ?? "—";
  return (
    <>
      <PageTitle title="گزارش فعالیت کارکنان" />
      <Table head={["زمان", "کاربر", "عملیات", "مورد", "جزئیات"]}>
        {rows.slice(0, limit).map((r) => (
          <tr key={r.id}>
            <td className={td}>{fmtDate(r.createdAt, "fa", true)}</td>
            <td className={td}>{name(r.actorId)}</td>
            <td className={td}>{ACTION[r.action] ?? r.action}</td>
            <td className={td}>{ENTITY[r.entity] ?? r.entity}{r.entityId ? ` #${r.entityId}` : ""}</td>
            <td className={td}><code className="text-[12px] text-ink-3" dir="ltr">{r.data ? JSON.stringify(r.data) : ""}</code></td>
          </tr>
        ))}
      </Table>
      <Pager page={page} hasNext={rows.length > limit} base="/admin/audit/" query={{}} />
    </>
  );
}
