import { NextResponse, type NextRequest } from "next/server";
import { activeCatalog } from "@/server/orders";
import { publicPrice } from "@/server/pricing";
import { getSettings } from "@/server/settings";

export const dynamic = "force-dynamic";

/** پلن‌های فعال برای سکشن قیمت‌گذاری سایت (price به ریال؛ برای پلن دلاری با نرخ روز تبدیل شده و usd قیمت اصلی است) */
export async function GET(req: NextRequest) {
  const product = req.nextUrl.searchParams.get("product") || undefined;
  const [data, settings] = await Promise.all([activeCatalog(product), getSettings()]);
  return NextResponse.json(
    data.map((p) => ({
      key: p.key, name: p.name, description: p.description,
      plans: p.plans.map((pl) => ({ id: pl.id, name: pl.name, description: pl.description, features: pl.features, ...publicPrice(pl.price, pl.currency, settings), period: pl.period, durationDays: pl.durationDays, highlighted: pl.highlighted })),
    })),
    { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } },
  );
}
