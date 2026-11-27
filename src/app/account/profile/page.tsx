import { accHref, accLocale } from "@/account/context";
import { at } from "@/account/i18n";
import { ActionForm, Submit } from "@/account/form";
import { Card, Field, Input, PageTitle, Select, Textarea } from "@/account/ui";
import { profileAction } from "@/account/actions";
import { requireUser } from "@/server/auth/guards";
import { localeMeta } from "@/cms/i18n";
import { LOCALES } from "@/cms/types";

export async function generateMetadata() { return { title: at("profile", await accLocale()) }; }

export default async function Profile() {
  const l = await accLocale();
  const u = await requireUser(accHref(l, "login"), accHref(l, "profile"));
  return (
    <>
      <PageTitle title={at("profile", l)} />
      <ActionForm action={profileAction} className="max-w-3xl gap-6">
        <input type="hidden" name="locale" value={l} />
        <Card title={at("personal", l)}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={at("name", l)}><Input name="name" defaultValue={u.name} required autoComplete="name" /></Field>
            <Field label={at("phone", l)} hint={at("phoneReadonly", l)}><Input value={u.phone} disabled ltr /></Field>
            <Field label={`${at("email", l)} (${at("optional", l)})`}><Input name="email" type="email" defaultValue={u.email ?? ""} ltr autoComplete="email" /></Field>
            <Field label={at("language", l)}>
              <Select name="pref_locale" defaultValue={u.locale}>{LOCALES.map((x) => <option key={x} value={x}>{localeMeta[x].name}</option>)}</Select>
            </Field>
          </div>
        </Card>
        <Card title={at("billing", l)}>
          <p className="-mt-2 mb-4 text-[13.5px] text-ink-3">{at("billingLead", l)}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={at("company", l)} className="sm:col-span-2"><Input name="company" defaultValue={u.company ?? ""} autoComplete="organization" /></Field>
            <Field label={at("nationalId", l)}><Input name="nationalId" defaultValue={u.nationalId ?? ""} ltr inputMode="numeric" /></Field>
            <Field label={at("economicCode", l)}><Input name="economicCode" defaultValue={u.economicCode ?? ""} ltr inputMode="numeric" /></Field>
            <Field label={at("postalCode", l)}><Input name="postalCode" defaultValue={u.postalCode ?? ""} ltr inputMode="numeric" autoComplete="postal-code" /></Field>
            <Field label={at("address", l)} className="sm:col-span-2"><Textarea name="address" defaultValue={u.address ?? ""} className="min-h-[80px]" autoComplete="street-address" /></Field>
          </div>
        </Card>
        <div><Submit>{at("save", l)}</Submit></div>
      </ActionForm>
    </>
  );
}
