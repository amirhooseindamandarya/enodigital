import Link from "next/link";
import { accHref, accLocale } from "@/account/context";
import { at } from "@/account/i18n";
import { lt } from "@/account/data";
import { Badge, Btn, Empty, PageTitle, Table, orderTone, td } from "@/account/ui";
import { requireUser } from "@/server/auth/guards";
import { orderNumber, userOrders } from "@/server/orders";
import { fmtDate, fmtToman } from "@/lib/money";

export async function generateMetadata() { return { title: at("orders", await accLocale()) }; }

export default async function Orders() {
  const l = await accLocale();
  const u = await requireUser(accHref(l, "login"), accHref(l, "orders"));
  const orders = await userOrders(u.id);
  return (
    <>
      <PageTitle title={at("orders", l)} />
      {orders.length === 0 ? <Empty action={<Btn href={accHref(l, "checkout")} size="sm">{at("pricing", l)}</Btn>}>{at("noOrders", l)}</Empty> : (
        <Table head={[at("order", l), at("item", l), at("date", l), at("total", l), at("status", l)]}>
          {orders.map((o) => (
            <tr key={o.id} className="hover:bg-paper/60">
              <td className={td}><Link href={accHref(l, `orders/${o.id}`)} className="font-bold underline-offset-4 hover:underline" dir="ltr">{orderNumber(o.id)}</Link></td>
              <td className={td}>{lt(o.items[0]?.title, l)}</td>
              <td className={td}>{fmtDate(o.createdAt, l)}</td>
              <td className={`${td} font-bold`}>{fmtToman(o.total, l)}</td>
              <td className={td}><Badge tone={orderTone[o.status]}>{at(`st_${o.status}`, l)}</Badge></td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}
