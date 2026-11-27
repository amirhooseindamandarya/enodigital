import { PageTitle } from "@/account/ui";
import { CustomerForm } from "@/admin/customer-form";
import { requireStaff } from "@/server/auth/guards";

export const metadata = { title: "مشتری جدید" };

export default async function NewCustomer() {
  await requireStaff();
  return (<><PageTitle title="مشتری جدید" lead="برای مشتری‌ای که تلفنی یا حضوری خرید کرده است." /><div className="max-w-3xl"><CustomerForm /></div></>);
}
