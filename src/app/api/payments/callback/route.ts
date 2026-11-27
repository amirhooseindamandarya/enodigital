import { NextResponse, type NextRequest } from "next/server";
import { appUrl, handleCallback } from "@/server/checkout";

export const dynamic = "force-dynamic";

/** بازگشت از درگاه پرداخت (زرین‌پال: ?Authority=…&Status=OK|NOK) */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const gw = q.get("gw") ?? "zarinpal";
  const authority = q.get("Authority") ?? q.get("authority") ?? "";
  const status = q.get("Status") ?? q.get("status") ?? "NOK";
  const base = await appUrl();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  if (!authority) return NextResponse.redirect(`${base}${basePath}/account/orders/?pay=unknown`);
  const path = await handleCallback(gw, authority, status);
  return NextResponse.redirect(`${base}${basePath}${path}`, 303);
}
