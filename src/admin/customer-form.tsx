import { ActionForm, Submit } from "@/account/form";
import { Card, Field, Input, Select, Textarea } from "@/account/ui";
import { saveCustomerAction } from "@/admin/actions";
import type { schema } from "@/server/db";

type U = Partial<typeof schema.users.$inferSelect>;

export function CustomerForm({ u }: { u?: U }) {
  return (
    <ActionForm action={saveCustomerAction} className="gap-6">
      {u?.id && <input type="hidden" name="id" value={u.id} />}
      <Card title="اطلاعات حساب">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="نام و نام خانوادگی"><Input name="name" defaultValue={u?.name ?? ""} required /></Field>
          <Field label="شمارهٔ موبایل"><Input name="phone" defaultValue={u?.phone ?? ""} ltr required /></Field>
          <Field label="ایمیل"><Input name="email" type="email" defaultValue={u?.email ?? ""} ltr /></Field>
          <Field label="وضعیت حساب"><Select name="status" defaultValue={u?.status ?? "active"}><option value="active">فعال</option><option value="blocked">مسدود</option></Select></Field>
          <Field label={u?.id ? "رمز عبور جدید (اختیاری)" : "رمز عبور"} hint={u?.id ? "اگر پر شود، رمز تغییر می‌کند و کاربر از همهٔ دستگاه‌ها خارج می‌شود." : "حداقل ۸ نویسه؛ آن را به مشتری اطلاع دهید."}><Input name="password" type="text" autoComplete="new-password" ltr /></Field>
        </div>
      </Card>
      <Card title="اطلاعات صورت‌حساب">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="شرکت / سازمان" className="sm:col-span-2"><Input name="company" defaultValue={u?.company ?? ""} /></Field>
          <Field label="شناسه / کد ملی"><Input name="nationalId" defaultValue={u?.nationalId ?? ""} ltr /></Field>
          <Field label="کد اقتصادی"><Input name="economicCode" defaultValue={u?.economicCode ?? ""} ltr /></Field>
          <Field label="کد پستی"><Input name="postalCode" defaultValue={u?.postalCode ?? ""} ltr /></Field>
          <Field label="نشانی" className="sm:col-span-2"><Textarea name="address" defaultValue={u?.address ?? ""} className="min-h-[80px]" /></Field>
        </div>
      </Card>
      <div><Submit>{u?.id ? "ذخیره" : "ساخت مشتری"}</Submit></div>
    </ActionForm>
  );
}
