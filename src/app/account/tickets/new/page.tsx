import { desc, eq } from "drizzle-orm";
import { accHref, accLocale } from "@/account/context";
import { at } from "@/account/i18n";
import { ActionForm, Submit } from "@/account/form";
import { Card, Field, Input, PageTitle, Select, Textarea } from "@/account/ui";
import { newTicketAction } from "@/account/actions";
import { requireUser } from "@/server/auth/guards";
import { db, schema } from "@/server/db";
import { orderNumber } from "@/server/orders";

export async function generateMetadata() { return { title: at("newTicket", await accLocale()) }; }

export default async function NewTicket({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const l = await accLocale();
  const { order } = await searchParams;
  const u = await requireUser(accHref(l, "login"), accHref(l, "tickets/new"));
  const orders = await db.query.orders.findMany({ where: eq(schema.orders.userId, u.id), orderBy: desc(schema.orders.id), limit: 30 });
  return (
    <>
      <PageTitle title={at("newTicket", l)} />
      <Card className="max-w-2xl">
        <ActionForm action={newTicketAction}>
          <input type="hidden" name="locale" value={l} />
          <Field label={at("subject", l)}><Input name="subject" required maxLength={200} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={at("priority", l)}>
              <Select name="priority" defaultValue="normal">{(["low", "normal", "high"] as const).map((p) => <option key={p} value={p}>{at(`pr_${p}`, l)}</option>)}</Select>
            </Field>
            <Field label={at("relatedOrder", l)}>
              <Select name="order" defaultValue={order ?? ""}><option value="">{at("none", l)}</option>{orders.map((o) => <option key={o.id} value={o.id}>{orderNumber(o.id)}</option>)}</Select>
            </Field>
          </div>
          <Field label={at("message", l)}><Textarea name="body" required maxLength={5000} className="min-h-[180px]" /></Field>
          <Submit className="w-full sm:w-auto">{at("send", l)}</Submit>
        </ActionForm>
      </Card>
    </>
  );
}
