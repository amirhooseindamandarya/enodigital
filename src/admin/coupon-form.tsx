import { ActionForm, Submit } from "@/account/form";
import { Field, Input, Select } from "@/account/ui";
import { saveCouponAction } from "@/admin/actions";
import { dateInput, fa } from "@/admin/util";
import type { schema } from "@/server/db";

type C = typeof schema.coupons.$inferSelect;
type P = typeof schema.products.$inferSelect;

export function CouponForm({ c, products }: { c?: C; products: P[] }) {
  return (
    <ActionForm action={saveCouponAction} resetOnOk={!c}>
      {c && <input type="hidden" name="id" value={c.id} />}
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="کد"><Input name="code" ltr defaultValue={c?.code ?? ""} required className="uppercase" /></Field>
        <Field label="نوع"><Select name="kind" defaultValue={c?.kind ?? "percent"}><option value="percent">درصدی</option><option value="fixed">مبلغ ثابت (تومان)</option></Select></Field>
        <Field label="مقدار" hint="درصد (۱ تا ۱۰۰) یا مبلغ به تومان"><Input name="value" inputMode="numeric" ltr defaultValue={c ? String(c.value) : ""} required /></Field>
        <Field label="فقط برای محصول"><Select name="productId" defaultValue={c?.productId ? String(c.productId) : ""}><option value="">همهٔ محصولات</option>{products.map((p) => <option key={p.id} value={p.id}>{fa(p.name)}</option>)}</Select></Field>
        <Field label="حداکثر دفعات استفاده" hint="خالی = نامحدود"><Input name="maxUses" inputMode="numeric" ltr defaultValue={c?.maxUses != null ? String(c.maxUses) : ""} /></Field>
        <Field label="تاریخ انقضا" hint="خالی = بدون انقضا"><Input name="expiresAt" type="date" ltr defaultValue={dateInput(c?.expiresAt)} /></Field>
      </div>
      <label className="flex items-center gap-2 text-[14px] font-semibold"><input type="checkbox" name="active" defaultChecked={c?.active ?? true} className="size-4 accent-[var(--color-amber)]" />فعال</label>
      <div><Submit>{c ? "ذخیره" : "ساخت کد تخفیف"}</Submit></div>
    </ActionForm>
  );
}
