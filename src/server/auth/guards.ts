import "server-only";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./session";

/** فقط مشتری واردشده؛ وگرنه به صفحهٔ ورود با بازگشت به همین صفحه */
export async function requireUser(loginPath: string, next?: string) {
  const u = await getCurrentUser();
  if (!u) redirect(`${loginPath}${next ? `?next=${encodeURIComponent(next)}` : ""}`);
  return u;
}

/** کارکنان و مدیران (adminOnly: فقط مدیر کل) */
export async function requireStaff(adminOnly = false) {
  const u = await getCurrentUser();
  if (!u) redirect("/admin/login/");
  if (u.role === "customer") redirect("/admin/login/?denied=1");
  if (adminOnly && u.role !== "admin") redirect("/admin/?denied=1");
  return u;
}
