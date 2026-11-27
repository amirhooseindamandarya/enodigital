import { redirect } from "next/navigation";
import { ActionForm, Submit } from "@/account/form";
import { AuthCard, Field, Input } from "@/account/ui";
import { setupAdminAction } from "@/admin/actions";
import { hasAdmin } from "@/server/auth/guards";

export const metadata = { title: "راه‌اندازی" };

/** فقط تا وقتی هیچ مدیر کلی در پایگاه داده نیست در دسترس است */
export default async function AdminSetup() {
  if (await hasAdmin()) redirect("/admin/login/");
  return (
    <AuthCard title="راه‌اندازی پنل مدیریت" lead="حساب مدیر کل را بسازید. شماره و رمز در پایگاه داده (به‌صورت رمزنگاری‌شده) ذخیره می‌شود و بعداً از «حساب من» قابل تغییر است.">
      <ActionForm action={setupAdminAction}>
        <Field label="نام"><Input name="name" autoComplete="name" required /></Field>
        <Field label="شمارهٔ موبایل" hint="برای ورود به پنل"><Input name="phone" autoComplete="username" inputMode="tel" ltr required /></Field>
        <Field label="رمز عبور" hint="حداقل ۱۰ نویسه"><Input name="password" type="password" autoComplete="new-password" ltr required minLength={10} /></Field>
        <Field label="تکرار رمز عبور"><Input name="password2" type="password" autoComplete="new-password" ltr required minLength={10} /></Field>
        <Submit className="w-full">ساخت مدیر کل و ورود</Submit>
      </ActionForm>
    </AuthCard>
  );
}
