"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronDown, Globe, Menu, UserRound, X } from "lucide-react";
import { Icon, type IconName } from "@/components/ui/icon";
import { buttonVariants } from "@/components/ui/button";
import type { ResolvedMenuItem } from "@/cms/resolve";
import type { Locale } from "@/cms/types";
import { cn } from "@/lib/utils";
import { Logo, type LogoData } from "./logo";

export type HeaderProduct = { key: string; name: string; category: string; tagline: string; icon: IconName; href: string; soft: string; accent: string };
export type HeaderProps = {
  locale: Locale;
  dir: "rtl" | "ltr";
  darkTop: boolean;
  homeHref: string;
  logo: LogoData;
  nav: ResolvedMenuItem[];
  products: HeaderProduct[];
  cta?: { label: string; href: string };
  mega: { eyebrow: string; title: string; desc: string; buttons: { label: string; href: string; style?: string }[] };
  languages: { locale: Locale; href: string; name: string }[];
  account: { href: string; label: string };
  t: { mainNav: string; openMenu: string; closeMenu: string; siteNav: string; language: string; home: string };
};

const norm = (p: string) => (p.length > 1 ? p.replace(/\/$/, "") : p);
const SHORT: Record<Locale, string> = { fa: "فا", en: "EN", ar: "ع" };

function Arrow({ className }: { className?: string }) {
  return <Icon name="arrow" className={cn("ltr:-scale-x-100", className)} />;
}

function LangSwitch({ p, onDark }: { p: HeaderProps; onDark: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close); document.addEventListener("keydown", key);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", key); };
  }, [open]);
  if (p.languages.length < 2) return null;
  return (
    <div ref={ref} className="relative hidden sm:block">
      <button type="button" aria-expanded={open} aria-label={p.t.language} onClick={() => setOpen((v) => !v)}
        className={cn("flex h-10 items-center gap-1.5 rounded-xl px-2.5 text-[13.5px] font-bold transition-colors", onDark ? "text-white/80 hover:bg-white/10 hover:text-white" : "text-ink-2 hover:bg-paper hover:text-ink")}>
        <Globe className="size-4" aria-hidden />{SHORT[p.locale]}
      </button>
      {open && (
        <ul className="absolute end-0 top-[calc(100%+8px)] z-10 min-w-[150px] overflow-hidden rounded-xl border border-line bg-white p-1 shadow-[var(--shadow-lift)]">
          {p.languages.map((l) => (
            <li key={l.locale}>
              <a href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${l.href}`} hrefLang={l.locale} lang={l.locale} aria-current={l.locale === p.locale ? "true" : undefined}
                className={cn("flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-[14px] font-semibold text-ink-2 hover:bg-paper hover:text-ink", l.locale === p.locale && "bg-paper text-ink")}>
                {l.name}<span className="text-[12px] text-ink-3">{SHORT[l.locale]}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function Header(p: HeaderProps) {
  const pathname = norm(usePathname() || "/");
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const megaRef = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 30, mass: 0.3 });
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rtl = p.dir === "rtl";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => { setMega(false); setMobile(false); }, [pathname]);
  useEffect(() => {
    if (!mega) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMega(false);
    const onDown = (e: MouseEvent) => { if (megaRef.current && !megaRef.current.contains(e.target as Node)) setMega(false); };
    document.addEventListener("keydown", onKey); document.addEventListener("mousedown", onDown);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onDown); };
  }, [mega]);

  const onDark = p.darkTop && !scrolled && !mega;
  const openMega = () => { if (closeTimer.current) clearTimeout(closeTimer.current); setMega(true); };
  const closeMegaSoon = () => { closeTimer.current = setTimeout(() => setMega(false), 140); };
  const megaItem = p.nav.find((n) => n.children.length > 0);
  const flat = p.nav.filter((n) => n !== megaItem && n.href);
  const isActive = (href: string) => { const h = norm(href); return h !== norm(p.homeHref) && pathname.startsWith(h); };

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300",
      onDark ? "border-b border-transparent bg-transparent" : "border-b border-line/80 bg-white/90 shadow-[0_1px_0_rgb(13_21_48/0.02)] backdrop-blur-xl")}>
      <motion.div aria-hidden style={{ scaleX: progress }} className={cn("absolute inset-x-0 bottom-[-1px] h-[2px] bg-gradient-to-l from-amber to-[#ffd36b]", rtl ? "origin-right" : "origin-left")} />
      <nav aria-label={p.t.mainNav} className="container-x flex h-[72px] items-center justify-between gap-6">
        <Logo data={p.logo} href={p.homeHref} dark={onDark} label={`${p.logo.name} — ${p.t.home}`} />

        <ul className="hidden items-center gap-1 lg:flex">
          {megaItem && (
            <li ref={megaRef} className="relative" onMouseEnter={openMega} onMouseLeave={closeMegaSoon}>
              <button type="button" aria-expanded={mega} aria-controls="mega-products" onClick={(e) => (e.detail > 0 ? setMega(true) : setMega((v) => !v))}
                className={cn("flex items-center gap-1 rounded-lg px-3.5 py-2 text-[15px] font-medium transition-colors", onDark ? "text-white/80 hover:text-white" : "text-ink-2 hover:text-ink", mega && "text-ink")}>
                {megaItem.label}
                <ChevronDown aria-hidden className={cn("size-4 transition-transform duration-300", mega && "rotate-180")} />
              </button>
              <AnimatePresence>
                {mega && (
                  <motion.div id="mega-products" initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.98 }} transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
                    className={cn("absolute start-[-24px] top-[calc(100%+14px)] w-[760px] overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-lift)]", rtl ? "origin-top-right" : "origin-top-left")}>
                    <div className="grid grid-cols-[1fr_230px]">
                      <div className="grid gap-1 p-3">
                        {p.products.map((x) => (
                          <Link key={x.key} href={x.href} className="group flex gap-4 rounded-xl p-4 transition-colors hover:bg-paper">
                            <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl", x.soft, x.accent)}><Icon name={x.icon} className="size-5" /></span>
                            <span className="min-w-0">
                              <span className="flex items-center gap-2 font-bold text-ink">{x.name}<Arrow className="size-4 text-ink-3 opacity-0 transition-all group-hover:opacity-100" /></span>
                              <span className="block text-[13.5px] leading-6 text-ink-3">{x.category}</span>
                              <span className="mt-1 block text-[14px] leading-6 text-ink-2">{x.tagline}</span>
                            </span>
                          </Link>
                        ))}
                      </div>
                      <div className="flex flex-col justify-between border-s border-line bg-paper p-5">
                        <div>
                          <p className="text-[12.5px] font-bold text-ink-3">{p.mega.eyebrow}</p>
                          <p className="mt-2 font-bold">{p.mega.title}</p>
                          <p className="mt-1 text-[14px] leading-6 text-ink-2">{p.mega.desc}</p>
                        </div>
                        <div className="mt-6 grid gap-2">
                          {p.mega.buttons.map((b, i) => <Link key={i} href={b.href} className={buttonVariants({ variant: b.style === "ghost" ? "outline" : "dark", size: "sm" })}>{b.label}</Link>)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          )}
          {flat.slice(0, 4).map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link href={item.href} aria-current={active ? "page" : undefined}
                  className={cn("rounded-lg px-3.5 py-2 text-[15px] font-medium transition-colors", onDark ? "text-white/80 hover:text-white" : "text-ink-2 hover:text-ink", active && (onDark ? "text-white" : "text-ink"))}>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1.5">
          <LangSwitch p={p} onDark={onDark} />
          <a href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${p.account.href}`} aria-label={p.account.label} title={p.account.label}
            className={cn("hidden h-10 items-center gap-1.5 rounded-xl px-2.5 text-[13.5px] font-bold transition-colors sm:flex", onDark ? "text-white/80 hover:bg-white/10 hover:text-white" : "text-ink-2 hover:bg-paper hover:text-ink")}>
            <UserRound className="size-[18px]" aria-hidden /><span className="hidden xl:inline">{p.account.label}</span>
          </a>
          {p.cta && <Link href={p.cta.href} className={cn(buttonVariants({ variant: onDark ? "light" : "primary", size: "sm" }), "hidden sm:inline-flex")}>{p.cta.label}</Link>}

          <Dialog.Root open={mobile} onOpenChange={setMobile}>
            <Dialog.Trigger asChild>
              <button type="button" aria-label={p.t.openMenu} className={cn("grid size-11 place-items-center rounded-xl border lg:hidden", onDark ? "border-white/15 text-white" : "border-line-2 text-ink")}>
                <Menu className="size-5" aria-hidden />
              </button>
            </Dialog.Trigger>
            <AnimatePresence>
              {mobile && (
                <Dialog.Portal forceMount>
                  <Dialog.Overlay asChild>
                    <motion.div className="fixed inset-0 z-[60] bg-navy/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                  </Dialog.Overlay>
                  <Dialog.Content asChild>
                    <motion.div dir={p.dir} lang={p.locale}
                      className={cn("fixed inset-y-0 z-[70] flex w-[min(420px,100%)] flex-col bg-white shadow-2xl", rtl ? "right-0" : "left-0")}
                      initial={{ x: rtl ? "100%" : "-100%" }} animate={{ x: 0 }} exit={{ x: rtl ? "100%" : "-100%" }}
                      transition={{ type: "tween", duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}>
                      <div className="flex h-[72px] items-center justify-between border-b border-line px-5">
                        <Dialog.Title asChild><span><Logo data={p.logo} href={p.homeHref} label={p.logo.name} /></span></Dialog.Title>
                        <Dialog.Close aria-label={p.t.closeMenu} className="grid size-11 place-items-center rounded-xl border border-line-2"><X className="size-5" aria-hidden /></Dialog.Close>
                      </div>
                      <Dialog.Description className="sr-only">{p.t.siteNav}</Dialog.Description>
                      <div className="flex-1 overflow-y-auto px-5 py-6">
                        {megaItem && <p className="mb-3 text-[13px] font-bold text-ink-3">{megaItem.label}</p>}
                        <div className="grid gap-2">
                          {p.products.map((x) => (
                            <Link key={x.key} href={x.href} className="flex items-center gap-3 rounded-2xl border border-line p-3.5 active:bg-paper">
                              <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl", x.soft, x.accent)}><Icon name={x.icon} className="size-5" /></span>
                              <span><span className="block font-bold">{x.name}</span><span className="block text-[13px] leading-6 text-ink-3">{x.category}</span></span>
                            </Link>
                          ))}
                        </div>
                        <ul className="mt-6 divide-y divide-line border-y border-line">
                          {p.mega.buttons.filter((b) => b.style === "ghost").map((b, i) => (
                            <li key={`m${i}`}><Link href={b.href} className="flex items-center justify-between py-4 text-[16px] font-semibold">{b.label}<Arrow className="size-4 text-ink-3" /></Link></li>
                          ))}
                          {flat.map((item) => (
                            <li key={item.href}><Link href={item.href} className="flex items-center justify-between py-4 text-[16px] font-semibold">{item.label}<Arrow className="size-4 text-ink-3" /></Link></li>
                          ))}
                        </ul>
                        {p.languages.length > 1 && (
                          <div className="mt-6">
                            <p className="mb-3 flex items-center gap-2 text-[13px] font-bold text-ink-3"><Globe className="size-4" aria-hidden />{p.t.language}</p>
                            <div className="grid grid-cols-3 gap-2">
                              {p.languages.map((l) => (
                                <a key={l.locale} href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${l.href}`} hrefLang={l.locale} lang={l.locale}
                                  className={cn("rounded-xl border px-3 py-2.5 text-center text-[14px] font-semibold", l.locale === p.locale ? "border-navy bg-navy text-white" : "border-line text-ink-2")}>{l.name}</a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="border-t border-line p-5 pb-0">
                        <a href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${p.account.href}`} className="flex h-12 items-center justify-center gap-2 rounded-xl border border-line-2 text-[15px] font-bold"><UserRound className="size-[18px]" aria-hidden />{p.account.label}</a>
                      </div>
                      {p.cta && (
                        <div className="border-t border-line p-5">
                          <Link href={p.cta.href} className={cn(buttonVariants({ size: "lg" }), "w-full")}>{p.cta.label}</Link>
                        </div>
                      )}
                    </motion.div>
                  </Dialog.Content>
                </Dialog.Portal>
              )}
            </AnimatePresence>
          </Dialog.Root>
        </div>
      </nav>
    </header>
  );
}
