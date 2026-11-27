import { notFound } from "next/navigation";
import { count, eq } from "drizzle-orm";
import { Card, PageTitle } from "@/account/ui";
import { deleteServiceCategoryAction } from "@/admin/actions";
import { CategoryForm } from "@/admin/service-forms";
import { fa, nFa } from "@/admin/util";
import { requireStaff } from "@/server/auth/guards";
import { db, schema } from "@/server/db";

export const metadata = { title: "دستهٔ خدمات" };

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff(true);
  const id = Number((await params).id);
  const cat = await db.query.serviceCategories.findFirst({ where: eq(schema.serviceCategories.id, id) });
  if (!cat) notFound();
  const [n] = await db.select({ c: count() }).from(schema.services).where(eq(schema.services.categoryId, id));
  return (
    <>
      <PageTitle title={fa(cat.name)} lead={`${nFa(n?.c ?? 0)} خدمت در این دسته`} />
      <Card><CategoryForm cat={cat} /></Card>
      <form action={deleteServiceCategoryAction} className="mt-4">
        <input type="hidden" name="id" value={cat.id} />
        <button type="submit" className="text-[13.5px] font-bold text-[#c8333a] hover:underline">{n?.c ? "غیرفعال کردن دسته (خدمت دارد و حذف نمی‌شود)" : "حذف دسته"}</button>
      </form>
    </>
  );
}
