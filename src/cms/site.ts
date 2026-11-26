/**
 * منبع دادهٔ سایت.
 * فعلاً دادهٔ محلی (src/site-content) است؛ پس از دریافت مستند API لیموسی،
 * همین تابع داده را در زمان build از API می‌گیرد و بقیهٔ سایت تغییری نمی‌کند.
 */
import type { SiteData } from "./types";
import { localSite } from "@/site-content";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://amirhooseindamandarya.github.io/enodigital").replace(/\/$/, "");

let cache: SiteData | null = null;
export async function getSite(): Promise<SiteData> {
  if (!cache) cache = localSite;
  return cache;
}
