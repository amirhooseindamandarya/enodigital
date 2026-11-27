import Link from "next/link";
import { desc } from "drizzle-orm";
import { Badge, Card, PageTitle, Table, td } from "@/account/ui";
import { CouponForm } from "@/admin/coupon-form";
import { fa, nFa } from "@/admin/util";
import { requireStaff } from "@/server/auth/guards";
import { db, schema } from "@/server/db";
import { fmtDate } from "@/lib/money";

export const metadata = { title: "کدهای تخفیف" };

export default async function Coupons() {
  await requireStaff(true);
  const [rows, products] = await Promise.all([db.query.coupons.findMany({ orderBy: desc(schema.coupons.id) }), db.query.products.findMany()]);
  const pname = (id: number | null) => (id ? fa(products.find((p) => p.id === id)?.name) : "همه");
  return (
    <>
      <PageTitle title="کدهای تخفیف" />
      <Table head={["کد", "تخفیف", "محصول", "استفاده", "انقضا", "وضعیت"]} empty={rows.length === 0 ? <p className="p-6 text-center text-[14px] text-ink-3">کدی ساخته نشده است.</p> : null}>
        {rows.map((c) => {
          const expired = c.expiresAt && c.expiresAt < new Date();
          const used = c.maxUses != null && c.usedCount >= c.maxUses;
          return (
            <tr key={c.id} className="hover:bg-paper/60">
              <td className={td}><Link href={`/admin/coupons/${c.id}/`} className="font-bold hover:underline" dir="ltr">{c.code}</Link></td>
              <td className={td}>{c.kind === "percent" ? `${nFa(c.value)}٪` : `${nFa(c.value)} تومان`}</td>
              <td className={td}>{pname(c.productId)}</td>
              <td className={td}>{nFa(c.usedCount)}{c.maxUses != null ? ` از ${nFa(c.maxUses)}` : ""}</td>
              <td className={td}>{c.expiresAt ? fmtDate(c.expiresAt) : "—"}</td>
              <td className={td}>{!c.active ? <Badge tone="gray">غیرفعال</Badge> : expired ? <Badge tone="red">منقضی</Badge> : used ? <Badge tone="gray">تمام‌شده</Badge> : <Badge tone="green">فعال</Badge>}</td>
            </tr>
          );
        })}
      </Table>
      <Card title="کد تخفیف جدید" className="mt-6"><CouponForm products={products} /></Card>
    </>
  );
}
