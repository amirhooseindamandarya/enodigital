import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { Card, PageTitle } from "@/account/ui";
import { Submit } from "@/account/form";
import { deletePlanAction } from "@/admin/actions";
import { PlanForm } from "@/admin/plan-form";
import { fa } from "@/admin/util";
import { requireStaff } from "@/server/auth/guards";
import { db, schema } from "@/server/db";

export const metadata = { title: "پلن" };

export default async function Plan({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff(true);
  const id = Number((await params).id);
  const plan = await db.query.plans.findFirst({ where: eq(schema.plans.id, id), with: { product: true } });
  if (!plan) notFound();
  return (
    <>
      <PageTitle title={`پلن ${fa(plan.name)}`} lead={fa(plan.product.name)} action={<Link href={`/admin/products/${plan.productId}/`} className="text-[14px] font-bold text-ink-2 hover:text-ink">بازگشت به محصول</Link>} />
      <Card><PlanForm productId={plan.productId} plan={plan} /></Card>
      <form action={deletePlanAction} className="mt-4">
        <input type="hidden" name="id" value={plan.id} />
        <Submit variant="danger" confirm="پلن حذف شود؟ اگر سفارشی با آن ثبت شده باشد، فقط غیرفعال می‌شود.">حذف پلن</Submit>
      </form>
    </>
  );
}
