import { ActionForm, Submit } from "@/account/form";
import { Field, Input, Select, Textarea } from "@/account/ui";
import { saveServiceAction, saveServiceCategoryAction } from "@/admin/actions";
import { L10nInput } from "@/admin/l10n-fields";
import { currencyFa, fa, priceInput } from "@/admin/util";
import type { schema } from "@/server/db";

type Category = typeof schema.serviceCategories.$inferSelect;
type Service = typeof schema.services.$inferSelect;

const check = "size-4 accent-[var(--color-amber)]";

export function CategoryForm({ cat }: { cat?: Category }) {
  return (
    <ActionForm action={saveServiceCategoryAction} resetOnOk={!cat}>
      {cat && <input type="hidden" name="id" value={cat.id} />}
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="نامک (انگلیسی)" hint="مثل web-design؛ در نشانی صفحه استفاده می‌شود"><Input name="slug" ltr defaultValue={cat?.slug} required /></Field>
        <Field label="ترتیب نمایش"><Input name="sort" inputMode="numeric" ltr defaultValue={String(cat?.sort ?? 0)} /></Field>
        <label className="flex items-center gap-2 pt-7 text-[14px] font-semibold"><input type="checkbox" name="active" defaultChecked={cat?.active ?? true} className={check} />فعال</label>
      </div>
      <L10nInput name="name" label="نام دسته" value={cat?.name} required />
      <L10nInput name="desc" label="توضیح کوتاه" value={cat?.description} />
      <div><Submit>{cat ? "ذخیرهٔ دسته" : "افزودن دسته"}</Submit></div>
    </ActionForm>
  );
}

export function ServiceForm({ categories, service, defaultCategory }: { categories: Category[]; service?: Service; defaultCategory?: number }) {
  return (
    <ActionForm action={saveServiceAction} resetOnOk={!service}>
      {service && <input type="hidden" name="id" value={service.id} />}
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="دسته"><Select name="categoryId" defaultValue={String(service?.categoryId ?? defaultCategory ?? categories[0]?.id ?? "")} required>{categories.map((c) => <option key={c.id} value={c.id}>{fa(c.name)}</option>)}</Select></Field>
        <Field label="نامک (انگلیسی)" hint="مثل landing-page"><Input name="slug" ltr defaultValue={service?.slug} required /></Field>
        <Field label="ترتیب نمایش"><Input name="sort" inputMode="numeric" ltr defaultValue={String(service?.sort ?? 0)} /></Field>
      </div>
      <L10nInput name="name" label="نام خدمت" value={service?.name} required />
      <L10nInput name="summary" label="توضیح کوتاه" value={service?.summary} area />

      <fieldset className="grid gap-4 rounded-xl border border-line p-3 sm:grid-cols-4">
        <legend className="px-1 text-[13.5px] font-bold text-ink-2">قیمت‌گذاری</legend>
        <Field label="نوع قیمت"><Select name="pricing" defaultValue={service?.pricing ?? "fixed"}><option value="fixed">قیمت ثابت (خرید آنلاین)</option><option value="quote">قیمت توافقی (درخواست مشاوره)</option></Select></Field>
        <Field label="قیمت (بدون مالیات)" hint="تومان؛ یا دلار مثل 49.5"><Input name="price" inputMode="decimal" ltr defaultValue={service ? priceInput(service.price, service.currency) : ""} /></Field>
        <Field label="واحد پول" hint="دلاری: هنگام خرید با نرخ روز به تومان تبدیل می‌شود"><Select name="currency" defaultValue={service?.currency ?? "IRR"}>{Object.entries(currencyFa).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</Select></Field>
        <Field label="مدت تحویل (روز کاری)" hint="۰ = نمایش داده نشود"><Input name="deliveryDays" inputMode="numeric" ltr defaultValue={String(service?.deliveryDays ?? 0)} /></Field>
      </fieldset>
      <L10nInput name="unit" label="واحد قیمت (اختیاری؛ مثل «هر صفحه» یا «ماهانه»)" value={service?.unit} />

      <fieldset className="grid gap-3 rounded-xl border border-line p-3 sm:grid-cols-3">
        <legend className="px-1 text-[13.5px] font-bold text-ink-2">موارد شامل (هر خط یک مورد)</legend>
        <Field label="فارسی"><Textarea name="features_fa" defaultValue={service?.features.fa.join("\n") ?? ""} /></Field>
        <Field label="English"><Textarea name="features_en" dir="ltr" defaultValue={service?.features.en?.join("\n") ?? ""} /></Field>
        <Field label="العربية"><Textarea name="features_ar" defaultValue={service?.features.ar?.join("\n") ?? ""} /></Field>
      </fieldset>
      <div className="flex flex-wrap gap-5 text-[14px] font-semibold">
        <label className="flex items-center gap-2"><input type="checkbox" name="active" defaultChecked={service?.active ?? true} className={check} />فعال (نمایش در سایت)</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="highlighted" defaultChecked={service?.highlighted ?? false} className={check} />برجسته</label>
      </div>
      <div><Submit>{service ? "ذخیرهٔ خدمت" : "افزودن خدمت"}</Submit></div>
    </ActionForm>
  );
}
