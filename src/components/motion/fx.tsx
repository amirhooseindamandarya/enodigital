"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

const ease = [0.2, 0.7, 0.2, 1] as const;

/** نمایش تصویر با «پرده» + حرکت آرام عمودی و کمی چرخش سه‌بعدی هنگام اسکرول */
export function ParallaxShot({ children, className, strength = 40, tilt = true }: { children: React.ReactNode; className?: string; strength?: number; tilt?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const y = useTransform(smooth, [0, 1], [strength, -strength]);
  const rotateX = useTransform(smooth, [0, 0.5, 1], tilt ? [8, 0, -4] : [0, 0, 0]);
  return (
    <div ref={ref} className={cn("[perspective:1400px]", className)}>
      <motion.div
        style={{ y, rotateX }}
        initial={{ opacity: 0, clipPath: "inset(12% 8% 12% 8% round 24px)", scale: 0.96 }}
        whileInView={{ opacity: 1, clipPath: "inset(0% 0% 0% 0% round 0px)", scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -80px 0px" }}
        transition={{ duration: 1.1, ease }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/** شناور شدن آرام (فقط برای عناصر کوچک تزئینی) */
export function Float({ children, className, delay = 0, duration = 6 }: { children: React.ReactNode; className?: string; delay?: number; duration?: number }) {
  return (
    <motion.div className={className} animate={{ y: [0, -8, 0] }} transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}>
      {children}
    </motion.div>
  );
}

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease } },
};

/** ورود پله‌ای فرزندان */
export function Stagger({ children, className, as = "div" }: { children: React.ReactNode; className?: string; as?: "div" | "ul" | "ol" }) {
  const M = motion[as];
  return (
    <M className={className} variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "0px 0px -60px 0px" }}>
      {children}
    </M>
  );
}

export function StaggerItem({ children, className, as = "div" }: { children: React.ReactNode; className?: string; as?: "div" | "li" }) {
  const M = motion[as];
  return <M className={className} variants={item}>{children}</M>;
}

/** خط پیشرفت که با اسکرول کشیده می‌شود (عمودی یا افقی) */
export function ScrollLine({ className, vertical, color = "bg-limoc" }: { className?: string; vertical?: boolean; color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  return (
    <div ref={ref} aria-hidden className={cn("overflow-hidden rounded-full bg-black/[0.06]", className)}>
      <motion.div className={cn("h-full w-full rounded-full", color, vertical ? "origin-top" : "origin-right")} style={vertical ? { scaleY: p } : { scaleX: p }} />
    </div>
  );
}

/** کارت با جابه‌جایی نرم سه‌بعدی بر اساس موقعیت ماوس */
export function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-y * 5).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x * 6).toFixed(2)}deg`);
    el.style.setProperty("--mx", `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${((y + 0.5) * 100).toFixed(1)}%`);
  };
  const onLeave = () => { const el = ref.current; if (!el) return; el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg"); };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      className={cn("group/tilt relative transition-transform duration-300 ease-out [transform:perspective(900px)_rotateX(var(--rx,0))_rotateY(var(--ry,0))] motion-reduce:transform-none", className)}>
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100 [background:radial-gradient(240px_circle_at_var(--mx,50%)_var(--my,50%),rgb(251_195_14/0.16),transparent_70%)]" />
      <div className="relative h-full">{children}</div>
    </div>
  );
}
