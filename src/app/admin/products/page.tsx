import Link from "next/link";
import { asc } from "drizzle-orm";
import { ActionForm, Submit } from "@/account/form";
import { Badge, Card, Field, Input, PageTitle } from "@/account/ui";
import { saveProductAction } from "@/admin/actions";
import { L10nInput } from "@/admin/l10n-fields";
import { fa, nFa } from "@/admin/util";
import { requireStaff } from "@/server/auth/guards";
import { db, schema } from "@/server/db";
import { fmtToman } from "@/lib/money";

export const metadata = { title: "محصولات و پلن‌ها" };

export default async function Products() {
  await requireStaff(true);
  const rows = await db.query.products.findMany({ orderBy: [asc(schema.products.sort), asc(schema.products.id)], with: { plans: { orderBy: asc(schema.plans.price) } } });
  return (
    <>
      <PageTitle title="محصولات و پلن‌ها" lead="پلن‌های فعال در صفحهٔ قیمت‌ها و صفحهٔ هر محصول نمایش داده می‌شوند." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((p) => {
          const active = p.plans.filter((x) => x.active);
          return (
            <Link key={p.id} href={`/admin/products/${p.id}/`} className="rounded-2xl border border-line bg-white p-5 transition-shadow hover:shadow-[var(--shadow-soft)]">
              <div className="flex items-start justify-between gap-2"><span className="text-[18px] font-extrabold">{fa(p.name)}</span>{p.active ? <Badge tone="green">فعال</Badge> : <Badge tone="gray">غیرفعال</Badge>}</div>
              <p className="text-[13px] text-ink-3" dir="ltr">{p.key}</p>
              <p className="mt-3 text-[14px] text-ink-2">{nFa(active.length)} پلن فعال{active.length ? ` · از ${fmtToman(Math.min(...active.map((x) => x.price)))}` : ""}</p>
            </Link>
          );
        })}
      </div>
      <Card title="محصول جدید" className="mt-6">
        <ActionForm action={saveProductAction}>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="شناسه (انگلیسی)" hint="مثل limoc؛ با شناسهٔ محصول در سایت یکی باشد."><Input name="key" ltr required /></Field>
            <Field label="ترتیب"><Input name="sort" inputMode="numeric" ltr defaultValue="0" /></Field>
            <label className="flex items-center gap-2 pt-7 text-[14px] font-semibold"><input type="checkbox" name="active" defaultChecked className="size-4 accent-[var(--color-amber)]" />فعال</label>
          </div>
          <L10nInput name="name" label="نام محصول" required />
          <L10nInput name="desc" label="توضیح" area />
          <div><Submit>ساخت محصول</Submit></div>
        </ActionForm>
      </Card>
    </>
  );
}
