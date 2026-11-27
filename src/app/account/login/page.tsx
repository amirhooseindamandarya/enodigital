import Link from "next/link";
import { redirect } from "next/navigation";
import { accHref, accLocale, safeNext } from "@/account/context";
import { at } from "@/account/i18n";
import { ActionForm, Submit } from "@/account/form";
import { AuthCard, Field, Input } from "@/account/ui";
import { loginAction } from "@/account/actions";
import { getCurrentUser } from "@/server/auth/session";

export async function generateMetadata() { return { title: at("loginTitle", await accLocale()) }; }

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const l = await accLocale();
  const { next } = await searchParams;
  if (await getCurrentUser()) redirect(safeNext(next, l));
  return (
    <AuthCard title={at("loginTitle", l)} lead={at("loginLead", l)}
      footer={<>{at("noAccount", l)} <Link href={accHref(l, "register", { next })} className="font-bold text-ink underline decoration-amber decoration-2 underline-offset-4">{at("registerBtn", l)}</Link></>}>
      <ActionForm action={loginAction}>
        <input type="hidden" name="locale" value={l} />
        <input type="hidden" name="next" value={next ?? ""} />
        <Field label={at("phoneOrEmail", l)}><Input name="identifier" autoComplete="username" ltr required placeholder="09xx xxx xxxx" /></Field>
        <Field label={at("password", l)}><Input name="password" type="password" autoComplete="current-password" ltr required /></Field>
        <div className="-mt-1 text-[13.5px]"><Link href={accHref(l, "forgot")} className="font-semibold text-ink-2 hover:text-ink">{at("forgot", l)}</Link></div>
        <Submit className="w-full">{at("loginBtn", l)}</Submit>
      </ActionForm>
    </AuthCard>
  );
}
