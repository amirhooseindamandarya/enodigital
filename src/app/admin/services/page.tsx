import Link from "next/link";
import { asc } from "drizzle-orm";
import { Badge, Card, PageTitle, Table, td } from "@/account/ui";
import { CategoryForm, ServiceForm } from "@/admin/service-forms";
import { fa, nFa, priceFa } from "@/admin/util";
import { requireStaff } from "@/server/auth/guards";
import { getSettings } from "@/server/settings";
import { db, schema } from "@/server/db";
import { fmtToman, usdToRial } from "@/lib/money";

export const metadata = { title: "خدمات دیجیتال" };

export default async function Services({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  await requireStaff(true);
  const sp = await searchParams;
  const settings = await getSettings();
  const cats = await db.query.serviceCategories.findMany({
    orderBy: [asc(schema.serviceCategories.sort), asc(schema.serviceCategories.id)],
    with: { services: { orderBy: [asc(schema.services.sort), asc(schema.services.id)] } },
  });
  const catFilter = Number(sp.cat) || 0;
  const list = cats.filter((c) => !catFilter || c.id === catFilter).flatMap((c) => c.services.map((sv) => ({ ...sv, cat: c })));

  return (
    <>
      <PageTitle title="خدمات دیجیتال" lead="دسته‌ها و خدمات فعال در صفحهٔ «خدمات دیجیتال» سایت نمایش داده می‌شوند. قیمت دلاری با نرخ تنظیمات فروشگاه به تومان تبدیل می‌شود." />
      {!settings.usdRate && list.some((x) => x.currency === "USD") && (
        <p className="mb-5 rounded-xl bg-amber/15 p-3 text-[14px] text-amber-ink">نرخ دلار تعیین نشده است؛ خدمات دلاری تا تعیین نرخ در <Link href="/admin/settings/" className="font-bold underline">تنظیمات فروشگاه</Link> قابل خرید نیستند.</p>
      )}

      <section className="mb-6">
        <h2 className="mb-3 text-[16px] font-extrabold">دسته‌ها</h2>
        {cats.length === 0 ? <p className="text-[14px] text-ink-3">هنوز دسته‌ای ساخته نشده؛ اول یک دسته (مثلاً «طراحی سایت») بسازید.</p> : (
          <ul className="flex flex-wrap gap-2">
            <li><Link href="/admin/services/" className={`inline-flex h-10 items-center rounded-xl border px-4 text-[14px] font-bold ${!catFilter ? "border-navy bg-navy text-white" : "border-line bg-white"}`}>همه ({nFa(cats.reduce((a, c) => a + c.services.length, 0))})</Link></li>
            {cats.map((c) => (
              <li key={c.id} className="flex">
                <Link href={`/admin/services/?cat=${c.id}`} className={`inline-flex h-10 items-center gap-2 rounded-s-xl border px-4 text-[14px] font-bold ${catFilter === c.id ? "border-navy bg-navy text-white" : "border-line bg-white"}`}>
                  {fa(c.name)} <span className="opacity-70">({nFa(c.services.length)})</span>{!c.active && <Badge tone="gray">غیرفعال</Badge>}
                </Link>
                <Link href={`/admin/services/categories/${c.id}/`} className="inline-flex h-10 items-center rounded-e-xl border border-s-0 border-line bg-white px-3 text-[13px] text-ink-3 hover:text-ink">ویرایش</Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Table head={["خدمت", "دسته", "قیمت", "معادل تومان", "وضعیت"]} empty={list.length === 0 ? <p className="p-6 text-center text-[14px] text-ink-3">{cats.length ? "خدمتی ثبت نشده است؛ از فرم پایین اضافه کنید." : "اول یک دسته بسازید."}</p> : undefined}>
        {list.map((sv) => {
          const rial = sv.currency === "USD" ? usdToRial(sv.price, settings) : sv.price;
          return (
            <tr key={sv.id}>
              <td className={td}><Link href={`/admin/services/${sv.id}/`} className="font-bold hover:underline">{fa(sv.name)}</Link><div className="text-[12.5px] text-ink-3" dir="ltr">{sv.slug}</div></td>
              <td className={td}>{fa(sv.cat.name)}</td>
              <td className={td}>{sv.pricing === "quote" ? "توافقی" : priceFa(sv.price, sv.currency)}{fa(sv.unit) && <span className="text-ink-3"> / {fa(sv.unit)}</span>}</td>
              <td className={td}>{sv.pricing === "quote" ? "—" : rial === null ? <span className="text-[#c8333a]">نرخ دلار تعیین نشده</span> : fmtToman(rial)}</td>
              <td className={td}><span className="flex gap-1">{sv.active ? <Badge tone="green">فعال</Badge> : <Badge tone="gray">غیرفعال</Badge>}{sv.highlighted && <Badge tone="amber">برجسته</Badge>}</span></td>
            </tr>
          );
        })}
      </Table>

      <div className="mt-6 grid gap-6">
        {cats.length > 0 && <Card title="خدمت جدید"><ServiceForm categories={cats} defaultCategory={catFilter || undefined} /></Card>}
        <Card title="دستهٔ جدید"><CategoryForm /></Card>
      </div>
    </>
  );
}
