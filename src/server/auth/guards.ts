import "server-only";
import { redirect } from "next/navigation";
import { count, eq } from "drizzle-orm";
import { db, schema } from "@/server/db";
import { getCurrentUser } from "./session";

/** آیا مدیر کلی در پایگاه داده هست؟ (تا وقتی نباشد، صفحهٔ راه‌اندازی /admin/setup باز است) */
export async function hasAdmin() {
  const [r] = await db.select({ c: count() }).from(schema.users).where(eq(schema.users.role, "admin"));
  return (r?.c ?? 0) > 0;
}

/** فقط مشتری واردشده؛ وگرنه به صفحهٔ ورود با بازگشت به همین صفحه */
export async function requireUser(loginPath: string, next?: string) {
  const u = await getCurrentUser();
  if (!u) redirect(`${loginPath}${next ? `?next=${encodeURIComponent(next)}` : ""}`);
  return u;
}

/** کارکنان و مدیران (adminOnly: فقط مدیر کل) */
export async function requireStaff(adminOnly = false) {
  const u = await getCurrentUser();
  if (!u) redirect((await hasAdmin()) ? "/admin/login/" : "/admin/setup/");
  if (u.role === "customer") redirect("/admin/login/?denied=1");
  if (adminOnly && u.role !== "admin") redirect("/admin/?denied=1");
  return u;
}
