import dashboard from "@/assets/screens/refah-admin-dashboard.webp";
import wizard from "@/assets/screens/refah-voucher-wizard.webp";
import sellerPurchase from "@/assets/screens/refah-seller-purchase.webp";
import sellerWallet from "@/assets/screens/refah-seller-wallet.webp";
import employeeVoucher from "@/assets/screens/refah-employee-voucher.webp";
import { Building2, Store, User, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/** تصاویر واقعی سامانه (از راهنمای رسمی محصول، با دادهٔ آزمایشی) */
export const benefitsScreens = {
  dashboard: { src: dashboard, alt: "داشبورد پنل مدیریت سامانهٔ رفاهیات: بن‌های فعال، اعتبار تخصیص‌یافته، مصرف‌شده و فعالیت ۳۰ روز اخیر" },
  wizard: { src: wizard, alt: "ویزارد پنج‌مرحله‌ای صدور بن جدید در پنل مدیریت" },
  sellerPurchase: { src: sellerPurchase, alt: "پنل فروشنده: ثبت خرید جدید و انتخاب روش شناسایی کارمند" },
  sellerWallet: { src: sellerWallet, alt: "کیف پول فروشنده: کل طلب، دریافت‌شده و مانده" },
  employeeVoucher: { src: employeeVoucher, alt: "پنل کارکنان: جزئیات بن و مانده اعتبار" },
};

/** نمودار چرخهٔ سازمان ← کارمند ← فروشگاه ← سازمان */
export function BenefitsCycle({ className, dark }: { className?: string; dark?: boolean }) {
  const nodes = [
    { icon: Building2, t: "سازمان", d: "تعریف کارکنان و فروشگاه‌ها، صدور بن و تخصیص اعتبار", step: "۱" },
    { icon: User, t: "کارمند", d: "دیدن مانده و فروشگاه‌ها، تأیید خرید با کد ۵ رقمی", step: "۲" },
    { icon: Store, t: "فروشگاه", d: "شناسایی کارمند، ثبت مبلغ فاکتور، مشاهدهٔ طلب", step: "۳" },
  ];
  const flows = ["صدور بن و اعتبار", "خرید و تأیید با کد", "طلب ← تسویه با رسید"];
  return (
    <div className={cn("relative", className)}>
      <ol className="grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch">
        {nodes.map((n, i) => (
          <li key={n.t} className="contents">
            <div className={cn("relative rounded-2xl border p-6", dark ? "border-white/10 bg-white/[0.04]" : "border-line bg-white")}>
              <span className={cn("absolute top-5 end-5 text-[12px] font-bold", dark ? "text-white/35" : "text-ink-3")}>گام {n.step}</span>
              <span className="mb-4 grid size-12 place-items-center rounded-xl bg-teal/15 text-teal"><n.icon className="size-6" strokeWidth={1.75} aria-hidden /></span>
              <p className={cn("text-[18px] font-extrabold", dark ? "text-white" : "text-ink")}>{n.t}</p>
              <p className={cn("mt-1 text-[14.5px] leading-7", dark ? "text-white/60" : "text-ink-2")}>{n.d}</p>
            </div>
            {i < 2 && (
              <div className="flex items-center justify-center gap-2 lg:flex-col" aria-hidden>
                <span className={cn("rounded-full px-3 py-1 text-[12px] font-semibold", dark ? "bg-white/5 text-white/60" : "bg-paper text-ink-2")}>{flows[i]}</span>
                <ArrowLeft className="size-5 rotate-90 text-teal lg:rotate-0" />
              </div>
            )}
          </li>
        ))}
      </ol>
      <div className={cn("mt-4 flex items-center justify-center gap-3 rounded-2xl border border-dashed p-4 text-center text-[14px]", dark ? "border-teal/30 text-white/70" : "border-teal/40 text-ink-2")}>
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-teal/15 text-teal"><ArrowLeft className="size-4 -rotate-90" aria-hidden /></span>
        {flows[2]}: سازمان طلب هر فروشنده را از تراکنش‌ها می‌بیند و پرداخت را با شمارهٔ پیگیری ثبت می‌کند.
      </div>
    </div>
  );
}
