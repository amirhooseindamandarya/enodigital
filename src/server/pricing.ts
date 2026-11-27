import "server-only";
import { usdToRial } from "@/lib/money";
import type { Currency } from "./db/schema";
import type { StoreSettings } from "./settings";

/**
 * تبدیل قیمت کالا به ریال (مبلغ قابل پرداخت).
 *  IRR: قیمت همان ریال است.
 *  USD: قیمت به سنت است؛ با نرخ دلار (تومان) تبدیل و به بالا گرد می‌شود (usdRounding تومان).
 * اگر نرخ دلار تعیین نشده باشد null برمی‌گرداند.
 */
export function toRial(price: number, currency: Currency, s: Pick<StoreSettings, "usdRate" | "usdRounding">): number | null {
  return currency === "IRR" ? price : usdToRial(price, s);
}

/** قیمت برای API عمومی سایت: مبلغ ریالی + قیمت دلاری اصلی */
export function publicPrice(price: number, currency: Currency, s: Pick<StoreSettings, "usdRate" | "usdRounding">) {
  return { price: toRial(price, currency, s), usd: currency === "USD" ? price / 100 : null };
}
