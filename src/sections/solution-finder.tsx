"use client";
import { useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "@/components/ui/icon";
import { buttonVariants } from "@/components/ui/button";
import { num } from "@/cms/i18n";
import { cn } from "@/lib/utils";
import { Arrow, Framed, Heading, SmartLink, th, type C, type SectionProps } from "./kit";

export function SolutionFinder({ c, ctx }: SectionProps) {
  const tabs = c.tabs as C[];
  const [active, setActive] = useState(0);
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const o = tabs[active];
  const rtl = ctx.dir === "rtl";

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const fwd = rtl ? "ArrowLeft" : "ArrowRight";
    const back = rtl ? "ArrowRight" : "ArrowLeft";
    const next = e.key === fwd ? i + 1 : e.key === back ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : null;
    if (next === null) return;
    e.preventDefault();
    const n = (next + tabs.length) % tabs.length;
    setActive(n);
    refs.current[n]?.focus();
  };
  if (!o) return null;
  const t = th(o.theme);

  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="container-x">
        <Heading c={c} center />
        <div role="tablist" className={cn("mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-2 rounded-2xl border border-line bg-paper p-2", tabs.length === 4 && "md:grid-cols-4", tabs.length === 3 && "md:grid-cols-3")}>
          {tabs.map((op, i) => {
            const selected = i === active;
            return (
              <button key={i} ref={(el) => { refs.current[i] = el; }} role="tab" id={`${id}-tab-${i}`} aria-selected={selected} aria-controls={`${id}-panel`} tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)} onKeyDown={(e) => onKey(e, i)}
                className={cn("relative flex min-h-[64px] items-center justify-center gap-2 rounded-xl px-3 py-3 text-[14px] font-bold transition-colors sm:text-[15px]", selected ? "text-ink" : "text-ink-3 hover:text-ink")}>
                {selected && <motion.span layoutId={`${id}-pill`} className="absolute inset-0 rounded-xl bg-white shadow-[var(--shadow-soft)] ring-1 ring-line" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                <span className="relative flex items-center gap-2"><Icon name={op.icon ?? "check"} className="size-[18px] shrink-0" />{op.label}</span>
              </button>
            );
          })}
        </div>
        <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${active}`} className="mx-auto mt-6 max-w-5xl overflow-hidden rounded-3xl border border-line bg-paper">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
              className="grid items-center gap-10 p-7 sm:p-10 md:grid-cols-[1.1fr_1fr]">
              <div>
                {o.badge && <span className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12.5px] font-bold", t.soft, t.accent)}>{o.badge}</span>}
                <h3 className="mt-4 text-[24px] font-extrabold leading-snug sm:text-[28px]">{o.title}</h3>
                {o.desc && <p className="mt-3 text-[15.5px] leading-8 text-ink-2">{o.desc}</p>}
                <ul className="mt-5 grid gap-2">
                  {(o.points as { text: string }[]).map((p, i) => <li key={i} className="flex items-center gap-2.5 text-[15px]"><Icon name="check" className="size-4 shrink-0 text-teal-700" strokeWidth={2.5} />{p.text}</li>)}
                </ul>
                {o.cta?.href && <SmartLink href={o.cta.href} className={cn(buttonVariants({ variant: "dark" }), "mt-8")}>{o.cta.label} <Arrow /></SmartLink>}
              </div>
              <div className="flex min-h-[260px] items-center justify-center">
                {o.visual === "steps" ? (
                  <div className="mx-auto grid w-full max-w-[340px] gap-2.5" aria-hidden>
                    {(o.steps as { text: string }[]).map((s, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 shadow-[var(--shadow-soft)]">
                        <span className={cn("grid size-7 place-items-center rounded-full text-[12px] font-bold", i < 2 ? "bg-violet text-white" : "bg-paper text-ink-3")}>{num(i + 1, ctx.locale)}</span>
                        <span className="text-[14px] font-semibold">{s.text}</span>
                      </div>
                    ))}
                  </div>
                ) : o.visual === "phone" ? (
                  <Framed image={o.image} frame="phone" className="mx-auto w-[210px]" />
                ) : (
                  <Framed image={o.image} title={o.frame_title} className="w-full shadow-[var(--shadow-lift)]" />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
