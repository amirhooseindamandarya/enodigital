import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

/** ۴۰۴ داخل قالب سایت (هدر و فوتر همان زبان) */
export default function NotFound() {
  return (
    <section className="surface-dark grid min-h-[80vh] place-items-center pt-[72px] text-center">
      <div className="container-x">
        <p className="text-[14px] font-bold text-[#f5b82e]">خطای ۴۰۴ · Error 404</p>
        <h1 className="h-section mt-4 text-white">صفحه‌ای که دنبالش هستید پیدا نشد</h1>
        <p className="mt-2 text-white/60" lang="en" dir="ltr">We couldn’t find that page</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className={buttonVariants({ variant: "light" })}>صفحهٔ اصلی</Link>
          <Link href="/en/" className={buttonVariants({ variant: "ghostDark" })}>English</Link>
        </div>
      </div>
    </section>
  );
}
