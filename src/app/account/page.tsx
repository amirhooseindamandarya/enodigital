import { accHref, accLocale } from "@/account/context";
import { at } from "@/account/i18n";
import { dashboardData, lt } from "@/account/data";
import { Badge, Btn, Card, Empty, PageTitle, Stat, orderTone, subTone } from "@/account/ui";
import { requireUser } from "@/server/auth/guards";
import { orderNumber } from "@/server/orders";
import { getSettings } from "@/server/settings";
import { daysLeft, fmtDate, fmtToman } from "@/lib/money";
import { cn } from "@/lib/utils";
import Link from "next/link";

export async function generateMetadata() { return { title: at("dashboard", await accLocale()) }; }

export default async function Dashboard() {
  const l = await accLocale();
  const u = await requireUser(accHref(l, "login"), accHref(l));
  const [d, settings] = await Promise.all([dashboardData(u.id), getSettings()]);
  const active = d.subs.filter((s) => s.effective === "active");
  const shown = d.subs.filter((s) => s.effective !== "cancelled").slice(0, 4);
  const needsBilling = !u.nationalId && !u.company;

  return (
    <>
      <PageTitle title={`${at("welcome", l)}${l === "en" ? ", " : "، "}${u.name.split(" ")[0]}`} lead={at("welcomeLead", l)}
        action={<Btn href={accHref(l, "checkout")}>{at("pricing", l)}</Btn>} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label={at("activeSubs", l)} value={active.length.toLocaleString(l === "fa" ? "fa-IR" : "en-US")} tone="green" href={accHref(l, "subscriptions")} />
        <Stat label={at("awaitingPayment", l)} value={d.pending.toLocaleString(l === "fa" ? "fa-IR" : "en-US")} tone={d.pending ? "amber" : "gray"} href={accHref(l, "orders")} />
        <Stat label={at("openTickets", l)} value={d.openTickets.toLocaleString(l === "fa" ? "fa-IR" : "en-US")} tone="blue" href={accHref(l, "tickets")} />
      </div>

      {needsBilling && (
        <Link href={accHref(l, "profile")} className="mt-4 block rounded-2xl border border-amber/30 bg-amber/10 p-4 text-[14px] font-semibold text-amber-ink hover:bg-amber/15">{at("completeProfile", l)}</Link>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card title={at("subscriptions", l)} action={<Btn href={accHref(l, "subscriptions")} variant="ghost" size="sm">{at("viewAll", l)}</Btn>}>
          {shown.length === 0 ? <Empty action={<Btn href={accHref(l, "checkout")} size="sm">{at("pricing", l)}</Btn>}>{at("noSubs", l)}</Empty> : (
            <ul className="grid gap-3">
              {shown.map((s) => {
                const left = daysLeft(s.endsAt);
                const warn = s.effective === "active" && s.endsAt && left <= settings.expiryWarnDays;
                return (
                  <li key={s.id} className="rounded-xl border border-line p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-extrabold">{lt(s.product.name, l)}</p>
                        <p className="text-[13.5px] text-ink-3">{lt(s.plan.name, l)}</p>
                      </div>
                      <Badge tone={warn ? "amber" : subTone[s.effective]}>{warn ? at("expiringSoon", l) : at(`sst_${s.effective}`, l)}</Badge>
                    </div>
                    {s.effective === "active" && s.endsAt && (
                      <div className="mt-3">
                        <div className="flex justify-between text-[12.5px] text-ink-3"><span>{at("endsAt", l)}: {fmtDate(s.endsAt, l)}</span><span>{Math.max(0, left).toLocaleString(l === "fa" ? "fa-IR" : "en-US")} {at("expiresIn", l)}</span></div>
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line"><div className={cn("h-full rounded-full", warn ? "bg-amber" : "bg-teal")} style={{ width: `${Math.min(100, Math.max(4, (left / Math.max(1, s.plan.durationDays)) * 100))}%` }} /></div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card title={at("recentOrders", l)} action={<Btn href={accHref(l, "orders")} variant="ghost" size="sm">{at("viewAll", l)}</Btn>}>
          {d.recent.length === 0 ? <Empty>{at("noOrders", l)}</Empty> : (
            <ul className="divide-y divide-line">
              {d.recent.map((o) => (
                <li key={o.id}>
                  <Link href={accHref(l, `orders/${o.id}`)} className="flex items-center justify-between gap-3 py-3 hover:opacity-80">
                    <span className="min-w-0">
                      <span className="block font-bold" dir="ltr">{orderNumber(o.id)}</span>
                      <span className="block truncate text-[13px] text-ink-3">{lt(o.items[0]?.title, l)} · {fmtDate(o.createdAt, l)}</span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1">
                      <Badge tone={orderTone[o.status]}>{at(`st_${o.status}`, l)}</Badge>
                      <span className="text-[13px] font-bold">{fmtToman(o.total, l)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
