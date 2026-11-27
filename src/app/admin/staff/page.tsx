import { desc, ne } from "drizzle-orm";
import { ActionForm, Submit } from "@/account/form";
import { Card, Field, Input, PageTitle, Select, Table, td } from "@/account/ui";
import { saveStaffAction } from "@/admin/actions";
import { roleFa } from "@/admin/util";
import { requireStaff } from "@/server/auth/guards";
import { db, schema } from "@/server/db";
import { fmtDate } from "@/lib/money";

export const metadata = { title: "کارکنان" };

export default async function Staff() {
  const me = await requireStaff(true);
  const rows = await db.query.users.findMany({ where: ne(schema.users.role, "customer"), orderBy: desc(schema.users.id) });
  return (
    <>
      <PageTitle title="کارکنان" lead="کارشناس: سفارش‌ها، اشتراک‌ها، مشتریان و پشتیبانی. مدیر کل: همه‌چیز، از جمله محصولات، تخفیف‌ها و تنظیمات." />
      <Table head={["نام", "موبایل", "آخرین ورود", "نقش"]}>
        {rows.map((u) => (
          <tr key={u.id}>
            <td className={td}>{u.name}{u.id === me.id && <span className="text-ink-3"> (شما)</span>}</td>
            <td className={td} dir="ltr">{u.phone}</td>
            <td className={td}>{fmtDate(u.lastLoginAt, "fa", true)}</td>
            <td className={td}>
              <ActionForm action={saveStaffAction} className="flex-row! items-center gap-2">
                <input type="hidden" name="id" value={u.id} />
                <select name="role" defaultValue={u.role} className="h-10 rounded-xl border border-line-2 bg-white px-3 text-[14px]">{Object.entries(roleFa).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
                <Submit variant="outline" className="h-10!">ذخیره</Submit>
              </ActionForm>
            </td>
          </tr>
        ))}
      </Table>
      <Card title="افزودن کارمند" className="mt-6 max-w-3xl">
        <ActionForm action={saveStaffAction}>
          <p className="-mt-2 text-[13.5px] text-ink-3">اگر این شماره قبلاً حساب دارد، فقط نقشش تغییر می‌کند.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="نام"><Input name="name" /></Field>
            <Field label="موبایل"><Input name="phone" ltr required /></Field>
            <Field label="رمز عبور (برای حساب جدید)"><Input name="password" type="text" autoComplete="new-password" ltr /></Field>
            <Field label="نقش"><Select name="role" defaultValue="staff"><option value="staff">کارشناس</option><option value="admin">مدیر کل</option></Select></Field>
          </div>
          <div><Submit>افزودن</Submit></div>
        </ActionForm>
      </Card>
    </>
  );
}
