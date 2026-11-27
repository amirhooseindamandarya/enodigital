import { NextResponse, type NextRequest } from "next/server";

/**
 * حساب کاربری در سه زبان: /account (فارسی)، /en/account و /ar/account.
 * مسیرهای انگلیسی و عربی روی همان صفحات /account بازنویسی می‌شوند و زبان در هدر x-eno-locale می‌رود.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const m = pathname.match(/^\/(en|ar)(\/account(?:\/.*)?)$/);
  const locale = m ? m[1] : "fa";
  const headers = new Headers(req.headers);
  headers.set("x-eno-locale", locale);
  headers.set("x-eno-path", pathname);
  if (m) {
    const url = req.nextUrl.clone();
    url.pathname = m[2];
    return NextResponse.rewrite(url, { request: { headers } });
  }
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/account/:path*", "/en/account/:path*", "/ar/account/:path*", "/admin/:path*"],
};
