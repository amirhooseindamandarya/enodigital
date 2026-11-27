import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { ActionForm, Submit } from "@/account/form";
import { Badge, Card, Field, Input, PageTitle } from "@/account/ui";
import { saveProductAction } from "@/admin/actions";
import { L10nInput } from "@/admin/l10n-fields";
import { PlanForm } from "@/admin/plan-form";
import { fa, nFa, periodFa, priceFa } from "@/admin/util";
import { requireStaff } from "@/server/auth/guards";
import { db, schema } from "@/server/db";

export const metadata = { title: "محصول" };

export default async function Product({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff(true);
  const id = Number((await params).id);
  const p = await db.query.products.findFirst({ where: eq(schema.products.id, id), with: { plans: { orderBy: [asc(schema.plans.sort), asc(schema.plans.price)] } } });
  if (!p) notFound();
  return (
    <>
      <PageTitle title={fa(p.name)} lead={`شناسه: ${p.key}`} />
      <div className="grid gap-6">
        <Card title="پلن‌ها">
          {p.plans.length === 0 ? <p className="text-[14px] text-ink-3">هنوز پلنی تعریف نشده است؛ از فرم پایین اضافه کنید.</p> : (
            <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {p.plans.map((pl) => (
                <li key={pl.id}>
                  <Link href={`/admin/plans/${pl.id}/`} className="block rounded-xl border border-line p-4 hover:border-ink-3">
                    <div className="flex items-start justify-between gap-2"><b>{fa(pl.name)}</b><span className="flex gap-1">{pl.highlighted && <Badge tone="amber">پیشنهادی</Badge>}{pl.active ? <Badge tone="green">فعال</Badge> : <Badge tone="gray">غیرفعال</Badge>}</span></div>
                    <p className="mt-1 text-[13px] text-ink-3">{periodFa[pl.period]} · {nFa(pl.durationDays)} روز</p>
                    <p className="mt-2 text-[18px] font-extrabold">{priceFa(pl.price, pl.currency)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card title="پلن جدید"><PlanForm productId={p.id} /></Card>
        <Card title="مشخصات محصول">
          <ActionForm action={saveProductAction}>
            <input type="hidden" name="id" value={p.id} />
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="شناسه (انگلیسی)"><Input name="key" ltr defaultValue={p.key} required /></Field>
              <Field label="ترتیب"><Input name="sort" inputMode="numeric" ltr defaultValue={String(p.sort)} /></Field>
              <label className="flex items-center gap-2 pt-7 text-[14px] font-semibold"><input type="checkbox" name="active" defaultChecked={p.active} className="size-4 accent-[var(--color-amber)]" />فعال</label>
            </div>
            <L10nInput name="name" label="نام محصول" value={p.name} required />
            <L10nInput name="desc" label="توضیح" value={p.description} area />
            <div><Submit>ذخیره</Submit></div>
          </ActionForm>
        </Card>
      </div>
    </>
  );
}
