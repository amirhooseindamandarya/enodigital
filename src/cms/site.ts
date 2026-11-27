/**
 * منبع دادهٔ سایت.
 * فعلاً دادهٔ محلی (src/site-content) است؛ پس از دریافت مستند API لیموسی،
 * همین تابع داده را در زمان build از API می‌گیرد و بقیهٔ سایت تغییری نمی‌کند.
 */
import type { SiteData } from "./types";
import { localSite } from "@/site-content";

/** آدرس عمومی سایت؛ در زمان اجرا از APP_URL خوانده می‌شود (یک خروجی برای هر دامنه) */
export const SITE_URL = (process.env.APP_URL || process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");

let cache: SiteData | null = null;
export async function getSite(): Promise<SiteData> {
  if (!cache) cache = localSite;
  return cache;
}
