import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { ActionForm, Submit } from "@/account/form";
import { Badge, Card, Field, PageTitle, Select, Textarea, ticketTone } from "@/account/ui";
import { staffReplyAction } from "@/admin/actions";
import { priorityFa, ticketStatusFa } from "@/admin/util";
import { requireStaff } from "@/server/auth/guards";
import { db, schema } from "@/server/db";
import { orderNumber } from "@/server/orders";
import { fmtDate } from "@/lib/money";
import { cn } from "@/lib/utils";

export const metadata = { title: "درخواست پشتیبانی" };

export default async function AdminTicket({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff();
  const id = Number((await params).id);
  const t = await db.query.tickets.findFirst({ where: eq(schema.tickets.id, id), with: { user: true, messages: { orderBy: asc(schema.ticketMessages.id), with: { author: true } } } });
  if (!t) notFound();
  return (
    <>
      <PageTitle title={t.subject} lead={`#${t.id} · ${t.user.name} · اولویت ${priorityFa[t.priority]}`}
        action={<div className="flex items-center gap-2"><Badge tone={ticketTone[t.status]}>{ticketStatusFa[t.status]}</Badge>{t.orderId && <Link href={`/admin/orders/${t.orderId}/`} className="text-[14px] font-bold text-ink-2 hover:text-ink" dir="ltr">{orderNumber(t.orderId)}</Link>}<Link href={`/admin/customers/${t.userId}/`} className="text-[14px] font-bold text-ink-2 hover:text-ink">پروفایل مشتری</Link></div>} />
      <ol className="grid gap-3">
        {t.messages.map((m) => (
          <li key={m.id} className={cn("max-w-[85%] rounded-2xl border p-4", m.isStaff ? "justify-self-end border-teal/20 bg-teal/5" : "justify-self-start border-line bg-white")}>
            <p className="mb-1.5 text-[12.5px] font-bold text-ink-3">{m.isStaff ? `پشتیبانی (${m.author?.name ?? "—"})` : t.user.name} · {fmtDate(m.createdAt, "fa", true)}</p>
            <p className="whitespace-pre-line text-[15px] leading-7">{m.body}</p>
          </li>
        ))}
      </ol>
      <Card className="mt-6">
        <ActionForm action={staffReplyAction} resetOnOk>
          <input type="hidden" name="ticket" value={t.id} />
          <Field label="پاسخ به مشتری"><Textarea name="body" maxLength={5000} /></Field>
          <div className="flex flex-wrap items-end gap-3">
            <Field label="وضعیت پس از ارسال" className="w-56"><Select name="status" defaultValue="answered">{Object.entries(ticketStatusFa).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</Select></Field>
            <Submit>ارسال / ذخیره</Submit>
          </div>
        </ActionForm>
      </Card>
    </>
  );
}
