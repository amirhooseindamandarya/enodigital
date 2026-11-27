import "server-only";
import { headers } from "next/headers";
import { isLocale } from "@/cms/i18n";
import type { Locale } from "@/cms/types";

/** زبان صفحهٔ حساب (middleware آن را از پیشوند /en یا /ar تعیین می‌کند) */
export async function accLocale(): Promise<Locale> {
  const l = (await headers()).get("x-eno-locale");
  return isLocale(l) ? l : "fa";
}

/** مسیر صفحه‌ای از حساب کاربری در زبان مشخص */
export function accHref(l: Locale, path = "", query?: Record<string, string | number | undefined>) {
  const clean = path.replace(/^\/|\/$/g, "");
  const q = query ? Object.entries(query).filter(([, v]) => v !== undefined && v !== "").map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join("&") : "";
  return `${l === "fa" ? "" : `/${l}`}/account/${clean ? `${clean}/` : ""}${q ? `?${q}` : ""}`;
}

/** فقط مسیرهای داخلی حساب برای بازگشت پس از ورود (جلوگیری از open redirect) */
export function safeNext(next: string | null | undefined, l: Locale) {
  if (next && /^\/(?:(?:en|ar)\/)?account\/[\w\-/?=&%.]*$/.test(next)) return next;
  return accHref(l);
}
