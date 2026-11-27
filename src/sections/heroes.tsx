"use client";
/* هیروها (با انیمیشن ورود) */
import { motion } from "motion/react";
import { Float } from "@/components/motion/fx";
import { Icon } from "@/components/ui/icon";
import { PhoneFrame } from "@/components/mockups/frames";
import { LimoFoodMenu, OrderCard } from "@/components/mockups/limofood";
import { ui } from "@/cms/i18n";
import { cn } from "@/lib/utils";
import { Buttons, Check, Framed, th, type C, type SectionProps } from "./kit";

const ease = [0.2, 0.7, 0.2, 1] as const;
const up = (d = 0) => ({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: d, ease } });

function Tag({ name, dot, className }: { name: string; dot: string; className?: string }) {
  return (
    <span className={cn("glass absolute z-20 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-semibold text-white", className)}>
      <i className={cn("size-2 rounded-full", dot)} />{name}
    </span>
  );
}

/** عنوانی که بخشی از آن رنگی/زیرخط‌دار است */
function Highlighted({ title, highlight, render }: { title: string; highlight?: string; render: (h: string) => React.ReactNode }) {
  if (!highlight || !title.includes(highlight)) return <>{title}</>;
  const [a, b] = title.split(highlight);
  return <>{a}{render(highlight)}{b}</>;
}

/* ---------------- هیروی صفحهٔ اصلی ---------------- */
export function HomeHero({ c, ctx }: SectionProps) {
  const products = ctx.g.products.items;
  const [p0, p1, p2] = products;
  return (
    <section className="surface-dark relative overflow-hidden pt-[72px]">
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0" />
      <div aria-hidden className="pointer-events-none absolute -left-40 top-1/3 size-[520px] animate-[drift_18s_ease-in-out_infinite] rounded-full bg-amber/15 blur-[120px] motion-reduce:animate-none" />
      <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 size-[460px] animate-[drift_22s_ease-in-out_infinite_reverse] rounded-full bg-[#2c62b5]/30 blur-[120px] motion-reduce:animate-none" />
      <div className="container-x relative grid items-center gap-14 pb-20 pt-14 sm:pt-20 lg:grid-cols-[1fr_1.12fr] lg:gap-10 lg:pb-28 lg:pt-24">
        <div className="relative z-10 max-w-[560px]">
          {c.badge && (
            <motion.p {...up()} className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-medium text-white/80">
              <span className="flex -space-x-1 space-x-reverse">{products.map((p) => <i key={p.key} className={cn("size-2 rounded-full ring-2 ring-navy", th(p.theme).dot)} />)}</span>
              {c.badge}
            </motion.p>
          )}
          <motion.h1 {...up(0.05)} className="h-display mt-6 text-white">
            <Highlighted title={c.title} highlight={c.title_highlight} render={(h) => <span className="bg-gradient-to-l from-amber via-[#ffd77a] to-white bg-clip-text text-transparent ltr:bg-gradient-to-r">{h}</span>} />
          </motion.h1>
          {c.subtitle && <motion.p {...up(0.12)} className="mt-6 text-[16.5px] leading-[2] text-white/70 sm:text-[18px]">{c.subtitle}</motion.p>}
          <motion.div {...up(0.18)}><Buttons items={c.buttons} dark className="mt-9" /></motion.div>
          <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 grid gap-2.5 border-t border-white/10 pt-6 text-[13px] text-white/55 sm:grid-cols-3 sm:gap-3">
            {products.map((p) => (
              <li key={p.key} className="flex items-baseline gap-2 sm:block">
                <span className="flex shrink-0 items-center gap-1.5 font-bold text-white sm:mb-1"><i className={cn("size-1.5 rounded-full", th(p.theme).dot)} />{p.name}</span>
                <span className="leading-6">{p.audience}</span>
              </li>
            ))}
          </motion.ul>
        </div>

        <div className="relative h-[400px] sm:h-[500px] lg:h-[560px]" aria-hidden>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2, ease }} className="absolute left-0 top-0 w-[88%] sm:w-[80%]">
            {p0 && <Tag name={p0.name} dot={th(p0.theme).dot} className="-top-3 end-5" />}
            <Float duration={8}><Framed image={c.image_main} title={c.image_main_title} className="shadow-[var(--shadow-float)]" eager /></Float>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.38, ease }} className="absolute bottom-0 left-[4%] w-[66%] sm:left-[2%] sm:w-[60%]">
            {p2 && <Tag name={p2.name} dot={th(p2.theme).dot} className="-top-3 end-5" />}
            <Float duration={7} delay={1.4}><Framed image={c.image_secondary} frame="browser_dark" title={c.image_secondary_title} className="shadow-[var(--shadow-float)]" eager /></Float>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.52, ease }} className="absolute -bottom-4 right-0 w-[34%] max-w-[220px] sm:w-[32%]">
            {p1 && <Tag name={p1.name} dot={th(p1.theme).dot} className="-top-3 left-1/2 -translate-x-1/2" />}
            <Float duration={6} delay={0.6}><PhoneFrame><LimoFoodMenu locale={ctx.locale} /></PhoneFrame></Float>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- هیروی محصول ---------------- */
export function ProductHero({ c, ctx, crumb }: SectionProps & { crumb: React.ReactNode }) {
  const chips = (c.chips ?? []) as { text: string }[];
  const floats = (c.float_cards ?? []) as C[];

  if (c.variant === "benefits") {
    return (
      <section className="relative overflow-hidden bg-navy pt-[72px] text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_80%_0%,rgb(22_184_166/0.18),transparent_70%),radial-gradient(50%_50%_at_0%_100%,rgb(245_168_0/0.12),transparent_70%)]" />
        <div aria-hidden className="grid-lines pointer-events-none absolute inset-0" />
        <div className="container-x relative pb-20 pt-10 sm:pt-14">
          {crumb}
          <div className="mx-auto mt-12 max-w-3xl text-center">
            {c.badge && <motion.span {...up()} className="inline-flex items-center gap-2 rounded-full border border-teal/30 bg-teal/10 px-3 py-1 text-[13px] font-bold text-teal"><Icon name="building" className="size-4" />{c.badge}</motion.span>}
            <motion.h1 {...up(0.05)} className="h-display mt-6 text-white">{c.title}</motion.h1>
            {c.lead && <motion.p {...up(0.1)} className="mx-auto mt-5 max-w-2xl text-[17px] leading-[2] text-white/70 sm:text-[19px]">{c.lead}</motion.p>}
            <motion.div {...up(0.18)}><Buttons items={c.buttons} theme="benefits" dark firstArrow={false} className="mt-9 justify-center" override={(_, i) => (i === 0 ? "teal" : "ghostDark")} /></motion.div>
          </div>
          <div className="relative mx-auto mt-16 max-w-5xl">
            <motion.div {...up(0.25)}><Framed image={c.image_main} frame="browser_dark" title={c.image_main_title} className="shadow-[var(--shadow-float)]" eager /></motion.div>
            {c.image_tertiary && (
              <motion.div {...up(0.45)} className="absolute -bottom-10 -right-3 w-[26%] max-w-[210px] sm:-right-8">
                <Float delay={0.3} duration={6.5}><PhoneFrame screenClassName="aspect-[9/17.5]"><Framed image={c.image_tertiary} frame="none" /></PhoneFrame></Float>
              </motion.div>
            )}
            {c.image_secondary && (
              <motion.div {...up(0.55)} className="absolute -bottom-10 -left-3 hidden w-[24%] max-w-[200px] sm:-left-8 sm:block">
                <Float delay={1.2} duration={6.5}><PhoneFrame screenClassName="aspect-[9/19]"><Framed image={c.image_secondary} frame="none" /></PhoneFrame></Float>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (c.variant === "limofood") {
    return (
      <section className="relative overflow-hidden bg-[#fff6f5] pt-[72px]">
        <div aria-hidden className="pointer-events-none absolute -left-40 top-20 size-[520px] rounded-full bg-sun/12 blur-[120px]" />
        <div className="container-x relative pb-16 pt-10 sm:pt-14">
          {crumb}
          <div className="mt-10 grid items-center gap-14 lg:grid-cols-[1fr_1fr]">
            <div>
              {c.badge && <motion.span {...up()} className="inline-flex items-center gap-2 rounded-full bg-sun/10 px-3 py-1 text-[13px] font-bold text-sun-700"><Icon name="utensils" className="size-4" />{c.badge}</motion.span>}
              <motion.h1 {...up(0.05)} className="h-display mt-5">{c.title}</motion.h1>
              {c.subtitle && <motion.p {...up(0.1)} className="mt-4 text-[21px] font-bold leading-[1.8] sm:text-[24px]">{c.subtitle}</motion.p>}
              {c.lead && <motion.p {...up(0.15)} className="lead mt-4">{c.lead}</motion.p>}
              <motion.div {...up(0.2)}><Buttons items={c.buttons} theme="limofood" firstArrow={false} className="mt-9" override={(b, i) => (i === 0 ? "sun" : "outline")} /></motion.div>
              {chips.length > 0 && (
                <motion.ul {...up(0.25)} className="mt-9 flex flex-wrap gap-2">
                  {chips.map((t, i) => <li key={i} className="rounded-full border border-[#f3d3cf] bg-white px-3 py-1 text-[13px] font-semibold text-ink-2">{t.text}</li>)}
                </motion.ul>
              )}
            </div>
            <div className="relative sm:pb-24">
              <motion.div {...up(0.15)}><Framed image={c.image_main} title={c.image_main_title} className="shadow-[var(--shadow-lift)]" eager /></motion.div>
              <motion.div {...up(0.4)} className="absolute -bottom-2 -left-8 hidden w-[48%] max-w-[270px] sm:block" aria-hidden>
                <Float delay={0.5} duration={6.5}><OrderCard locale={ctx.locale} className="shadow-[var(--shadow-lift)]" status="new" /></Float>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // لیموسی
  return (
    <section className="relative overflow-hidden bg-limoc-cream pt-[72px]">
      <div aria-hidden className="pointer-events-none absolute -left-40 top-10 size-[560px] rounded-full bg-limoc/15 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute -right-32 bottom-0 size-[420px] rounded-full bg-limoc-sun/25 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgb(6_75_46/0.10)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(70%_60%_at_30%_40%,#000,transparent)]" />
      <div className="container-x relative pb-24 pt-10 sm:pt-14">
        {crumb}
        <div className="mt-10 grid items-center gap-16 lg:grid-cols-[0.9fr_1.3fr]">
          <div>
            {c.badge && (
              <motion.span {...up()} className="inline-flex items-center gap-2 rounded-full border border-limoc-sun/60 bg-limoc-sun/25 px-3 py-1 text-[13px] font-bold text-limoc-900">
                <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-limoc opacity-60 motion-reduce:hidden" /><span className="relative inline-flex size-2 rounded-full bg-limoc" /></span>
                {c.badge}
              </motion.span>
            )}
            <motion.h1 {...up(0.05)} className="h-display mt-5 text-limoc-ink">
              <Highlighted title={c.title} highlight={c.title_highlight} render={(h) => (
                <span className="relative inline-block text-limoc">
                  {h}
                  <svg aria-hidden viewBox="0 0 120 14" className="absolute -bottom-2 left-0 h-3 w-full" preserveAspectRatio="none">
                    <motion.path d="M2 9 C 30 2, 60 13, 118 5" fill="none" stroke="#fbc30e" strokeWidth="5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay: 0.6, ease }} />
                  </svg>
                </span>
              )} />
            </motion.h1>
            {c.lead && <motion.p {...up(0.1)} className="lead mt-6">{c.lead}</motion.p>}
            <motion.div {...up(0.18)}><Buttons items={c.buttons} theme="limoc" firstArrow={false} className="mt-9" /></motion.div>
            {chips.length > 0 && (
              <motion.ul {...up(0.24)} className="mt-8 grid gap-2 text-[14px] text-ink-2 sm:grid-cols-2">
                {chips.map((t, i) => <li key={i} className="flex items-center gap-2"><Check theme="limoc" />{t.text}</li>)}
              </motion.ul>
            )}
          </div>
          <div className="relative pb-10 [perspective:1600px]">
            <motion.div initial={{ opacity: 0, y: 40, rotateX: 14, rotateY: -8 }} animate={{ opacity: 1, y: 0, rotateX: 0, rotateY: 0 }} transition={{ duration: 1.2, delay: 0.15, ease }}>
              <Framed image={c.image_main} title={c.image_main_title} className="shadow-[0_50px_100px_-40px_rgb(6_75_46/0.45)]" eager />
            </motion.div>
            {c.image_secondary && (
              <motion.div {...up(0.55)} className="absolute -bottom-6 -left-6 hidden w-[50%] sm:block lg:-left-12">
                <Float duration={7}><Framed image={c.image_secondary} title={c.image_secondary_title} className="shadow-[0_40px_80px_-30px_rgb(6_75_46/0.5)]" /></Float>
              </motion.div>
            )}
            {floats.map((f, i) => (
              <motion.div key={i} {...up(0.8 + i * 0.15)} className={cn("absolute hidden md:block", i === 0 ? "-right-6 top-[30%] lg:-right-10" : "-bottom-2 right-[6%]")} aria-hidden>
                <Float delay={i ? 0.4 : 1.2} duration={i ? 6.5 : 5.5}>
                  <div className={cn("flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 shadow-[0_20px_40px_-20px_rgb(6_75_46/0.5)]", i === 0 ? "border border-limoc/15 bg-white/95 backdrop-blur" : "bg-limoc-ink text-white")}>
                    <span className={cn("grid size-8 place-items-center rounded-full", i === 0 ? "bg-limoc text-white" : "bg-limoc-sun text-limoc-ink")}><Icon name={f.icon ?? "check"} className="size-4" /></span>
                    <span className="text-[12.5px] leading-5"><b className={cn("block", i === 0 && "text-limoc-ink")}>{f.title}</b><span className={i === 0 ? "text-ink-3" : "text-white/60"}>{f.desc}</span></span>
                  </div>
                </Float>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export const breadcrumbLabel = (locale: SectionProps["ctx"]["locale"]) => ui("breadcrumb", locale);
