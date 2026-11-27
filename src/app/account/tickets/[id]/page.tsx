import { notFound } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import { accHref, accLocale } from "@/account/context";
import { at } from "@/account/i18n";
import { ActionForm, Submit } from "@/account/form";
import { Badge, Btn, Card, PageTitle, Textarea, ticketTone } from "@/account/ui";
import { closeTicketAction, replyTicketAction } from "@/account/actions";
import { requireUser } from "@/server/auth/guards";
import { db, schema } from "@/server/db";
import { orderNumber } from "@/server/orders";
import { fmtDate } from "@/lib/money";
import { cn } from "@/lib/utils";

export async function generateMetadata() { return { title: at("tickets", await accLocale()) }; }

export default async function TicketPage({ params }: { params: Promise<{ id: string }> }) {
  const l = await accLocale();
  const { id } = await params;
  const u = await requireUser(accHref(l, "login"), accHref(l, `tickets/${id}`));
  const t = await db.query.tickets.findFirst({ where: and(eq(schema.tickets.id, Number(id)), eq(schema.tickets.userId, u.id)), with: { messages: { orderBy: asc(schema.ticketMessages.id) } } });
  if (!t) notFound();
  return (
    <>
      <PageTitle title={t.subject} lead={`#${t.id} · ${at("priority", l)}: ${at(`pr_${t.priority}`, l)}${t.orderId ? ` · ${orderNumber(t.orderId)}` : ""}`}
        action={<div className="flex items-center gap-2"><Badge tone={ticketTone[t.status]}>{at(`tst_${t.status}`, l)}</Badge>{t.orderId && <Btn href={accHref(l, `orders/${t.orderId}`)} variant="ghost" size="sm">{at("relatedOrder", l)}</Btn>}</div>} />
      <ol className="grid gap-3">
        {t.messages.map((m) => (
          <li key={m.id} className={cn("max-w-[85%] rounded-2xl border p-4", m.isStaff ? "justify-self-end border-teal/20 bg-teal/5" : "justify-self-start border-line bg-white")}>
            <p className="mb-1.5 text-[12.5px] font-bold text-ink-3">{m.isStaff ? at("support", l) : at("you", l)} · {fmtDate(m.createdAt, l, true)}</p>
            <p className="whitespace-pre-line text-[15px] leading-7">{m.body}</p>
          </li>
        ))}
      </ol>
      {t.status === "closed" ? <p className="mt-6 rounded-2xl bg-white p-4 text-[14px] text-ink-3">{at("ticketClosed", l)}</p> : (
        <Card className="mt-6">
          <ActionForm action={replyTicketAction} resetOnOk>
            <input type="hidden" name="locale" value={l} /><input type="hidden" name="ticket" value={t.id} />
            <Textarea name="body" required maxLength={5000} aria-label={at("reply", l)} placeholder={at("reply", l)} />
            <div><Submit>{at("send", l)}</Submit></div>
          </ActionForm>
          <form action={closeTicketAction} className="mt-3">
            <input type="hidden" name="locale" value={l} /><input type="hidden" name="ticket" value={t.id} />
            <button type="submit" className="text-[13.5px] font-semibold text-ink-3 hover:text-ink">{at("tst_closed", l)} ✓</button>
          </form>
        </Card>
      )}
    </>
  );
}
