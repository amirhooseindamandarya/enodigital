/** مبالغ در پایگاه داده «ریال»اند؛ برای نمایش «تومان» استفاده می‌شود */
import type { Locale } from "@/cms/types";

const NUM: Record<Locale, string> = { fa: "fa-IR", en: "en-US", ar: "ar-u-nu-latn" };
const UNIT: Record<Locale, string> = { fa: "تومان", en: "Toman", ar: "تومان" };

export const toToman = (rial: number) => Math.round(rial / 10);
export const fmtNum = (n: number, l: Locale = "fa") => n.toLocaleString(NUM[l]);
export const fmtToman = (rial: number, l: Locale = "fa") => `${fmtNum(toToman(rial), l)} ${UNIT[l]}`;
export const tomanUnit = (l: Locale = "fa") => UNIT[l];

export function fmtDate(d: Date | string | null | undefined, l: Locale = "fa", withTime = false) {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  const loc = l === "fa" ? "fa-IR-u-ca-persian" : l === "ar" ? "ar-u-nu-latn" : "en-GB";
  return new Intl.DateTimeFormat(loc, {
    year: "numeric", month: "short", day: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    timeZone: "Asia/Tehran",
  }).format(date);
}

export const daysLeft = (end: Date | string | null | undefined) => (end ? Math.ceil((new Date(end).getTime() - Date.now()) / 86400_000) : 0);
