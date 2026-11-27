import { ExternalLink } from "lucide-react";
import { accHref, accLocale } from "@/account/context";
import { at } from "@/account/i18n";
import { lt, userSubscriptions } from "@/account/data";
import { Badge, Btn, Empty, PageTitle, subTone } from "@/account/ui";
import { requireUser } from "@/server/auth/guards";
import { getSettings } from "@/server/settings";
import { daysLeft, fmtDate } from "@/lib/money";

export async function generateMetadata() { return { title: at("subscriptions", await accLocale()) }; }

export default async function Subscriptions() {
  const l = await accLocale();
  const u = await requireUser(accHref(l, "login"), accHref(l, "subscriptions"));
  const [subs, settings] = await Promise.all([userSubscriptions(u.id), getSettings()]);
  const n = (x: number) => x.toLocaleString(l === "fa" ? "fa-IR" : "en-US");
  return (
    <>
      <PageTitle title={at("subscriptions", l)} action={<Btn href={accHref(l, "checkout")}>{at("pricing", l)}</Btn>} />
      {subs.length === 0 ? <Empty action={<Btn href={accHref(l, "checkout")} size="sm">{at("pricing", l)}</Btn>}>{at("noSubs", l)}</Empty> : (
        <div className="grid gap-4">
          {subs.map((s) => {
            const left = daysLeft(s.endsAt);
            const warn = s.effective === "active" && s.endsAt && left <= settings.expiryWarnDays;
            const canRenew = s.effective !== "cancelled" && s.plan.period !== "one_time";
            const renewHref = s.plan.active ? accHref(l, "checkout", { plan: s.planId, renew: s.id }) : accHref(l, "checkout", { product: s.product.key, renew: s.id });
            return (
              <article key={s.id} className="rounded-2xl border border-line bg-white p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-[18px] font-extrabold">{lt(s.product.name, l)}</h2>
                    <p className="text-[14px] text-ink-3">{at("plan", l)}: {lt(s.plan.name, l)}</p>
                  </div>
                  <Badge tone={warn ? "amber" : subTone[s.effective]}>{warn ? at("expiringSoon", l) : at(`sst_${s.effective}`, l)}</Badge>
                </div>
                <dl className="mt-4 grid gap-3 text-[14px] sm:grid-cols-3">
                  <div><dt className="text-[12.5px] font-bold text-ink-3">{at("startsAt", l)}</dt><dd>{fmtDate(s.startsAt, l)}</dd></div>
                  <div><dt className="text-[12.5px] font-bold text-ink-3">{at("endsAt", l)}</dt><dd>{s.endsAt ? fmtDate(s.endsAt, l) : at("unlimited", l)}</dd></div>
                  {s.effective === "active" && s.endsAt && <div><dt className="text-[12.5px] font-bold text-ink-3">{at("status", l)}</dt><dd className={warn ? "font-bold text-amber-ink" : ""}>{n(Math.max(0, left))} {at("expiresIn", l)}</dd></div>}
                </dl>
                {(s.effective === "active" || s.effective === "pending") && (
                  <div className="mt-4 rounded-xl bg-paper p-4 text-[14px]">
                    <p className="text-[12.5px] font-bold text-ink-3">{at("access", l)}</p>
                    {s.accessUrl || s.accessNote ? (
                      <div className="mt-1.5 grid gap-2">
                        {s.accessNote && <p className="whitespace-pre-line leading-7">{s.accessNote}</p>}
                        {s.accessUrl && <a href={s.accessUrl} target="_blank" rel="noopener" className="inline-flex w-fit items-center gap-1.5 font-bold text-ink underline decoration-amber decoration-2 underline-offset-4">{at("openService", l)} <ExternalLink className="size-4" aria-hidden /></a>}
                      </div>
                    ) : <p className="mt-1.5 leading-7 text-ink-2">{at("accessPending", l)}</p>}
                  </div>
                )}
                {canRenew && <div className="mt-4"><Btn href={renewHref} variant={warn || s.effective === "expired" ? "primary" : "outline"} size="sm">{at("renew", l)}</Btn></div>}
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
