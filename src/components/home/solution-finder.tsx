"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ButtonLink } from "@/components/ui/button";
import { Icon, type IconName } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section";
import { BrowserFrame, PhoneFrame, Screenshot } from "@/components/mockups/frames";
import { limocScreens } from "@/components/mockups/limoc";
import { limofoodScreens } from "@/components/mockups/limofood";
import { benefitsScreens } from "@/components/mockups/benefits";
import { cn } from "@/lib/utils";

type Option = {
  key: string;
  icon: IconName;
  label: string;
  product: string;
  title: string;
  desc: string;
  points: string[];
  cta: { label: string; href: string };
  tone: string;
  visual: React.ReactNode;
};

const options: Option[] = [
  {
    key: "crm", icon: "users", label: "مدیریت مشتریان و فروش", product: "لیموسی",
    title: "لیموسی؛ مشتری، فروش، پروژه و پشتیبانی در یک محیط",
    desc: "اگر پیگیری مشتری‌ها بین اکسل و واتساپ گم می‌شود، لیموسی مسیر سرنخ تا پیش‌فاکتور، قرارداد، پروژه و پشتیبانی را یکجا نگه می‌دارد.",
    points: ["قیف فروش و یادآوری پیگیری‌ها", "پیش‌فاکتور، قرارداد و پرداخت", "تیکتینگ با SLA و پرتال مشتری"],
    cta: { label: "آشنایی با لیموسی", href: "/products/limoc/" },
    tone: "text-indigo bg-indigo/10",
    visual: <BrowserFrame title="لیموسی · نمای Kanban فروش" className="w-full shadow-[var(--shadow-lift)]"><Screenshot src={limocScreens.kanban.src} alt={limocScreens.kanban.alt} sizes="420px" /></BrowserFrame>,
  },
  {
    key: "food", icon: "utensils", label: "سفارش‌گیری آنلاین غذا", product: "لیموفود",
    title: "لیموفود؛ کانال فروش آنلاین اختصاصی رستوران شما",
    desc: "سفارش را مستقیم از مشتری بگیرید، آنلاین پرداخت شود و از ثبت تا ارسال در یک پنل مدیریت شود.",
    points: ["منوی آنلاین موبایلی", "درگاه پرداخت، بدون کارمزد سفارش", "مدیریت وضعیت سفارش و پیک"],
    cta: { label: "آشنایی با لیموفود", href: "/products/limofood/" },
    tone: "text-sun-700 bg-sun/20",
    visual: <BrowserFrame title="لیموفود · صفحهٔ فروشگاه" className="w-full shadow-[var(--shadow-lift)]"><Screenshot src={limofoodScreens.store.src} alt={limofoodScreens.store.alt} sizes="420px" /></BrowserFrame>,
  },
  {
    key: "benefits", icon: "building", label: "مدیریت رفاهیات کارکنان", product: "سامانهٔ رفاهیات",
    title: "سامانهٔ بن الکترونیکی رفاهیات",
    desc: "اعتبار رفاهی کارکنان را تخصیص دهید، مصرف در فروشگاه‌های طرف قرارداد را ببینید و شفاف تسویه کنید.",
    points: ["صدور بن و اعتبار شخصی هر کارمند", "تأیید خرید با کد ۵ رقمی", "تسویه با فروشندگان و گزارش Excel"],
    cta: { label: "آشنایی با سامانهٔ رفاهیات", href: "/products/benefits/" },
    tone: "text-teal-700 bg-teal/12",
    visual: <PhoneFrame className="mx-auto w-[210px]"><Screenshot src={benefitsScreens.employeeVoucher.src} alt={benefitsScreens.employeeVoucher.alt} sizes="210px" /></PhoneFrame>,
  },
  {
    key: "custom", icon: "code", label: "نرم‌افزار اختصاصی", product: "خدمات توسعه",
    title: "راهکار نرم‌افزاری متناسب با فرایند شما",
    desc: "وقتی فرایندتان خاص است، از تحلیل نیاز تا طراحی، توسعه، استقرار و پشتیبانی همراه شما هستیم.",
    points: ["تحلیل نیازمندی‌ها و طراحی UI/UX", "وب‌اپلیکیشن و سیستم‌های داخلی", "API و یکپارچه‌سازی سامانه‌ها"],
    cta: { label: "ثبت درخواست پروژه", href: "/services/custom-software/#request" },
    tone: "text-violet bg-violet/10",
    visual: (
      <div className="mx-auto grid w-full max-w-[340px] gap-2.5" aria-hidden>
        {["شناخت مسئله", "تحلیل و پیشنهاد راهکار", "طراحی", "توسعه و آزمون", "استقرار و پشتیبانی"].map((s, i) => (
          <div key={s} className="flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 shadow-[var(--shadow-soft)]">
            <span className={cn("grid size-7 place-items-center rounded-full text-[12px] font-bold", i < 2 ? "bg-violet text-white" : "bg-paper text-ink-3")}>{(i + 1).toLocaleString("fa-IR")}</span>
            <span className="text-[14px] font-semibold">{s}</span>
          </div>
        ))}
      </div>
    ),
  },
];

export function SolutionFinder() {
  const [active, setActive] = useState(0);
  const id = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const o = options[active];

  const onKey = (e: React.KeyboardEvent, i: number) => {
    // RTL: فلش چپ = بعدی
    const next = e.key === "ArrowLeft" ? i + 1 : e.key === "ArrowRight" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? options.length - 1 : null;
    if (next === null) return;
    e.preventDefault();
    const n = (next + options.length) % options.length;
    setActive(n);
    tabs.current[n]?.focus();
  };

  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading center eyebrow="راهکار مناسب شما" title="نیاز شما کدام است؟" lead="یکی را انتخاب کنید تا محصول یا خدمت مرتبط را ببینید." />

        <div role="tablist" aria-label="نوع نیاز" className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-2 rounded-2xl border border-line bg-paper p-2 md:grid-cols-4">
          {options.map((op, i) => {
            const selected = i === active;
            return (
              <button
                key={op.key}
                ref={(el) => { tabs.current[i] = el; }}
                role="tab"
                id={`${id}-tab-${i}`}
                aria-selected={selected}
                aria-controls={`${id}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => onKey(e, i)}
                className={cn("relative flex min-h-[64px] items-center justify-center gap-2 rounded-xl px-3 py-3 text-[14px] font-bold transition-colors sm:text-[15px]",
                  selected ? "text-ink" : "text-ink-3 hover:text-ink")}
              >
                {selected && <motion.span layoutId={`${id}-pill`} className="absolute inset-0 rounded-xl bg-white shadow-[var(--shadow-soft)] ring-1 ring-line" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                <span className="relative flex items-center gap-2"><Icon name={op.icon} className="size-[18px] shrink-0" />{op.label}</span>
              </button>
            );
          })}
        </div>

        <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${active}`} className="mx-auto mt-6 max-w-5xl overflow-hidden rounded-3xl border border-line bg-paper">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={o.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
              className="grid items-center gap-10 p-7 sm:p-10 md:grid-cols-[1.1fr_1fr]"
            >
              <div>
                <span className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12.5px] font-bold", o.tone)}>{o.product}</span>
                <h3 className="mt-4 text-[24px] font-extrabold leading-snug sm:text-[28px]">{o.title}</h3>
                <p className="mt-3 text-[15.5px] leading-8 text-ink-2">{o.desc}</p>
                <ul className="mt-5 grid gap-2">
                  {o.points.map((p) => (
                    <li key={p} className="flex items-center gap-2.5 text-[15px]"><Icon name="check" className="size-4 shrink-0 text-teal-700" strokeWidth={2.5} />{p}</li>
                  ))}
                </ul>
                <ButtonLink href={o.cta.href} variant="dark" className="mt-8">{o.cta.label} <Icon name="arrow" /></ButtonLink>
              </div>
              <div className="flex min-h-[260px] items-center justify-center">{o.visual}</div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
