import { redirect } from "next/navigation";
import { ActionForm, Submit } from "@/account/form";
import { AuthCard, Field, Input } from "@/account/ui";
import { adminLoginAction } from "@/admin/actions";
import { getCurrentUser } from "@/server/auth/session";
import { hasAdmin } from "@/server/auth/guards";

export const metadata = { title: "ورود" };

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const u = await getCurrentUser();
  const { denied } = await searchParams;
  if (u && u.role !== "customer") redirect("/admin/");
  if (!(await hasAdmin())) redirect("/admin/setup/");
  return (
    <AuthCard title="ورود به پنل مدیریت" lead="فقط برای کارکنان اِنو دیجیتال.">
      {denied && <p className="mb-4 rounded-xl bg-[#e5484d]/8 p-3 text-[14px] text-[#c8333a]">این حساب دسترسی مدیریت ندارد.</p>}
      <ActionForm action={adminLoginAction}>
        <Field label="شمارهٔ موبایل یا ایمیل"><Input name="identifier" autoComplete="username" ltr required /></Field>
        <Field label="رمز عبور"><Input name="password" type="password" autoComplete="current-password" ltr required /></Field>
        <Submit className="w-full">ورود</Submit>
      </ActionForm>
    </AuthCard>
  );
}
