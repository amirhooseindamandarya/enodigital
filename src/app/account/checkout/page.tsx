import Link from "next/link";
import { and, eq } from "drizzle-orm";
import { Check } from "lucide-react";
import { accHref, accLocale } from "@/account/context";
import { at, type AKey } from "@/account/i18n";
import { lt, ltList } from "@/account/data";
import { ActionForm, Submit } from "@/account/form";
import { Btn, Card, Empty, Field, Input, PageTitle, Textarea } from "@/account/ui";
import { checkoutAction } from "@/account/actions";
import { requireUser } from "@/server/auth/guards";
import { activeCatalog, checkCoupon, computeTotals, findPurchasable } from "@/server/orders";
import { gateway } from "@/server/payments";
import { getSettings } from "@/server/settings";
import { db, schema } from "@/server/db";
import { fmtNum, fmtToman, fmtUsd, usdToRial } from "@/lib/money";
import type { Locale } from "@/cms/types";
import { cn } from "@/lib/utils";

export async function generateMetadata() { return { title: at("checkout", await accLocale()) }; }

type Q = { plan?: string; service?: string; renew?: string; product?: string; coupon?: string };

export default async function Checkout({ searchParams }: { searchParams: Promise<Q> }) {
  const l = await accLocale();
  const q = await searchParams;
  const here = accHref(l, "checkout", { plan: q.plan, service: q.service, renew: q.renew, product: q.product, coupon: q.coupon });
  const u = await requireUser(accHref(l, "login"), here);
  const renewId = Number(q.renew) || undefined;
  const renewSub = renewId ? await db.query.subscriptions.findFirst({ where: and(eq(schema.subscriptions.id, renewId), eq(schema.subscriptions.userId, u.id)), with: { product: true } }) : undefined;

  const settings = await getSettings();
  const serviceId = Number(q.service) || 0;
  const planId = serviceId ? 0 : Number(q.plan) || 0;
  const plan = planId ? await db.query.plans.findFirst({ where: and(eq(schema.plans.id, planId), eq(schema.plans.active, true)), with: { product: true } }) : undefined;
  const service = serviceId ? await db.query.services.findFirst({ where: and(eq(schema.services.id, serviceId), eq(schema.services.active, true)), with: { category: true } }) : undefined;
  const item = plan || service ? await findPurchasable({ planId: plan?.id, serviceId: service?.id }, settings) : null;

  if (serviceId && !item) {
    return (<><PageTitle title={at("checkout", l)} /><Empty>{at("serviceUnavailable", l)}</Empty></>);
  }

  /* -------- انتخاب پلن -------- */
  if (!item || (plan && !plan.product.active)) {
    const catalog = await activeCatalog(renewSub?.product.key ?? q.product);
    return (
      <>
        <PageTitle title={renewSub ? at("renewTitle", l) : at("pricing", l)} />
        {catalog.length === 0 ? <Empty>{at("planUnavailable", l)}</Empty> : catalog.map((p) => (
          <section key={p.id} className="mb-8">
            <h2 className="mb-3 text-[18px] font-extrabold">{lt(p.name, l)}</h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {p.plans.map((pl) => (
                <Link key={pl.id} href={accHref(l, "checkout", { plan: pl.id, renew: renewSub?.id })}
                  className={cn("flex flex-col rounded-2xl border bg-white p-5 transition-shadow hover:shadow-[var(--shadow-lift)]", pl.highlighted ? "border-amber ring-2 ring-amber/30" : "border-line")}>
                  <span className="font-extrabold">{lt(pl.name, l)}</span>
                  <span className="mt-1 text-[13px] text-ink-3">{at(`per_${pl.period}`, l)}</span>
                  <PriceTag price={pl.price} currency={pl.currency} rate={settings} l={l} />
                  <ul className="mt-3 grid gap-1.5 text-[13.5px] text-ink-2">{ltList(pl.features, l).slice(0, 5).map((f, i) => <li key={i} className="flex gap-2"><Check className="mt-1 size-3.5 shrink-0 text-teal-700" aria-hidden />{f}</li>)}</ul>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </>
    );
  }

  /* -------- خلاصه و پرداخت -------- */
  let couponMsg: { ok: boolean; text: string } | null = null;
  let coupon: { kind: "percent" | "fixed"; value: number } | null = null;
  if (q.coupon) {
    const c = await checkCoupon(q.coupon, item.productId);
    if (c.ok) { coupon = { kind: c.coupon.kind, value: c.coupon.value }; couponMsg = { ok: true, text: at("couponApplied", l) }; }
    else couponMsg = { ok: false, text: at(`coupon_${c.reason}` as AKey, l) };
  }
  const noRate = item.unitPrice === null;
  const t = computeTotals(item.unitPrice ?? 0, 1, coupon, settings.taxRate);
  const g = gateway();
  const blocked = t.total > 0 && !g && !settings.allowManualPayment;
  const pct = (n: number) => n.toLocaleString(l === "fa" ? "fa-IR" : "en-US");

  return (
    <>
      <PageTitle title={renewSub ? at("renewTitle", l) : at("checkout", l)} />
      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <div className="grid content-start gap-6">
          {plan ? (
            <Card>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[13px] font-bold text-ink-3">{lt(plan.product.name, l)}</p>
                  <h2 className="text-[20px] font-extrabold">{lt(plan.name, l)}</h2>
                  <p className="text-[13.5px] text-ink-3">{at(`per_${plan.period}`, l)} · {pct(plan.durationDays)} {at("days", l)}</p>
                </div>
                <Btn href={accHref(l, "checkout", { product: plan.product.key, renew: renewSub?.id })} variant="ghost" size="sm">{at("plan", l)} ↺</Btn>
              </div>
              {ltList(plan.features, l).length > 0 && (
                <ul className="mt-4 grid gap-2 text-[14px] sm:grid-cols-2">{ltList(plan.features, l).map((f, i) => <li key={i} className="flex gap-2"><Check className="mt-1 size-4 shrink-0 text-teal-700" aria-hidden />{f}</li>)}</ul>
              )}
            </Card>
          ) : service ? (
            <Card>
              <p className="text-[13px] font-bold text-ink-3">{at("services", l)} · {lt(service.category.name, l)}</p>
              <h2 className="text-[20px] font-extrabold">{lt(service.name, l)}</h2>
              {lt(service.summary, l) && <p className="mt-1 text-[14px] leading-7 text-ink-2">{lt(service.summary, l)}</p>}
              {service.deliveryDays > 0 && <p className="mt-1 text-[13.5px] text-ink-3">{at("deliveryIn", l)}: {pct(service.deliveryDays)} {at("workDays", l)}</p>}
              {ltList(service.features, l).length > 0 && (
                <ul className="mt-4 grid gap-2 text-[14px] sm:grid-cols-2">{ltList(service.features, l).map((f, i) => <li key={i} className="flex gap-2"><Check className="mt-1 size-4 shrink-0 text-teal-700" aria-hidden />{f}</li>)}</ul>
              )}
              <p className="mt-4 rounded-xl bg-paper p-3 text-[13.5px] text-ink-2">{at("serviceAfterPay", l)}</p>
            </Card>
          ) : null}

          <Card title={at("billingFor", l)} action={<Btn href={accHref(l, "profile")} variant="ghost" size="sm">{at("editBilling", l)}</Btn>}>
            <p className="font-bold">{u.company || u.name}</p>
            <p className="text-[14px] text-ink-2">{[u.company ? u.name : null, u.phone, u.email].filter(Boolean).join(" · ")}</p>
            {(u.nationalId || u.economicCode) && <p className="text-[13.5px] text-ink-3">{[u.nationalId && `${at("nationalId", l)}: ${u.nationalId}`, u.economicCode && `${at("economicCode", l)}: ${u.economicCode}`].filter(Boolean).join(" · ")}</p>}
          </Card>

          <Card title={at("coupon", l)}>
            <form method="get" className="flex gap-2">
              {plan ? <input type="hidden" name="plan" value={plan.id} /> : <input type="hidden" name="service" value={service!.id} />}
              {renewSub && plan && <input type="hidden" name="renew" value={renewSub.id} />}
              <Input name="coupon" defaultValue={q.coupon} ltr className="flex-1 uppercase" aria-label={at("coupon", l)} />
              <button type="submit" className="h-12 rounded-xl border border-line-2 bg-white px-5 text-[14.5px] font-bold hover:border-ink-3">{at("apply", l)}</button>
            </form>
            {couponMsg && <p className={cn("mt-2 text-[13.5px] font-semibold", couponMsg.ok ? "text-teal-700" : "text-[#c8333a]")}>{couponMsg.text}</p>}
          </Card>
        </div>

        <Card className="xl:sticky xl:top-24 xl:self-start">
          {item.currency === "USD" && !noRate && (
            <p className="mb-4 rounded-xl bg-paper p-3 text-[13px] leading-6 text-ink-2">{fmtUsd(item.listPrice, l)} · {at("rate", l)}: <b>{fmtNum(settings.usdRate, l)} {l === "en" ? "Toman" : "تومان"}</b></p>
          )}
          <dl className="grid gap-2.5 text-[14.5px]">
            <div className="flex justify-between"><dt className="text-ink-2">{at("subtotal", l)}</dt><dd className="font-bold">{fmtToman(t.subtotal, l)}</dd></div>
            {t.discount > 0 && <div className="flex justify-between text-teal-700"><dt>{at("discount", l)}</dt><dd className="font-bold">− {fmtToman(t.discount, l)}</dd></div>}
            {settings.taxRate > 0 && <div className="flex justify-between"><dt className="text-ink-2">{at("tax", l)} ({pct(settings.taxRate)}{l === "en" ? "%" : "٪"})</dt><dd className="font-bold">{fmtToman(t.tax, l)}</dd></div>}
            <div className="flex justify-between border-t border-line pt-3 text-[18px] font-extrabold"><dt>{at("total", l)}</dt><dd>{t.total ? fmtToman(t.total, l) : at("free", l)}</dd></div>
          </dl>
          {noRate ? <p className="mt-5 rounded-xl bg-[#e5484d]/8 p-3 text-[14px] text-[#c8333a]">{at("rateMissing", l)}</p> : blocked ? <p className="mt-5 rounded-xl bg-[#e5484d]/8 p-3 text-[14px] text-[#c8333a]">{at("gatewayDown", l)}</p> : (
            <ActionForm action={checkoutAction} className="mt-5">
              <input type="hidden" name="locale" value={l} />
              {plan ? <input type="hidden" name="plan" value={plan.id} /> : <input type="hidden" name="service" value={service!.id} />}
              {renewSub && plan && <input type="hidden" name="renew" value={renewSub.id} />}
              {coupon && <input type="hidden" name="coupon" value={q.coupon} />}
              <Field label={`${at("orderNote", l)} (${at("optional", l)})`}><Textarea name="note" maxLength={2000} className="min-h-[80px]" /></Field>
              <label className="flex items-start gap-2.5 text-[13.5px] leading-6 text-ink-2">
                <input type="checkbox" name="agree" value="1" className="mt-1 size-4 shrink-0 accent-[var(--color-amber)]" />{at("agree", l)}
              </label>
              <Submit className="w-full">{at("placeOrder", l)}</Submit>
            </ActionForm>
          )}
        </Card>
      </div>
    </>
  );
}

function PriceTag({ price, currency, rate, l }: { price: number; currency: "IRR" | "USD"; rate: { usdRate: number; usdRounding: number }; l: Locale }) {
  if (!price) return <span className="mt-3 text-[22px] font-extrabold">{at("free", l)}</span>;
  if (currency === "IRR") return <span className="mt-3 text-[22px] font-extrabold">{fmtToman(price, l)}</span>;
  const rial = usdToRial(price, rate);
  return (
    <span className="mt-3 grid">
      <span className="text-[22px] font-extrabold">{rial ? fmtToman(rial, l) : fmtUsd(price, l)}</span>
      {rial && <span className="text-[12.5px] text-ink-3">{fmtUsd(price, l)}</span>}
    </span>
  );
}
