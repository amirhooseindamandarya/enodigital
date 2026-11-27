import type { Metadata, Viewport } from "next";
import Link from "next/link";
import localFont from "next/font/local";
import { inArray, eq, sql, count } from "drizzle-orm";
import { ExternalLink, LogOut } from "lucide-react";
import "../globals.css";
import { AdminNav } from "@/admin/nav";
import { adminLogoutAction } from "@/admin/actions";
import { roleFa } from "@/admin/util";
import { getCurrentUser } from "@/server/auth/session";
import { db, schema } from "@/server/db";
import { dbProblem } from "@/server/db/health";

const vazir = localFont({ src: "../../fonts/Vazirmatn-Variable.woff2", weight: "100 900", display: "swap", variable: "--font-vazir" });

export const metadata: Metadata = { title: { default: "پنل مدیریت", template: "%s | پنل مدیریت" }, robots: { index: false, follow: false }, icons: { icon: "/favicon.png" } };
export const viewport: Viewport = { themeColor: "#071c35", width: "device-width", initialScale: 1 };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // به‌جای خطای ۵۰۰، علت مشکل پایگاه داده و راه‌حل را نشان بده
  const problem = await dbProblem();
  if (problem) {
    return (
      <html lang="fa" dir="rtl" className={vazir.variable}>
        <body className="min-h-dvh bg-paper">
          <main className="mx-auto grid min-h-dvh max-w-2xl place-items-center px-4 py-10">
            <div className="w-full rounded-3xl border border-line bg-white p-7 shadow-[var(--shadow-soft)]">
              <p className="text-[13px] font-bold text-[#c8333a]">پنل مدیریت به پایگاه داده دسترسی ندارد</p>
              <h1 className="mt-2 text-[22px] font-extrabold leading-9">{problem.title}</h1>
              <ol className="mt-5 grid list-decimal gap-2.5 ps-5 text-[15px] leading-7 text-ink-2">{problem.fix.map((f, i) => <li key={i}>{f}</li>)}</ol>
              <p className="mt-6 rounded-xl bg-paper px-4 py-3 text-[13px] text-ink-3">کد خطا: <code dir="ltr" className="font-bold text-ink">{problem.code}</code> · پس از رفع مشکل، صفحه را دوباره بارگذاری کنید.</p>
            </div>
          </main>
        </body>
      </html>
    );
  }
  const user = await getCurrentUser();
  const staff = user && user.role !== "customer" ? user : null;
  let badges = { orders: 0, tickets: 0 };
  if (staff) {
    const [o] = await db.select({ c: count() }).from(schema.orders).where(eq(schema.orders.status, "paid"));
    const [t] = await db.select({ c: count() }).from(schema.tickets).where(inArray(schema.tickets.status, ["open", "customer_reply"]));
    badges = { orders: o?.c ?? 0, tickets: t?.c ?? 0 };
  }
  return (
    <html lang="fa" dir="rtl" className={vazir.variable}>
      <body className="min-h-dvh bg-paper">
        {staff ? (
          <>
            <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur-xl print:hidden">
              <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-4 px-4 sm:px-6">
                <Link href="/admin/" className="flex items-center gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/media/logo-mark.png" alt="" width={28} height={29} className="h-7 w-auto" />
                  <span className="text-[16px] font-extrabold">پنل مدیریت</span>
                </Link>
                <div className="flex items-center gap-1">
                  <Link href="/" target="_blank" className="hidden h-10 items-center gap-1.5 rounded-xl px-3 text-[14px] font-bold text-ink-2 hover:bg-paper sm:inline-flex"><ExternalLink className="size-4" aria-hidden />سایت</Link>
                  <span className="hidden px-2 text-[13.5px] text-ink-3 md:inline">{staff.name} · {roleFa[staff.role]}</span>
                  <form action={adminLogoutAction}><button type="submit" className="flex h-10 items-center gap-1.5 rounded-xl px-3 text-[14px] font-bold text-ink-2 hover:bg-paper"><LogOut className="size-4" aria-hidden /><span className="hidden sm:inline">خروج</span></button></form>
                </div>
              </div>
            </header>
            <div className="mx-auto grid max-w-[1320px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[230px_1fr] lg:py-8">
              <aside className="lg:sticky lg:top-24 lg:self-start print:hidden"><AdminNav isAdmin={staff.role === "admin"} badges={badges} /></aside>
              <main className="min-w-0">{children}</main>
            </div>
          </>
        ) : (
          <main className="grid min-h-dvh place-items-center px-4 py-10">{children}</main>
        )}
      </body>
    </html>
  );
}
