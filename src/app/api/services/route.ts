import { NextResponse, type NextRequest } from "next/server";
import { serviceCatalog } from "@/server/orders";
import { publicPrice } from "@/server/pricing";
import { getSettings } from "@/server/settings";

export const dynamic = "force-dynamic";

/** دسته‌ها و خدمات دیجیتال فعال برای سکشن services_catalog سایت (price به ریال) */
export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category") || undefined;
  const [cats, settings] = await Promise.all([serviceCatalog(category), getSettings()]);
  return NextResponse.json(
    cats.map((c) => ({
      slug: c.slug, name: c.name, description: c.description,
      services: c.services.map((sv) => ({
        id: sv.id, slug: sv.slug, name: sv.name, summary: sv.summary, features: sv.features, unit: sv.unit,
        pricing: sv.pricing, deliveryDays: sv.deliveryDays, highlighted: sv.highlighted,
        ...(sv.pricing === "fixed" ? publicPrice(sv.price, sv.currency, settings) : { price: null, usd: null }),
      })),
    })),
    { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } },
  );
}
