import { ActionForm, Submit } from "@/account/form";
import { Field, Input, Select, Textarea } from "@/account/ui";
import { savePlanAction } from "@/admin/actions";
import { L10nInput } from "@/admin/l10n-fields";
import { currencyFa, periodFa, priceInput } from "@/admin/util";
import type { schema } from "@/server/db";

type Plan = typeof schema.plans.$inferSelect;
const DEFAULT_DAYS: Record<string, number> = { monthly: 30, quarterly: 90, semiannual: 180, yearly: 365, one_time: 0 };

export function PlanForm({ productId, plan }: { productId: number; plan?: Plan }) {
  return (
    <ActionForm action={savePlanAction} resetOnOk={!plan}>
      <input type="hidden" name="productId" value={productId} />
      {plan && <input type="hidden" name="id" value={plan.id} />}
      <L10nInput name="name" label="نام پلن" value={plan?.name} required />
      <div className="grid gap-4 sm:grid-cols-5">
        <Field label="قیمت (بدون مالیات)" hint="تومان؛ یا دلار مثل 19.99"><Input name="price" inputMode="decimal" ltr defaultValue={plan ? priceInput(plan.price, plan.currency) : ""} required /></Field>
        <Field label="واحد پول" hint="قیمت دلاری هنگام خرید با نرخ روز به تومان تبدیل می‌شود"><Select name="currency" defaultValue={plan?.currency ?? "IRR"}>{Object.entries(currencyFa).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</Select></Field>
        <Field label="دورهٔ پرداخت"><Select name="period" defaultValue={plan?.period ?? "monthly"}>{Object.entries(periodFa).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</Select></Field>
        <Field label="مدت اشتراک (روز)" hint={`پیش‌فرض: ماهانه ۳۰، سالانه ۳۶۵`}><Input name="durationDays" inputMode="numeric" ltr defaultValue={String(plan?.durationDays ?? DEFAULT_DAYS.monthly)} /></Field>
        <Field label="ترتیب نمایش"><Input name="sort" inputMode="numeric" ltr defaultValue={String(plan?.sort ?? 0)} /></Field>
      </div>
      <L10nInput name="desc" label="توضیح کوتاه" value={plan?.description} />
      <fieldset className="grid gap-3 rounded-xl border border-line p-3 sm:grid-cols-3">
        <legend className="px-1 text-[13.5px] font-bold text-ink-2">امکانات (هر خط یک مورد)</legend>
        <Field label="فارسی"><Textarea name="features_fa" defaultValue={plan?.features.fa.join("\n") ?? ""} /></Field>
        <Field label="English"><Textarea name="features_en" dir="ltr" defaultValue={plan?.features.en?.join("\n") ?? ""} /></Field>
        <Field label="العربية"><Textarea name="features_ar" defaultValue={plan?.features.ar?.join("\n") ?? ""} /></Field>
      </fieldset>
      <div className="flex flex-wrap gap-5 text-[14px] font-semibold">
        <label className="flex items-center gap-2"><input type="checkbox" name="active" defaultChecked={plan?.active ?? true} className="size-4 accent-[var(--color-amber)]" />فعال (قابل خرید)</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="highlighted" defaultChecked={plan?.highlighted ?? false} className="size-4 accent-[var(--color-amber)]" />پلن پیشنهادی (برجسته)</label>
      </div>
      <div><Submit>{plan ? "ذخیرهٔ پلن" : "افزودن پلن"}</Submit></div>
    </ActionForm>
  );
}
