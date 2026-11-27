import { ActionForm, Submit } from "@/account/form";
import { Card, Field, Input, PageTitle } from "@/account/ui";
import { saveMyAccountAction } from "@/admin/actions";
import { roleFa } from "@/admin/util";
import { requireStaff } from "@/server/auth/guards";

export const metadata = { title: "حساب من" };

export default async function MyAccount() {
  const me = await requireStaff();
  return (
    <>
      <PageTitle title="حساب من" lead={`نقش: ${roleFa[me.role]}. شماره و رمز ورود شما در پایگاه داده ذخیره می‌شود.`} />
      <Card className="max-w-3xl">
        <ActionForm action={saveMyAccountAction}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="نام"><Input name="name" defaultValue={me.name} required /></Field>
            <Field label="شمارهٔ موبایل (نام کاربری ورود)"><Input name="phone" defaultValue={me.phone} inputMode="tel" ltr required /></Field>
            <Field label="ایمیل (اختیاری؛ برای ورود هم قابل استفاده است)" className="sm:col-span-2"><Input name="email" type="email" defaultValue={me.email ?? ""} ltr /></Field>
          </div>
          <fieldset className="grid gap-4 rounded-xl border border-line p-3 sm:grid-cols-2">
            <legend className="px-1 text-[13.5px] font-bold text-ink-2">تغییر رمز عبور (اختیاری)</legend>
            <Field label="رمز جدید" hint="حداقل ۸ نویسه"><Input name="password" type="password" autoComplete="new-password" ltr /></Field>
            <Field label="تکرار رمز جدید"><Input name="password2" type="password" autoComplete="new-password" ltr /></Field>
          </fieldset>
          <Field label="رمز عبور فعلی" hint="برای ذخیرهٔ هر تغییری لازم است"><Input name="current" type="password" autoComplete="current-password" ltr required /></Field>
          <div><Submit>ذخیره</Submit></div>
        </ActionForm>
      </Card>
    </>
  );
}
