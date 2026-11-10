"use client";

import { motion } from "motion/react";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { BrowserFrame, MockLabel, PhoneFrame, Screenshot } from "@/components/mockups/frames";
import { limocScreens } from "@/components/mockups/limoc";
import { OrderCard, limofoodScreens } from "@/components/mockups/limofood";
import { benefitsScreens } from "@/components/mockups/benefits";
import { products } from "@/lib/products";
import { Float } from "@/components/motion/fx";

const ease = [0.2, 0.7, 0.2, 1] as const;
const up = (d = 0) => ({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: d, ease } });

/* ---------------- لیموسی: رنگ برند خودش (سبز و زرد) ---------------- */
export function LimocHero({ crumb }: { crumb: React.ReactNode }) {
  const p = products.limoc;
  return (
    <section className="relative overflow-hidden bg-limoc-cream pt-[72px]">
      <div aria-hidden className="pointer-events-none absolute -left-40 top-10 size-[560px] rounded-full bg-limoc/15 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute -right-32 bottom-0 size-[420px] rounded-full bg-limoc-sun/25 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgb(6_75_46/0.10)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(70%_60%_at_30%_40%,#000,transparent)]" />
      <div className="container-x relative pb-24 pt-10 sm:pt-14">
        {crumb}
        <div className="mt-10 grid items-center gap-16 lg:grid-cols-[0.9fr_1.3fr]">
          <div>
            <motion.span {...up()} className="inline-flex items-center gap-2 rounded-full border border-limoc-sun/60 bg-limoc-sun/25 px-3 py-1 text-[13px] font-bold text-limoc-900">
              <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-limoc opacity-60 motion-reduce:hidden" /><span className="relative inline-flex size-2 rounded-full bg-limoc" /></span>
              ۶۰ روز استفادهٔ رایگان
            </motion.span>
            <motion.h1 {...up(0.05)} className="h-display mt-5 text-limoc-ink">
              فروش، مشتری، پروژه و پشتیبانی را{" "}
              <span className="relative inline-block text-limoc">
                یکجا
                <svg aria-hidden viewBox="0 0 120 14" className="absolute -bottom-2 left-0 h-3 w-full" preserveAspectRatio="none">
                  <motion.path d="M2 9 C 30 2, 60 13, 118 5" fill="none" stroke="#fbc30e" strokeWidth="5" strokeLinecap="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay: 0.6, ease }} />
                </svg>
              </span>{" "}
              مدیریت کنید
            </motion.h1>
            <motion.p {...up(0.1)} className="lead mt-6">لیموسی نرم‌افزار ابری ساده برای تیم‌های خدماتی کوچک است؛ از اولین تماس مشتری و پیگیری فروش تا پیش‌فاکتور، قرارداد، پروژه، دریافت وجه و پشتیبانی، همه‌چیز در یک سیستم.</motion.p>
            <motion.div {...up(0.18)} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#demo" variant="limocSun" size="lg">{p.cta.primary}</ButtonLink>
              <ButtonLink href={p.externalUrl!} external variant="limocOutline" size="lg">{p.cta.secondary} <Icon name="external" /></ButtonLink>
            </motion.div>
            <motion.ul {...up(0.24)} className="mt-8 grid gap-2 text-[14px] text-ink-2 sm:grid-cols-2">
              {["بدون نیاز به نصب", "قابل استفاده روی موبایل و کامپیوتر", "مناسب تیم‌های ۲ تا ۱۰ نفره", "پرتال اختصاصی مشتری"].map((t) => (
                <li key={t} className="flex items-center gap-2"><span className="grid size-5 place-items-center rounded-full bg-limoc/12 text-limoc"><Icon name="check" className="size-3" strokeWidth={3} /></span>{t}</li>
              ))}
            </motion.ul>
          </div>
          <div className="relative pb-10 [perspective:1600px]">
            <motion.div initial={{ opacity: 0, y: 40, rotateX: 14, rotateY: -8 }} animate={{ opacity: 1, y: 0, rotateX: 0, rotateY: 0 }} transition={{ duration: 1.2, delay: 0.15, ease }}>
              <span className="absolute -top-8 end-0 rounded-full border border-limoc/20 bg-white px-2.5 py-0.5 text-[11px] font-semibold text-limoc-900">تصویر واقعی محصول</span>
              <BrowserFrame title="لیموسی · نمای Kanban فروش" className="shadow-[0_50px_100px_-40px_rgb(6_75_46/0.45)]">
                <Screenshot src={limocScreens.kanban.src} alt={limocScreens.kanban.alt} priority sizes="(max-width: 1024px) 100vw, 680px" />
              </BrowserFrame>
            </motion.div>
            <motion.div {...up(0.55)} className="absolute -bottom-6 -left-6 hidden w-[50%] sm:block lg:-left-12">
              <Float duration={7}>
                <BrowserFrame title="پیش‌فاکتور" className="shadow-[0_40px_80px_-30px_rgb(6_75_46/0.5)]">
                  <Screenshot src={limocScreens.quote.src} alt={limocScreens.quote.alt} sizes="360px" />
                </BrowserFrame>
              </Float>
            </motion.div>
            <motion.div {...up(0.8)} className="absolute -right-6 top-[30%] hidden md:block lg:-right-10">
              <Float delay={1.2} duration={5.5}>
                <div className="flex items-center gap-2.5 rounded-2xl border border-limoc/15 bg-white/95 px-3.5 py-2.5 shadow-[0_20px_40px_-20px_rgb(6_75_46/0.45)] backdrop-blur" aria-hidden>
                  <span className="grid size-8 place-items-center rounded-full bg-limoc text-white"><Icon name="check" className="size-4" strokeWidth={3} /></span>
                  <span className="text-[12.5px] leading-5"><b className="block text-limoc-ink">پیش‌فاکتور تأیید شد</b><span className="text-ink-3">مشتری آنلاین تأیید کرد</span></span>
                </div>
              </Float>
            </motion.div>
            <motion.div {...up(0.95)} className="absolute -bottom-2 right-[6%] hidden md:block">
              <Float delay={0.4} duration={6.5}>
                <div className="flex items-center gap-2.5 rounded-2xl bg-limoc-ink px-3.5 py-2.5 text-white shadow-[0_20px_40px_-20px_rgb(6_75_46/0.6)]" aria-hidden>
                  <span className="grid size-8 place-items-center rounded-full bg-limoc-sun text-limoc-ink"><Icon name="clock" className="size-4" /></span>
                  <span className="text-[12.5px] leading-5"><b className="block">SLA فعال</b><span className="text-white/60">مهلت پاسخ در ساعات کاری</span></span>
                </div>
              </Float>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- لیموفود: گرم، منوی موبایلی + کارت سفارش ---------------- */
export function LimoFoodHero({ crumb }: { crumb: React.ReactNode }) {
  const p = products.limofood;
  return (
    <section className="relative overflow-hidden bg-[#fff6f5] pt-[72px]">
      <div aria-hidden className="pointer-events-none absolute -left-40 top-20 size-[520px] rounded-full bg-sun/12 blur-[120px]" />
      <div className="container-x relative pb-16 pt-10 sm:pt-14">
        {crumb}
        <div className="mt-10 grid items-center gap-14 lg:grid-cols-[1fr_1fr]">
          <div>
            <motion.span {...up()} className="inline-flex items-center gap-2 rounded-full bg-sun/10 px-3 py-1 text-[13px] font-bold text-sun-700"><Icon name="utensils" className="size-4" />{p.category}</motion.span>
            <motion.h1 {...up(0.05)} className="h-display mt-5">{p.name}</motion.h1>
            <motion.p {...up(0.1)} className="mt-4 text-[21px] font-bold leading-[1.8] sm:text-[24px]">{p.tagline}</motion.p>
            <motion.p {...up(0.15)} className="lead mt-4">منوی آنلاین، پرداخت اینترنتی، مدیریت سفارش و پیک؛ کانال فروش آنلاین اختصاصی برای {p.audience}.</motion.p>
            <motion.div {...up(0.2)} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#demo" variant="sun" size="lg">{p.cta.primary}</ButtonLink>
              <ButtonLink href={p.externalUrl!} external variant="outline" size="lg">{p.cta.secondary} <Icon name="external" /></ButtonLink>
            </motion.div>
            <motion.ul {...up(0.25)} className="mt-9 flex flex-wrap gap-2">
              {["منوی آنلاین", "درگاه پرداخت", "بدون کارمزد سفارش", "مدیریت پیک"].map((t) => (
                <li key={t} className="rounded-full border border-[#f3d3cf] bg-white px-3 py-1 text-[13px] font-semibold text-ink-2">{t}</li>
              ))}
            </motion.ul>
          </div>
          <div className="relative sm:pb-24">
            <motion.div {...up(0.15)}>
              <span className="absolute -top-8 end-0 rounded-full border border-[#f3d3cf] bg-white px-2.5 py-0.5 text-[11px] font-semibold text-ink-3">تصویر واقعی محصول</span>
              <BrowserFrame title="لیموفود · صفحهٔ فروشگاه" className="shadow-[var(--shadow-lift)]">
                <Screenshot src={limofoodScreens.store.src} alt={limofoodScreens.store.alt} priority sizes="(max-width: 1024px) 100vw, 560px" />
              </BrowserFrame>
            </motion.div>
            <motion.div {...up(0.4)} className="absolute -bottom-2 -left-8 hidden w-[48%] max-w-[270px] sm:block">
              <MockLabel className="mb-2" />
              <OrderCard className="shadow-[var(--shadow-lift)]" status="new" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- رفاهیات: تیره، رسمی، فیروزه‌ای ---------------- */
export function BenefitsHero({ crumb }: { crumb: React.ReactNode }) {
  const p = products.benefits;
  return (
    <section className="relative overflow-hidden bg-navy pt-[72px] text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_80%_0%,rgb(22_184_166/0.18),transparent_70%),radial-gradient(50%_50%_at_0%_100%,rgb(245_168_0/0.12),transparent_70%)]" />
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0" />
      <div className="container-x relative pb-20 pt-10 sm:pt-14">
        {crumb}
        <div className="mx-auto mt-12 max-w-3xl text-center">
          <motion.span {...up()} className="inline-flex items-center gap-2 rounded-full border border-teal/30 bg-teal/10 px-3 py-1 text-[13px] font-bold text-teal"><Icon name="building" className="size-4" />{p.category}</motion.span>
          <motion.h1 {...up(0.05)} className="h-display mt-6 text-white">مدیریت هوشمند رفاهیات کارکنان</motion.h1>
          <motion.p {...up(0.1)} className="mx-auto mt-5 max-w-2xl text-[17px] leading-[2] text-white/70 sm:text-[19px]">از تخصیص اعتبار تا مصرف و تسویه؛ سازمان بن صادر می‌کند، کارکنان در فروشگاه‌های طرف قرارداد خرید می‌کنند و طلب هر فروشنده شفاف تسویه می‌شود.</motion.p>
          <motion.div {...up(0.18)} className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="#demo" variant="teal" size="lg">{p.cta.primary}</ButtonLink>
            <ButtonLink href="#cycle" variant="ghostDark" size="lg">مشاهدهٔ چرخهٔ کار</ButtonLink>
          </motion.div>
        </div>
        <div className="relative mx-auto mt-16 max-w-5xl">
          <motion.div {...up(0.25)}>
            <BrowserFrame title="پنل مدیریت سازمان · داشبورد" dark className="shadow-[var(--shadow-float)]">
              <Screenshot src={benefitsScreens.dashboard.src} alt={benefitsScreens.dashboard.alt} priority sizes="(max-width: 1024px) 100vw, 960px" />
            </BrowserFrame>
          </motion.div>
          <motion.div {...up(0.45)} className="absolute -bottom-10 -right-3 w-[26%] max-w-[210px] sm:-right-8">
            <PhoneFrame screenClassName="aspect-[9/17.5]"><Screenshot src={benefitsScreens.employeeVoucher.src} alt={benefitsScreens.employeeVoucher.alt} sizes="210px" /></PhoneFrame>
          </motion.div>
          <motion.div {...up(0.55)} className="absolute -bottom-10 -left-3 hidden w-[24%] max-w-[200px] sm:block sm:-left-8">
            <PhoneFrame screenClassName="aspect-[9/19]"><Screenshot src={benefitsScreens.sellerPurchase.src} alt={benefitsScreens.sellerPurchase.alt} sizes="200px" /></PhoneFrame>
          </motion.div>
        </div>
        <p className="mt-16 text-center text-[12px] text-white/40">تصاویر از نسخهٔ واقعی سامانه و با دادهٔ آزمایشی تهیه شده‌اند.</p>
      </div>
    </section>
  );
}
