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

/** قیمت دلاری (سنت) */
export const fmtUsd = (cents: number, l: Locale = "fa") =>
  `$${(cents / 100).toLocaleString(l === "fa" ? "fa-IR" : "en-US", { maximumFractionDigits: 2 })}`;

/** همان محاسبهٔ سرور (src/server/pricing.ts) برای نمایش */
export function usdToRial(cents: number, rate: { usdRate: number; usdRounding: number }) {
  if (!rate.usdRate) return null;
  const step = Math.max(1, Math.round(rate.usdRounding || 1));
  return Math.ceil(((cents / 100) * rate.usdRate) / step) * step * 10;
}
