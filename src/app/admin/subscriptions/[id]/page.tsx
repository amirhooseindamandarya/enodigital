import Link from "next/link";
import { notFound } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { ActionForm, Submit } from "@/account/form";
import { Badge, Card, Field, Input, PageTitle, Select, Textarea, orderTone, subTone } from "@/account/ui";
import { saveSubscriptionAction } from "@/admin/actions";
import { dateInput, fa, nFa, orderStatusFa, subStatusFa } from "@/admin/util";
import { requireStaff } from "@/server/auth/guards";
import { db, schema } from "@/server/db";
import { effectiveSubStatus, orderNumber } from "@/server/orders";
import { daysLeft, fmtDate, fmtToman } from "@/lib/money";

export const metadata = { title: "اشتراک" };

export default async function AdminSub({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff();
  const id = Number((await params).id);
  const s = await db.query.subscriptions.findFirst({ where: eq(schema.subscriptions.id, id), with: { user: true, product: true, plan: true } });
  if (!s) notFound();
  const st = effectiveSubStatus(s);
  const items = await db.query.orderItems.findMany({ where: eq(schema.orderItems.renewSubscriptionId, id), with: { order: true }, orderBy: desc(schema.orderItems.id) });
  const origin = s.lastOrderId ? await db.query.orders.findFirst({ where: eq(schema.orders.id, s.lastOrderId) }) : null;
  const history = [...(origin ? [origin] : []), ...items.map((i) => i.order)].filter((o, i, a) => a.findIndex((x) => x.id === o.id) === i);
  return (
    <>
      <PageTitle title={`اشتراک #${s.id} · ${fa(s.product.name)}`} lead={`${s.user.name} · ${fa(s.plan.name)}`} action={<Badge tone={subTone[st]}>{subStatusFa[st]}</Badge>} />
      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <Card title="ویرایش اشتراک">
          <ActionForm action={saveSubscriptionAction}>
            <input type="hidden" name="id" value={s.id} />
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="وضعیت"><Select name="status" defaultValue={s.status}>{Object.entries(subStatusFa).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</Select></Field>
              <Field label="شروع" hint={fmtDate(s.startsAt)}><Input type="date" name="startsAt" defaultValue={dateInput(s.startsAt)} ltr /></Field>
              <Field label="پایان" hint={s.endsAt ? `${fmtDate(s.endsAt)} · ${nFa(daysLeft(s.endsAt))} روز` : "بدون پایان"}><Input type="date" name="endsAt" defaultValue={dateInput(s.endsAt)} ltr /></Field>
            </div>
            <Field label="تمدید دستی (روز)" hint="مثلاً ۳۰؛ از تاریخ پایان فعلی (یا امروز اگر گذشته باشد) اضافه می‌شود."><Input name="extendDays" inputMode="numeric" ltr className="sm:w-40" /></Field>
            <Field label="آدرس ورود به سرویس" hint="برای مشتری در پروفایلش نمایش داده می‌شود؛ مثل آدرس فضای کاری لیموسی."><Input name="accessUrl" defaultValue={s.accessUrl ?? ""} ltr placeholder="https://" /></Field>
            <Field label="توضیحات دسترسی برای مشتری" hint="نام کاربری، راهنمای ورود و…"><Textarea name="accessNote" defaultValue={s.accessNote ?? ""} /></Field>
            <Submit>ذخیره</Submit>
          </ActionForm>
        </Card>
        <div className="grid content-start gap-6">
          <Card title="مشتری">
            <Link href={`/admin/customers/${s.userId}/`} className="font-bold hover:underline">{s.user.name}</Link>
            <p className="text-[14px] text-ink-2" dir="ltr">{s.user.phone}</p>
            {s.user.company && <p className="text-[14px] text-ink-2">{s.user.company}</p>}
          </Card>
          <Card title="سفارش‌های مرتبط">
            {history.length === 0 ? <p className="text-[14px] text-ink-3">—</p> : (
              <ul className="grid gap-2 text-[14px]">{history.map((o) => <li key={o.id}><Link href={`/admin/orders/${o.id}/`} className="flex items-center justify-between rounded-xl bg-paper p-3 hover:opacity-80"><span dir="ltr">{orderNumber(o.id)}</span><span className="flex items-center gap-2">{fmtToman(o.total)}<Badge tone={orderTone[o.status]}>{orderStatusFa[o.status]}</Badge></span></Link></li>)}</ul>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
