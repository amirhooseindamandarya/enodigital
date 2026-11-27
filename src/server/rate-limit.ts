import "server-only";
import { headers } from "next/headers";

/** محدودیت ساده در حافظه (برای یک نمونهٔ سرور کافی است) */
const buckets = new Map<string, { n: number; reset: number }>();

export async function clientIp() {
  const h = await headers();
  return (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "local";
}

/** true یعنی سهمیه تمام شده است */
export async function limited(scope: string, max: number, windowMs: number, extraKey = "") {
  const key = [scope, await clientIp(), extraKey].join(":");
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.reset < now) {
    buckets.set(key, { n: 1, reset: now + windowMs });
    if (buckets.size > 20000) for (const [k, v] of buckets) if (v.reset < now) buckets.delete(k);
    return false;
  }
  b.n++;
  return b.n > max;
}
