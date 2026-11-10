"use client";

import { motion } from "motion/react";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { BrowserFrame, PhoneFrame, Screenshot } from "@/components/mockups/frames";
import { limocScreens } from "@/components/mockups/limoc";
import { LimoFoodMenu } from "@/components/mockups/limofood";
import { benefitsScreens } from "@/components/mockups/benefits";
import { productList } from "@/lib/products";
import { cn } from "@/lib/utils";

const ease = [0.2, 0.7, 0.2, 1] as const;

function Tag({ name, dot, className }: { name: string; dot: string; className?: string }) {
  return (
    <span className={cn("glass absolute z-20 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-semibold text-white", className)}>
      <i className={cn("size-2 rounded-full", dot)} />{name}
    </span>
  );
}

export function Hero() {
  return (
    <section className="surface-dark relative overflow-hidden pt-[72px]">
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0" />
      <div className="container-x relative grid items-center gap-14 pb-20 pt-14 sm:pt-20 lg:grid-cols-[1fr_1.12fr] lg:gap-10 lg:pb-28 lg:pt-24">
        <div className="relative z-10 max-w-[560px]">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}
            className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-medium text-white/80">
            <span className="flex -space-x-1 space-x-reverse">
              {productList.map((p) => <i key={p.slug} className={cn("size-2 rounded-full ring-2 ring-navy", p.theme.dot)} />)}
            </span>
            محصولات آماده + توسعهٔ نرم‌افزار سفارشی
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.05, ease }}
            className="h-display mt-6 text-white">
            نرم‌افزارهایی برای{" "}
            <span className="bg-gradient-to-l from-amber via-[#ffd77a] to-white bg-clip-text text-transparent">کسب‌وکارهای رو به رشد.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12, ease }}
            className="mt-6 text-[16.5px] leading-[2] text-white/70 sm:text-[18px]">
            از محصولات نرم‌افزاری آماده تا راهکارهای اختصاصی؛ فناوری را به ابزاری برای ساده‌تر شدن فرایندها و توسعهٔ کسب‌وکار شما تبدیل می‌کنیم.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.18, ease }}
            className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/products/" size="lg">کشف محصولات <Icon name="arrow" /></ButtonLink>
            <ButtonLink href="/services/custom-software/" variant="ghostDark" size="lg">سفارش نرم‌افزار اختصاصی</ButtonLink>
          </motion.div>
          <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 grid grid-cols-3 gap-3 border-t border-white/10 pt-6 text-[13px] text-white/55">
            {productList.map((p) => (
              <li key={p.slug}>
                <span className="mb-1 flex items-center gap-1.5 font-bold text-white"><i className={cn("size-1.5 rounded-full", p.theme.dot)} />{p.name}</span>
                <span className="leading-6">{p.audience}</span>
              </li>
            ))}
          </motion.ul>
        </div>

        {/* سه لایهٔ شناور: CRM، منوی سفارش موبایل، پنل رفاهیات */}
        <div className="relative h-[400px] sm:h-[500px] lg:h-[560px]" aria-label="نمای رابط سه محصول" role="img">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2, ease }}
            className="absolute left-0 top-0 w-[88%] sm:w-[80%]">
            <Tag name="لیموسی" dot="bg-limoc" className="-top-3 right-5" />
            <BrowserFrame title="لیموسی · نمای Kanban فروش" className="shadow-[var(--shadow-float)]">
              <Screenshot src={limocScreens.kanban.src} alt={limocScreens.kanban.alt} priority sizes="(max-width: 1024px) 88vw, 44vw" />
            </BrowserFrame>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.38, ease }}
            className="absolute bottom-0 left-[4%] w-[66%] sm:left-[2%] sm:w-[60%]">
            <Tag name="سامانهٔ رفاهیات" dot="bg-teal" className="-top-3 right-5" />
            <BrowserFrame title="پنل مدیریت · داشبورد" dark className="shadow-[var(--shadow-float)]">
              <Screenshot src={benefitsScreens.dashboard.src} alt={benefitsScreens.dashboard.alt} priority sizes="(max-width: 1024px) 66vw, 36vw" />
            </BrowserFrame>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.52, ease }}
            className="absolute -bottom-4 right-0 w-[34%] max-w-[220px] sm:w-[32%]">
            <Tag name="لیموفود" dot="bg-sun" className="-top-3 left-1/2 -translate-x-1/2" />
            <PhoneFrame>
              <LimoFoodMenu />
            </PhoneFrame>
          </motion.div>
        </div>
      </div>
      <p className="container-x relative pb-6 text-[11.5px] text-white/35">منوی موبایل لیموفود ماکاپ مفهومی است؛ تصاویر لیموسی و رفاهیات از نسخهٔ واقعی با دادهٔ نمونه‌اند.</p>
    </section>
  );
}
