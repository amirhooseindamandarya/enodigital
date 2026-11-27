import { notFound } from "next/navigation";
import { AlertCircle, CheckCircle2, FileText } from "lucide-react";
import { accHref, accLocale } from "@/account/context";
import { at } from "@/account/i18n";
import { lt, userOrder } from "@/account/data";
import { Submit } from "@/account/form";
import { Badge, Btn, Card, PageTitle, orderTone, payTone } from "@/account/ui";
import { cancelOrderAction, payOrderAction } from "@/account/actions";
import { requireUser } from "@/server/auth/guards";
import { orderNumber } from "@/server/orders";
import { gateway } from "@/server/payments";
import { getSettings } from "@/server/settings";
import { fmtDate, fmtNum, fmtToman, fmtUsd } from "@/lib/money";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  return { title: `${at("order", await accLocale())} ${orderNumber(Number((await params).id))}` };
}

export default async function OrderPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ pay?: string; manual?: string }> }) {
  const l = await accLocale();
  const { id } = await params;
  const q = await searchParams;
  const u = await requireUser(accHref(l, "login"), accHref(l, `orders/${id}`));
  const o = await userOrder(u.id, Number(id));
  if (!o) notFound();
  const settings = await getSettings();
  const canPay = (o.status === "pending" || o.status === "failed") && o.total > 0;
  const hasGateway = !!gateway();

  const alert =
    q.pay === "ok" ? { ok: true, text: at("payOk", l) }
    : q.pay === "failed" ? { ok: false, text: at("payFailed", l) }
    : q.pay === "cancelled" ? { ok: false, text: at("payCancelled", l) }
    : q.pay === "gateway" ? { ok: false, text: at("gatewayDown", l) }
    : null;

  return (
    <>
      <PageTitle title={`${at("order", l)} ${orderNumber(o.id)}`} lead={fmtDate(o.createdAt, l, true)}
        action={<div className="flex items-center gap-2"><Badge tone={orderTone[o.status]}>{at(`st_${o.status}`, l)}</Badge><Btn href={accHref(l, `orders/${o.id}/invoice`)} variant="outline" size="sm"><FileText className="size-4" aria-hidden />{o.paidAt ? at("invoice", l) : at("proforma", l)}</Btn></div>} />

      {alert && (
        <p role="status" className={cn("mb-5 flex items-start gap-2 rounded-2xl p-4 text-[14.5px] leading-7", alert.ok ? "bg-teal/10 text-teal-700" : "bg-[#e5484d]/8 text-[#c8333a]")}>
          {alert.ok ? <CheckCircle2 className="mt-1 size-5 shrink-0" aria-hidden /> : <AlertCircle className="mt-1 size-5 shrink-0" aria-hidden />}{alert.text}
        </p>
      )}
      {canPay && !hasGateway && settings.allowManualPayment && (
        <div className="mb-5 rounded-2xl border border-amber/30 bg-amber/10 p-4 text-[14.5px] leading-7 text-ink">
          <p className="font-extrabold text-amber-ink">{at("manualTitle", l)}</p>
          {settings.manualPaymentNote && <p className="mt-1 whitespace-pre-line">{settings.manualPaymentNote}</p>}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card title={at("item", l)}>
          <ul className="divide-y divide-line">
            {o.items.map((it) => (
              <li key={it.id} className="flex items-start justify-between gap-4 py-3">
                <span>
                  <span className="block font-bold">{lt(it.title, l)}</span>
                  <span className="text-[13px] text-ink-3">{it.serviceId ? at("services", l) : <>{at(`per_${it.period}`, l)} · {it.durationDays.toLocaleString(l === "fa" ? "fa-IR" : "en-US")} {at("days", l)}</>}{it.renewSubscriptionId ? ` · ${at("renew", l)}` : ""}</span>
                  {it.currency === "USD" && it.exchangeRate && <span className="block text-[12.5px] text-ink-3">{fmtUsd(it.listPrice, l)} × {fmtNum(it.exchangeRate, l)} {l === "en" ? "Toman" : "تومان"}</span>}
                </span>
                <span className="shrink-0 font-bold">{fmtToman(it.unitPrice * it.quantity, l)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-3 grid gap-2 border-t border-line pt-4 text-[14.5px]">
            <Row k={at("subtotal", l)} v={fmtToman(o.subtotal, l)} />
            {o.discount > 0 && <Row k={`${at("discount", l)}${o.couponCode ? ` (${o.couponCode})` : ""}`} v={`− ${fmtToman(o.discount, l)}`} cls="text-teal-700" />}
            {o.taxRate > 0 && <Row k={`${at("tax", l)} (${o.taxRate.toLocaleString(l === "fa" ? "fa-IR" : "en-US")}٪)`.replace("٪", l === "en" ? "%" : "٪")} v={fmtToman(o.tax, l)} />}
            <Row k={at("total", l)} v={fmtToman(o.total, l)} cls="text-[17px] font-extrabold" />
          </dl>
          {canPay && (
            <div className="mt-5 flex flex-wrap gap-2">
              {hasGateway && (
                <form action={payOrderAction}>
                  <input type="hidden" name="locale" value={l} /><input type="hidden" name="order" value={o.id} />
                  <Submit>{o.status === "failed" || q.pay ? at("payAgain", l) : at("pay", l)}</Submit>
                </form>
              )}
              {o.status === "pending" && (
                <form action={cancelOrderAction}>
                  <input type="hidden" name="locale" value={l} /><input type="hidden" name="order" value={o.id} />
                  <Submit variant="danger" confirm={at("cancelConfirm", l)}>{at("cancelOrder", l)}</Submit>
                </form>
              )}
            </div>
          )}
        </Card>

        <div className="grid content-start gap-6">
          <Card title={at("billingFor", l)}>
            <dl className="grid gap-1.5 text-[14px]">
              <p className="font-bold">{o.buyer.company || o.buyer.name}</p>
              {o.buyer.company && <p className="text-ink-2">{o.buyer.name}</p>}
              <p className="text-ink-2" dir="ltr">{o.buyer.phone}</p>
              {o.buyer.nationalId && <p className="text-ink-2">{at("nationalId", l)}: {o.buyer.nationalId}</p>}
              {o.buyer.economicCode && <p className="text-ink-2">{at("economicCode", l)}: {o.buyer.economicCode}</p>}
            </dl>
          </Card>
          <Card title={at("payments", l)}>
            {o.payments.length === 0 ? <p className="text-[14px] text-ink-3">{at("noPayments", l)}</p> : (
              <ul className="grid gap-3 text-[13.5px]">
                {o.payments.map((p) => (
                  <li key={p.id} className="rounded-xl bg-paper p-3">
                    <div className="flex items-center justify-between gap-2"><span className="font-bold">{fmtToman(p.amount, l)}</span><Badge tone={payTone[p.status]}>{p.status === "initiated" ? at("pst_initiated", l) : at(p.status === "paid" ? "st_paid" : p.status === "failed" ? "st_failed" : "st_cancelled", l)}</Badge></div>
                    <p className="mt-1 text-ink-3">{fmtDate(p.createdAt, l, true)}</p>
                    {p.refId && <p className="text-ink-2">{at("refId", l)}: <span dir="ltr">{p.refId}</span></p>}
                    {p.cardPan && <p className="text-ink-2">{at("card", l)}: <span dir="ltr">{p.cardPan}</span></p>}
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Btn href={accHref(l, "tickets/new", { order: o.id })} variant="outline">{at("newTicket", l)}</Btn>
        </div>
      </div>
    </>
  );
}

function Row({ k, v, cls }: { k: string; v: string; cls?: string }) {
  return <div className={cn("flex items-center justify-between gap-4", cls)}><dt className="text-ink-2">{k}</dt><dd className="font-bold">{v}</dd></div>;
}
