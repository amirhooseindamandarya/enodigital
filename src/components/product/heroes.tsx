"use client";

import { motion } from "motion/react";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { BrowserFrame, MockLabel, PhoneFrame, Screenshot } from "@/components/mockups/frames";
import { limocScreens } from "@/components/mockups/limoc";
import { OrderCard, limofoodScreens } from "@/components/mockups/limofood";
import { benefitsScreens } from "@/components/mockups/benefits";
import { products } from "@/lib/products";

const ease = [0.2, 0.7, 0.2, 1] as const;
const up = (d = 0) => ({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: d, ease } });

/* ---------------- لیموسی: روشن، Indigo، تصاویر واقعی ---------------- */
export function LimocHero({ crumb }: { crumb: React.ReactNode }) {
  const p = products.limoc;
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#eef0ff] via-[#f6f7ff] to-white pt-[72px]">
      <div className="container-x pb-20 pt-10 sm:pt-14">
        {crumb}
        <div className="mt-10 grid items-center gap-14 lg:grid-cols-[0.9fr_1.3fr]">
          <div>
            <motion.span {...up()} className="inline-flex items-center gap-2 rounded-full bg-indigo/10 px-3 py-1 text-[13px] font-bold text-indigo"><Icon name="users" className="size-4" />{p.category}</motion.span>
            <motion.h1 {...up(0.05)} className="h-display mt-5">فروش، مشتری، پروژه و پشتیبانی را یکجا مدیریت کنید</motion.h1>
            <motion.p {...up(0.1)} className="lead mt-5">لیموسی نرم‌افزار ابری ساده برای تیم‌های خدماتی کوچک است؛ از اولین تماس مشتری و پیگیری فروش تا پیش‌فاکتور، قرارداد، پروژه، دریافت وجه و پشتیبانی، همه‌چیز در یک سیستم.</motion.p>
            <motion.div {...up(0.18)} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#demo" size="lg">{p.cta.primary}</ButtonLink>
              <ButtonLink href={p.externalUrl!} external variant="outline" size="lg">{p.cta.secondary} <Icon name="external" /></ButtonLink>
            </motion.div>
            <motion.ul {...up(0.24)} className="mt-8 grid gap-2 text-[14px] text-ink-2 sm:grid-cols-2">
              {["بدون نیاز به نصب", "قابل استفاده روی موبایل و کامپیوتر", "مناسب تیم‌های ۲ تا ۱۰ نفره", "۶۰ روز استفادهٔ رایگان"].map((t) => (
                <li key={t} className="flex items-center gap-2"><Icon name="check" className="size-4 text-indigo" strokeWidth={2.5} />{t}</li>
              ))}
            </motion.ul>
          </div>
          <div className="relative pb-10">
            <motion.div {...up(0.15)}>
              <span className="absolute -top-8 end-0 rounded-full border border-line bg-white px-2.5 py-0.5 text-[11px] font-semibold text-ink-3">تصویر واقعی محصول</span>
              <BrowserFrame title="لیموسی · نمای Kanban فروش" className="shadow-[var(--shadow-lift)]">
                <Screenshot src={limocScreens.kanban.src} alt={limocScreens.kanban.alt} priority sizes="(max-width: 1024px) 100vw, 680px" />
              </BrowserFrame>
            </motion.div>
            <motion.div {...up(0.4)} className="absolute -bottom-4 -left-6 hidden w-[52%] sm:block lg:-left-10">
              <BrowserFrame title="پیش‌فاکتور" className="shadow-[var(--shadow-lift)]">
                <Screenshot src={limocScreens.quote.src} alt={limocScreens.quote.alt} sizes="360px" />
              </BrowserFrame>
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
    <section className="relative overflow-hidden bg-[#fff8ea] pt-[72px]">
      <div aria-hidden className="pointer-events-none absolute -left-40 top-20 size-[520px] rounded-full bg-sun/25 blur-[120px]" />
      <div className="container-x relative pb-16 pt-10 sm:pt-14">
        {crumb}
        <div className="mt-10 grid items-center gap-14 lg:grid-cols-[1fr_1fr]">
          <div>
            <motion.span {...up()} className="inline-flex items-center gap-2 rounded-full bg-sun/30 px-3 py-1 text-[13px] font-bold text-[#8a5d00]"><Icon name="utensils" className="size-4" />{p.category}</motion.span>
            <motion.h1 {...up(0.05)} className="h-display mt-5">{p.name}</motion.h1>
            <motion.p {...up(0.1)} className="mt-4 text-[21px] font-bold leading-[1.8] sm:text-[24px]">{p.tagline}</motion.p>
            <motion.p {...up(0.15)} className="lead mt-4">منوی آنلاین، پرداخت اینترنتی، مدیریت سفارش و پیک؛ کانال فروش آنلاین اختصاصی برای {p.audience}.</motion.p>
            <motion.div {...up(0.2)} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#demo" variant="dark" size="lg">{p.cta.primary}</ButtonLink>
              <ButtonLink href={p.externalUrl!} external variant="outline" size="lg">{p.cta.secondary} <Icon name="external" /></ButtonLink>
            </motion.div>
            <motion.ul {...up(0.25)} className="mt-9 flex flex-wrap gap-2">
              {["منوی آنلاین", "درگاه پرداخت", "بدون کارمزد سفارش", "مدیریت پیک"].map((t) => (
                <li key={t} className="rounded-full border border-[#f1dfb5] bg-white px-3 py-1 text-[13px] font-semibold text-ink-2">{t}</li>
              ))}
            </motion.ul>
          </div>
          <div className="relative sm:pb-24">
            <motion.div {...up(0.15)}>
              <span className="absolute -top-8 end-0 rounded-full border border-[#f1dfb5] bg-white px-2.5 py-0.5 text-[11px] font-semibold text-ink-3">تصویر واقعی محصول</span>
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
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_80%_0%,rgb(22_184_166/0.18),transparent_70%),radial-gradient(50%_50%_at_0%_100%,rgb(88_101_232/0.15),transparent_70%)]" />
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
