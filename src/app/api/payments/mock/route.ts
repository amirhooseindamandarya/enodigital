import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/** صفحهٔ درگاه آزمایشی (فقط وقتی درگاه واقعی تنظیم نشده است) */
export async function GET(req: NextRequest) {
  if (process.env.ZARINPAL_MERCHANT_ID || (process.env.NODE_ENV === "production" && process.env.PAYMENT_MOCK !== "true")) {
    return new NextResponse("Not found", { status: 404 });
  }
  const q = req.nextUrl.searchParams;
  const authority = q.get("authority") ?? "";
  const amount = Number(q.get("amount") ?? 0);
  const cb = q.get("callback") ?? "";
  const join = cb.includes("?") ? "&" : "?";
  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
  const ok = esc(`${cb}${join}Authority=${encodeURIComponent(authority)}&Status=OK`);
  const nok = esc(`${cb}${join}Authority=${encodeURIComponent(authority)}&Status=NOK`);
  const html = `<!doctype html><html lang="fa" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>درگاه آزمایشی</title>
<body style="font-family:Tahoma,sans-serif;background:#f7f9fc;display:grid;place-items:center;min-height:100vh;margin:0">
<main style="background:#fff;border:1px solid #e6e9f0;border-radius:16px;padding:32px;max-width:380px;width:90%;text-align:center">
<p style="color:#9a6600;font-weight:700;margin:0">درگاه پرداخت آزمایشی</p>
<h1 style="font-size:22px;margin:12px 0">${(amount / 10).toLocaleString("fa-IR")} تومان</h1>
<p style="color:#46546a;font-size:14px">این صفحه فقط در محیط توسعه است؛ پولی جابه‌جا نمی‌شود.</p>
<a id="pay-ok" href="${ok}" style="display:block;background:#16b8a6;color:#fff;padding:12px;border-radius:12px;text-decoration:none;margin-top:16px">پرداخت موفق</a>
<a id="pay-cancel" href="${nok}" style="display:block;border:1px solid #d7dce6;color:#0e1f33;padding:12px;border-radius:12px;text-decoration:none;margin-top:8px">انصراف</a>
</main></body></html>`;
  return new NextResponse(html, { headers: { "content-type": "text/html; charset=utf-8" } });
}
