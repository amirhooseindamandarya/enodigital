import Link from "next/link";
import { notFound } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { ActionForm, Submit } from "@/account/form";
import { Badge, Card, Field, PageTitle, Select, Textarea, orderTone, payTone, subTone } from "@/account/ui";
import { orderStatusAction } from "@/admin/actions";
import { fa, orderStatusFa, payStatusFa, periodFa, subStatusFa, nFa } from "@/admin/util";
import { requireStaff } from "@/server/auth/guards";
import { db, schema } from "@/server/db";
import { orderNumber } from "@/server/orders";
import { fmtDate, fmtToman } from "@/lib/money";

export const metadata = { title: "جزئیات سفارش" };

export default async function AdminOrder({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff();
  const id = Number((await params).id);
  const o = await db.query.orders.findFirst({ where: eq(schema.orders.id, id), with: { items: true, payments: { orderBy: desc(schema.payments.id) }, user: true } });
  if (!o) notFound();
  const subs = await db.query.subscriptions.findMany({ where: eq(schema.subscriptions.lastOrderId, id), with: { product: true } });
  return (
    <>
      <PageTitle title={`سفارش ${orderNumber(o.id)}`} lead={`ثبت: ${fmtDate(o.createdAt, "fa", true)}${o.paidAt ? ` · پرداخت: ${fmtDate(o.paidAt, "fa", true)}` : ""}`} action={<Badge tone={orderTone[o.status]}>{orderStatusFa[o.status]}</Badge>} />
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="grid content-start gap-6">
          <Card title="اقلام">
            <ul className="divide-y divide-line">
              {o.items.map((it) => (
                <li key={it.id} className="flex justify-between gap-4 py-3">
                  <span><b>{fa(it.title)}</b><span className="block text-[13px] text-ink-3">{periodFa[it.period]} · {nFa(it.durationDays)} روز{it.renewSubscriptionId ? ` · تمدید اشتراک #${it.renewSubscriptionId}` : ""}</span></span>
                  <b>{fmtToman(it.unitPrice * it.quantity)}</b>
                </li>
              ))}
            </ul>
            <dl className="mt-3 grid gap-2 border-t border-line pt-4 text-[14px]">
              <div className="flex justify-between"><dt>جمع</dt><dd>{fmtToman(o.subtotal)}</dd></div>
              {o.discount > 0 && <div className="flex justify-between text-teal-700"><dt>تخفیف ({o.couponCode})</dt><dd>− {fmtToman(o.discount)}</dd></div>}
              {o.taxRate > 0 && <div className="flex justify-between"><dt>مالیات ({nFa(o.taxRate)}٪)</dt><dd>{fmtToman(o.tax)}</dd></div>}
              <div className="flex justify-between text-[16px] font-extrabold"><dt>مبلغ کل</dt><dd>{fmtToman(o.total)}</dd></div>
            </dl>
            {o.customerNote && <p className="mt-4 rounded-xl bg-paper p-3 text-[14px]"><b className="block text-[12.5px] text-ink-3">توضیح مشتری</b>{o.customerNote}</p>}
          </Card>
          <Card title="تراکنش‌ها">
            {o.payments.length === 0 ? <p className="text-[14px] text-ink-3">تراکنشی ثبت نشده است.</p> : (
              <ul className="grid gap-2 text-[13.5px]">
                {o.payments.map((p) => (
                  <li key={p.id} className="grid gap-1 rounded-xl bg-paper p-3 sm:grid-cols-[1fr_auto]">
                    <span>{p.gateway} · {fmtToman(p.amount)} · {fmtDate(p.createdAt, "fa", true)}{p.refId && <> · پیگیری: <b dir="ltr">{p.refId}</b></>}{p.cardPan && <> · کارت: <span dir="ltr">{p.cardPan}</span></>}{p.message && <span className="block text-ink-3">{p.message}</span>}</span>
                    <Badge tone={payTone[p.status]}>{payStatusFa[p.status]}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          {subs.length > 0 && (
            <Card title="اشتراک‌های ایجادشده / تمدیدشده">
              <ul className="grid gap-2 text-[14px]">{subs.map((s) => <li key={s.id}><Link href={`/admin/subscriptions/${s.id}/`} className="flex justify-between rounded-xl bg-paper p-3 hover:opacity-80"><span>#{s.id} · {fa(s.product.name)} · تا {fmtDate(s.endsAt)}</span><Badge tone={subTone[s.status]}>{subStatusFa[s.status]}</Badge></Link></li>)}</ul>
            </Card>
          )}
        </div>
        <div className="grid content-start gap-6">
          <Card title="خریدار">
            <p className="font-bold"><Link href={`/admin/customers/${o.userId}/`} className="hover:underline">{o.buyer.name}</Link></p>
            <div className="mt-1 grid gap-0.5 text-[14px] text-ink-2">
              <span dir="ltr" className="text-end">{o.buyer.phone}</span>
              {o.buyer.email && <span dir="ltr" className="text-end">{o.buyer.email}</span>}
              {o.buyer.company && <span>شرکت: {o.buyer.company}</span>}
              {o.buyer.nationalId && <span>شناسه ملی: {o.buyer.nationalId}</span>}
              {o.buyer.economicCode && <span>کد اقتصادی: {o.buyer.economicCode}</span>}
              {o.buyer.address && <span>{o.buyer.address} {o.buyer.postalCode}</span>}
            </div>
          </Card>
          <Card title="مدیریت سفارش">
            <ActionForm action={orderStatusAction}>
              <input type="hidden" name="id" value={o.id} />
              <Field label="وضعیت" hint={!o.paidAt ? "انتخاب «پرداخت‌شده» یعنی تأیید پرداخت دستی؛ اشتراک فعال یا تمدید می‌شود." : "پس از راه‌اندازی دسترسی مشتری، سفارش را «تکمیل‌شده» کنید."}>
                <Select name="status" defaultValue={o.status}>{Object.entries(orderStatusFa).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</Select>
              </Field>
              <Field label="یادداشت داخلی (برای مشتری نمایش داده نمی‌شود)"><Textarea name="adminNote" defaultValue={o.adminNote ?? ""} className="min-h-[90px]" /></Field>
              <Submit>ذخیره</Submit>
            </ActionForm>
          </Card>
        </div>
      </div>
    </>
  );
}
