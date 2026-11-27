import { notFound } from "next/navigation";
import { accHref, accLocale } from "@/account/context";
import { at } from "@/account/i18n";
import { lt, userOrder } from "@/account/data";
import { PrintButton } from "@/account/print";
import { requireUser } from "@/server/auth/guards";
import { orderNumber } from "@/server/orders";
import { getSettings } from "@/server/settings";
import { fmtDate, fmtNum, toToman, tomanUnit } from "@/lib/money";

export async function generateMetadata() { return { title: at("invoice", await accLocale()) }; }

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const l = await accLocale();
  const { id } = await params;
  const u = await requireUser(accHref(l, "login"), accHref(l, `orders/${id}/invoice`));
  const o = await userOrder(u.id, Number(id));
  if (!o) notFound();
  const s = await getSettings();
  const paid = !!o.paidAt && o.status !== "cancelled" && o.status !== "refunded";
  const n = (rial: number) => fmtNum(toToman(rial), l);
  const cell = "border border-line-2 px-3 py-2";
  return (
    <div className="mx-auto max-w-[860px]">
      <div className="mb-4 flex justify-end gap-2 print:hidden"><PrintButton label={at("printInvoice", l)} /></div>
      <article className="rounded-2xl border border-line bg-white p-6 text-[13.5px] leading-7 print:border-0 print:p-0 sm:p-10">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-5">
          <div>
            <h1 className="text-[22px] font-extrabold">{paid ? at("salesInvoice", l) : at("proforma", l)}</h1>
            <p className="text-ink-3">{at("invoiceNo", l)}: <b dir="ltr" className="text-ink">{orderNumber(o.id)}</b></p>
          </div>
          <div className="text-end text-ink-2">
            <p>{at("date", l)}: {fmtDate(o.createdAt, l)}</p>
            {paid && <p>{at("paidAt", l)}: {fmtDate(o.paidAt, l)}</p>}
          </div>
        </header>
        <section className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-paper p-4">
            <p className="text-[12px] font-bold text-ink-3">{at("seller", l)}</p>
            <p className="font-bold">{s.seller.name}</p>
            {s.seller.nationalId && <p>{at("nationalId", l)}: {s.seller.nationalId}</p>}
            {s.seller.economicCode && <p>{at("economicCode", l)}: {s.seller.economicCode}</p>}
            {s.seller.address && <p>{s.seller.address}{s.seller.postalCode ? ` — ${s.seller.postalCode}` : ""}</p>}
            {s.seller.phone && <p dir="ltr" className="text-end">{s.seller.phone}</p>}
          </div>
          <div className="rounded-xl bg-paper p-4">
            <p className="text-[12px] font-bold text-ink-3">{at("buyer", l)}</p>
            <p className="font-bold">{o.buyer.company || o.buyer.name}</p>
            {o.buyer.company && <p>{o.buyer.name}</p>}
            {o.buyer.nationalId && <p>{at("nationalId", l)}: {o.buyer.nationalId}</p>}
            {o.buyer.economicCode && <p>{at("economicCode", l)}: {o.buyer.economicCode}</p>}
            {o.buyer.address && <p>{o.buyer.address}{o.buyer.postalCode ? ` — ${o.buyer.postalCode}` : ""}</p>}
            <p dir="ltr" className="text-end">{o.buyer.phone}</p>
          </div>
        </section>
        <table className="mt-6 w-full border-collapse text-start">
          <thead className="bg-paper text-[12.5px]">
            <tr><th className={cell}>#</th><th className={`${cell} text-start`}>{at("item", l)}</th><th className={cell}>{at("qty", l)}</th><th className={cell}>{at("unitPrice", l)} ({tomanUnit(l)})</th><th className={cell}>{at("subtotal", l)} ({tomanUnit(l)})</th></tr>
          </thead>
          <tbody>
            {o.items.map((it, i) => (
              <tr key={it.id}>
                <td className={`${cell} text-center`}>{fmtNum(i + 1, l)}</td>
                <td className={cell}>{lt(it.title, l)} — {at(`per_${it.period}`, l)}</td>
                <td className={`${cell} text-center`}>{fmtNum(it.quantity, l)}</td>
                <td className={`${cell} text-center`}>{n(it.unitPrice)}</td>
                <td className={`${cell} text-center`}>{n(it.unitPrice * it.quantity)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr><td colSpan={4} className={`${cell} text-end`}>{at("subtotal", l)}</td><td className={`${cell} text-center`}>{n(o.subtotal)}</td></tr>
            {o.discount > 0 && <tr><td colSpan={4} className={`${cell} text-end`}>{at("discount", l)}</td><td className={`${cell} text-center`}>{n(o.discount)}</td></tr>}
            {o.taxRate > 0 && <tr><td colSpan={4} className={`${cell} text-end`}>{at("tax", l)} ({fmtNum(o.taxRate, l)}%)</td><td className={`${cell} text-center`}>{n(o.tax)}</td></tr>}
            <tr className="bg-paper font-extrabold"><td colSpan={4} className={`${cell} text-end`}>{at("total", l)}</td><td className={`${cell} text-center`}>{n(o.total)}</td></tr>
          </tfoot>
        </table>
        {o.payments.filter((p) => p.status === "paid").map((p) => (
          <p key={p.id} className="mt-4 text-ink-2">{at("refId", l)}: <span dir="ltr">{p.refId}</span>{p.cardPan ? ` · ${at("card", l)}: ` : ""}{p.cardPan && <span dir="ltr">{p.cardPan}</span>}</p>
        ))}
      </article>
    </div>
  );
}
