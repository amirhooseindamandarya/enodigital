import Link from "next/link";
import { redirect } from "next/navigation";
import { accHref, accLocale, safeNext } from "@/account/context";
import { at } from "@/account/i18n";
import { ActionForm, Submit } from "@/account/form";
import { AuthCard, Field, Input } from "@/account/ui";
import { registerAction } from "@/account/actions";
import { getCurrentUser } from "@/server/auth/session";

export async function generateMetadata() { return { title: at("registerTitle", await accLocale()) }; }

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const l = await accLocale();
  const { next } = await searchParams;
  if (await getCurrentUser()) redirect(safeNext(next, l));
  return (
    <AuthCard title={at("registerTitle", l)} lead={at("registerLead", l)}
      footer={<>{at("haveAccount", l)} <Link href={accHref(l, "login", { next })} className="font-bold text-ink underline decoration-amber decoration-2 underline-offset-4">{at("loginBtn", l)}</Link></>}>
      <ActionForm action={registerAction}>
        <input type="hidden" name="locale" value={l} />
        <input type="hidden" name="next" value={next ?? ""} />
        <Field label={at("name", l)}><Input name="name" autoComplete="name" required /></Field>
        <Field label={at("phone", l)}><Input name="phone" inputMode="tel" autoComplete="tel" ltr required placeholder="09xx xxx xxxx" /></Field>
        <Field label={`${at("email", l)} (${at("optional", l)})`}><Input name="email" type="email" autoComplete="email" ltr /></Field>
        <Field label={at("password", l)} hint={at("passwordHint", l)}><Input name="password" type="password" autoComplete="new-password" ltr required minLength={8} /></Field>
        <p className="text-[12.5px] leading-6 text-ink-3">{at("acceptTerms", l)}</p>
        <Submit className="w-full">{at("registerBtn", l)}</Submit>
      </ActionForm>
    </AuthCard>
  );
}
