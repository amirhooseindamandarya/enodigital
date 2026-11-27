import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { accHref, accLocale } from "@/account/context";
import { at } from "@/account/i18n";
import { Badge, Btn, Empty, PageTitle, Table, td, ticketTone } from "@/account/ui";
import { requireUser } from "@/server/auth/guards";
import { db, schema } from "@/server/db";
import { fmtDate } from "@/lib/money";

export async function generateMetadata() { return { title: at("tickets", await accLocale()) }; }

export default async function Tickets() {
  const l = await accLocale();
  const u = await requireUser(accHref(l, "login"), accHref(l, "tickets"));
  const rows = await db.query.tickets.findMany({ where: eq(schema.tickets.userId, u.id), orderBy: desc(schema.tickets.updatedAt) });
  return (
    <>
      <PageTitle title={at("tickets", l)} action={<Btn href={accHref(l, "tickets/new")}>{at("newTicket", l)}</Btn>} />
      {rows.length === 0 ? <Empty>{at("noTickets", l)}</Empty> : (
        <Table head={["#", at("subject", l), at("priority", l), at("date", l), at("status", l)]}>
          {rows.map((t) => (
            <tr key={t.id} className="hover:bg-paper/60">
              <td className={td}>{t.id}</td>
              <td className={td}><Link href={accHref(l, `tickets/${t.id}`)} className="font-bold hover:underline">{t.subject}</Link></td>
              <td className={td}>{at(`pr_${t.priority}`, l)}</td>
              <td className={td}>{fmtDate(t.updatedAt, l, true)}</td>
              <td className={td}><Badge tone={ticketTone[t.status]}>{at(`tst_${t.status}`, l)}</Badge></td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}
