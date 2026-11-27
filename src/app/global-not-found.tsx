import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const vazir = localFont({ src: "../fonts/Vazirmatn-Variable.woff2", weight: "100 900", display: "swap", variable: "--font-vazir" });

export const metadata: Metadata = { title: "صفحه پیدا نشد | اِنو دیجیتال", robots: { index: false } };

/** صفحهٔ ۴۰۴ سراسری (سه‌زبانه) */
export default function GlobalNotFound() {
  return (
    <html lang="fa" dir="rtl" className={vazir.variable}>
      <body>
        <main className="surface-dark relative grid min-h-dvh place-items-center overflow-hidden px-5 text-center">
          <div aria-hidden className="grid-lines pointer-events-none absolute inset-0" />
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/logo-mark-white.png" alt="" width={44} height={45} className="mx-auto h-11 w-auto" />
            <p className="mt-6 text-[14px] font-bold text-[#f5b82e]">خطای ۴۰۴ · Error 404</p>
            <h1 className="h-section mt-3 text-white">صفحه‌ای که دنبالش هستید پیدا نشد</h1>
            <p className="mt-2 text-white/60" dir="ltr" lang="en">We couldn’t find that page · <span lang="ar">لم نعثر على الصفحة المطلوبة</span></p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href="/" className="inline-flex h-12 items-center rounded-xl bg-white px-6 font-bold text-navy hover:bg-paper">صفحهٔ اصلی</a>
              <a href="/en/" lang="en" className="inline-flex h-12 items-center rounded-xl border border-white/15 px-6 font-bold text-white hover:bg-white/10">English</a>
              <a href="/ar/" lang="ar" className="inline-flex h-12 items-center rounded-xl border border-white/15 px-6 font-bold text-white hover:bg-white/10">العربية</a>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
