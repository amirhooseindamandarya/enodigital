import Link from "next/link";
import { accHref, accLocale } from "@/account/context";
import { at } from "@/account/i18n";
import { AuthCard } from "@/account/ui";
import { ForgotForm } from "@/account/auth-forms";

export async function generateMetadata() { return { title: at("forgotTitle", await accLocale()) }; }

export default async function ForgotPage() {
  const l = await accLocale();
  const t = Object.fromEntries((["phone", "sendCode", "code", "newPassword", "passwordHint", "resetBtn", "testCode"] as const).map((k) => [k, at(k, l)])) as Record<"phone" | "sendCode" | "code" | "newPassword" | "passwordHint" | "resetBtn" | "testCode", string>;
  return (
    <AuthCard title={at("forgotTitle", l)} lead={at("forgotLead", l)}
      footer={<Link href={accHref(l, "login")} className="font-bold text-ink underline decoration-amber decoration-2 underline-offset-4">{at("loginBtn", l)}</Link>}>
      <ForgotForm locale={l} t={t} />
    </AuthCard>
  );
}
