import { desc, eq } from "drizzle-orm";
import { Monitor, Smartphone } from "lucide-react";
import { accHref, accLocale } from "@/account/context";
import { at } from "@/account/i18n";
import { ActionForm, Submit } from "@/account/form";
import { Badge, Card, Field, Input, PageTitle } from "@/account/ui";
import { passwordAction, signOutOthersAction } from "@/account/actions";
import { requireUser } from "@/server/auth/guards";
import { db, schema } from "@/server/db";
import { fmtDate } from "@/lib/money";

export async function generateMetadata() { return { title: at("security", await accLocale()) }; }

function device(ua: string | null) {
  if (!ua) return null;
  const os = /Android/i.test(ua) ? "Android" : /iPhone|iPad/i.test(ua) ? "iOS" : /Windows/i.test(ua) ? "Windows" : /Mac OS/i.test(ua) ? "macOS" : /Linux/i.test(ua) ? "Linux" : "";
  const br = /Edg\//.test(ua) ? "Edge" : /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "";
  return { label: [br, os].filter(Boolean).join(" · "), mobile: /Mobile|Android|iPhone/i.test(ua) };
}

export default async function Security() {
  const l = await accLocale();
  const u = await requireUser(accHref(l, "login"), accHref(l, "security"));
  const sessions = await db.query.sessions.findMany({ where: eq(schema.sessions.userId, u.id), orderBy: desc(schema.sessions.lastSeenAt) });
  return (
    <>
      <PageTitle title={at("security", l)} />
      <div className="grid max-w-3xl gap-6">
        <Card title={at("changePassword", l)}>
          <ActionForm action={passwordAction} resetOnOk>
            <input type="hidden" name="locale" value={l} />
            <input type="text" name="username" autoComplete="username" defaultValue={u.phone} hidden readOnly />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={at("currentPassword", l)}><Input name="current" type="password" autoComplete="current-password" ltr required /></Field>
              <Field label={at("newPassword", l)} hint={at("passwordHint", l)}><Input name="password" type="password" autoComplete="new-password" ltr required minLength={8} /></Field>
            </div>
            <div><Submit>{at("changePassword", l)}</Submit></div>
          </ActionForm>
        </Card>
        <Card title={at("sessions", l)}>
          <ul className="divide-y divide-line">
            {sessions.map((s) => {
              const d = device(s.userAgent);
              const I = d?.mobile ? Smartphone : Monitor;
              return (
                <li key={s.id} className="flex items-center gap-3 py-3">
                  <I className="size-5 shrink-0 text-ink-3" aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold">{d?.label || at("unknownDevice", l)}</span>
                    <span className="block text-[13px] text-ink-3">{at("lastSeen", l)}: {fmtDate(s.lastSeenAt, l, true)}{s.ip ? <> · <span dir="ltr">{s.ip}</span></> : null}</span>
                  </span>
                  {s.id === u.sessionId && <Badge tone="green">{at("thisDevice", l)}</Badge>}
                </li>
              );
            })}
          </ul>
          {sessions.length > 1 && (
            <ActionForm action={signOutOthersAction} className="mt-4">
              <input type="hidden" name="locale" value={l} />
              <div><Submit variant="outline">{at("signOutOthers", l)}</Submit></div>
            </ActionForm>
          )}
        </Card>
      </div>
    </>
  );
}
