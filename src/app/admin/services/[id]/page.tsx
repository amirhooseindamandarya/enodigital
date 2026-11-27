import { notFound } from "next/navigation";
import { asc, count, eq } from "drizzle-orm";
import { Card, PageTitle } from "@/account/ui";
import { deleteServiceAction } from "@/admin/actions";
import { ServiceForm } from "@/admin/service-forms";
import { fa, nFa } from "@/admin/util";
import { requireStaff } from "@/server/auth/guards";
import { db, schema } from "@/server/db";

export const metadata = { title: "خدمت" };

export default async function ServicePage({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff(true);
  const id = Number((await params).id);
  const sv = await db.query.services.findFirst({ where: eq(schema.services.id, id) });
  if (!sv) notFound();
  const cats = await db.query.serviceCategories.findMany({ orderBy: [asc(schema.serviceCategories.sort), asc(schema.serviceCategories.id)] });
  const [sold] = await db.select({ c: count() }).from(schema.orderItems).where(eq(schema.orderItems.serviceId, id));
  return (
    <>
      <PageTitle title={fa(sv.name)} lead={`نامک: ${sv.slug} · ${nFa(sold?.c ?? 0)} سفارش`} />
      <Card><ServiceForm categories={cats} service={sv} /></Card>
      <form action={deleteServiceAction} className="mt-4">
        <input type="hidden" name="id" value={sv.id} />
        <button type="submit" className="text-[13.5px] font-bold text-[#c8333a] hover:underline">{sold?.c ? "غیرفعال کردن خدمت (سفارش دارد و حذف نمی‌شود)" : "حذف خدمت"}</button>
      </form>
    </>
  );
}
