import type { Metadata, Viewport } from "next";
import Link from "next/link";
import localFont from "next/font/local";
import { and, eq, inArray, sql } from "drizzle-orm";
import { Globe, LogOut } from "lucide-react";
import "../globals.css";
import { localeMeta, pathFor } from "@/cms/i18n";
import { LOCALES } from "@/cms/types";
import { accHref, accLocale } from "@/account/context";
import { at } from "@/account/i18n";
import { AccountNav } from "@/account/nav";
import { logoutAction } from "@/account/actions";
import { getCurrentUser } from "@/server/auth/session";
import { db, schema } from "@/server/db";
import { headers } from "next/headers";

const vazir = localFont({ src: "../../fonts/Vazirmatn-Variable.woff2", weight: "100 900", display: "swap", variable: "--font-vazir" });

export const metadata: Metadata = { robots: { index: false, follow: false }, icons: { icon: "/favicon.png" } };
export const viewport: Viewport = { themeColor: "#071c35", width: "device-width", initialScale: 1 };
export const dynamic = "force-dynamic";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const l = await accLocale();
  const meta = localeMeta[l];
  const user = await getCurrentUser();
  const path = (await headers()).get("x-eno-path") ?? "/account/";
  const rest = path.replace(/^\/(en|ar)/, "");

  let badges = { orders: 0, tickets: 0 };
  if (user) {
    const [o] = await db.select({ n: sql<number>`count(*)::int` }).from(schema.orders).where(and(eq(schema.orders.userId, user.id), eq(schema.orders.status, "pending")));
    const [t] = await db.select({ n: sql<number>`count(*)::int` }).from(schema.tickets).where(and(eq(schema.tickets.userId, user.id), inArray(schema.tickets.status, ["answered"])));
    badges = { orders: o?.n ?? 0, tickets: t?.n ?? 0 };
  }

  return (
    <html lang={meta.htmlLang} dir={meta.dir} className={vazir.variable}>
      <body className="min-h-dvh bg-paper">
        <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur-xl print:hidden">
          <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
            <Link href={pathFor(l)} className="flex items-center gap-2.5" dir="ltr">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/logo-mark.png" alt="" width={30} height={31} className="h-[30px] w-auto" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/logo-wordmark.webp" alt="ENODIGITAL" width={120} height={33} className="h-[17px] w-auto" />
            </Link>
            <div className="flex items-center gap-1">
              <details className="relative">
                <summary className="flex h-10 cursor-pointer list-none items-center gap-1.5 rounded-xl px-2.5 text-[13.5px] font-bold text-ink-2 hover:bg-paper [&::-webkit-details-marker]:hidden">
                  <Globe className="size-4" aria-hidden />{meta.name}
                </summary>
                <ul className="absolute end-0 top-[calc(100%+6px)] z-10 min-w-[140px] rounded-xl border border-line bg-white p-1 shadow-[var(--shadow-lift)]">
                  {LOCALES.map((x) => (
                    <li key={x}><a href={`${x === "fa" ? "" : `/${x}`}${rest}`} lang={x} className="block rounded-lg px-3 py-2 text-[14px] font-semibold text-ink-2 hover:bg-paper">{localeMeta[x].name}</a></li>
                  ))}
                </ul>
              </details>
              <Link href={pathFor(l)} className="hidden h-10 items-center rounded-xl px-3 text-[14px] font-bold text-ink-2 hover:bg-paper sm:inline-flex">{at("backToSite", l)}</Link>
              {user && (
                <form action={logoutAction}>
                  <input type="hidden" name="locale" value={l} />
                  <button type="submit" className="flex h-10 items-center gap-1.5 rounded-xl px-3 text-[14px] font-bold text-ink-2 hover:bg-paper">
                    <LogOut className="size-4 ltr:-scale-x-100" aria-hidden /><span className="hidden sm:inline">{at("logout", l)}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </header>
        {user ? (
          <div className="mx-auto grid max-w-[1200px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[230px_1fr] lg:py-10">
            <aside className="lg:sticky lg:top-24 lg:self-start print:hidden">
              <div className="mb-3 hidden rounded-2xl border border-line bg-white p-4 lg:block">
                <p className="truncate font-extrabold">{user.name}</p>
                <p className="mt-0.5 text-[13px] text-ink-3" dir="ltr">{user.phone}</p>
              </div>
              <AccountNav items={[
                { key: "dashboard", label: at("dashboard", l), href: accHref(l) },
                { key: "subscriptions", label: at("subscriptions", l), href: accHref(l, "subscriptions") },
                { key: "orders", label: at("orders", l), href: accHref(l, "orders"), badge: badges.orders },
                { key: "tickets", label: at("tickets", l), href: accHref(l, "tickets"), badge: badges.tickets },
                { key: "profile", label: at("profile", l), href: accHref(l, "profile") },
                { key: "security", label: at("security", l), href: accHref(l, "security") },
                { key: "pricing", label: at("pricing", l), href: accHref(l, "checkout") },
              ]} />
            </aside>
            <main id="main" className="min-w-0">{children}</main>
          </div>
        ) : (
          <main id="main" className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-[1200px] place-items-center px-4 py-10">{children}</main>
        )}
      </body>
    </html>
  );
}
