import { NextResponse, type NextRequest } from "next/server";
import { activeCatalog } from "@/server/orders";

export const dynamic = "force-dynamic";

/** پلن‌های فعال برای سکشن قیمت‌گذاری سایت */
export async function GET(req: NextRequest) {
  const product = req.nextUrl.searchParams.get("product") || undefined;
  const data = await activeCatalog(product);
  return NextResponse.json(
    data.map((p) => ({
      key: p.key, name: p.name, description: p.description,
      plans: p.plans.map((pl) => ({ id: pl.id, name: pl.name, description: pl.description, features: pl.features, price: pl.price, period: pl.period, durationDays: pl.durationDays, highlighted: pl.highlighted })),
    })),
    { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } },
  );
}
