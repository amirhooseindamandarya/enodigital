import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { Card, PageTitle } from "@/account/ui";
import { Submit } from "@/account/form";
import { CouponForm } from "@/admin/coupon-form";
import { deleteCouponAction } from "@/admin/actions";
import { requireStaff } from "@/server/auth/guards";
import { db, schema } from "@/server/db";

export const metadata = { title: "کد تخفیف" };

export default async function Coupon({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff(true);
  const id = Number((await params).id);
  const [c, products] = await Promise.all([db.query.coupons.findFirst({ where: eq(schema.coupons.id, id) }), db.query.products.findMany()]);
  if (!c) notFound();
  return (
    <>
      <PageTitle title={`کد ${c.code}`} />
      <Card><CouponForm c={c} products={products} /></Card>
      <form action={deleteCouponAction} className="mt-4"><input type="hidden" name="id" value={c.id} /><Submit variant="danger" confirm="کد تخفیف حذف شود؟">حذف</Submit></form>
    </>
  );
}
