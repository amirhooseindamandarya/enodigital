"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronDown, Menu, X, ArrowLeft } from "lucide-react";
import { productList } from "@/lib/products";
import { mainNav, site } from "@/lib/site";
import { Icon } from "@/components/ui/icon";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";

/** مسیرهایی که بخش بالای صفحه‌شان تیره است */
const DARK_TOP = ["/", "/services/custom-software", "/products/benefits", "/about"];
const norm = (p: string) => (p.length > 1 ? p.replace(/\/$/, "") : p);

export function Header() {
  const pathname = norm(usePathname() || "/");
  const darkTop = DARK_TOP.includes(pathname);
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const megaRef = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 30, mass: 0.3 });
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onDown); };
  }, [mega]);

  const onDark = darkTop && !scrolled && !mega;
  const openMega = () => { if (closeTimer.current) clearTimeout(closeTimer.current); setMega(true); };
  const closeMegaSoon = () => { closeTimer.current = setTimeout(() => setMega(false), 140); };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300",
        onDark ? "border-b border-transparent bg-transparent" : "border-b border-line/80 bg-white/90 shadow-[0_1px_0_rgb(13_21_48/0.02)] backdrop-blur-xl",
      )}
    >
      <motion.div aria-hidden style={{ scaleX: progress }} className="absolute inset-x-0 bottom-[-1px] h-[2px] origin-right bg-gradient-to-l from-amber to-[#ffd36b]" />
      <nav aria-label="منوی اصلی" className="container-x flex h-[72px] items-center justify-between gap-6">
        <Logo dark={onDark} />

        <ul className="hidden items-center gap-1 lg:flex">
          <li ref={megaRef} className="relative" onMouseEnter={openMega} onMouseLeave={closeMegaSoon}>
            <button
              type="button"
              aria-expanded={mega}
              aria-controls="mega-products"
              onClick={(e) => (e.detail > 0 ? setMega(true) : setMega((v) => !v))}
              className={cn("flex items-center gap-1 rounded-lg px-3.5 py-2 text-[15px] font-medium transition-colors",
                onDark ? "text-white/80 hover:text-white" : "text-ink-2 hover:text-ink", mega && "text-ink")}
            >
              محصولات
              <ChevronDown aria-hidden className={cn("size-4 transition-transform duration-300", mega && "rotate-180")} />
            </button>
            <AnimatePresence>
              {mega && (
                <motion.div
                  id="mega-products"
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
                  className="absolute top-[calc(100%+14px)] start-[-24px] w-[760px] origin-top-right overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-lift)]"
                >
                  <div className="grid grid-cols-[1fr_230px]">
                    <div className="grid gap-1 p-3">
                      {productList.map((p) => (
                        <Link key={p.slug} href={p.href} className="group flex gap-4 rounded-xl p-4 transition-colors hover:bg-paper">
                          <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl", p.theme.bg, p.theme.accent)}>
                            <Icon name={p.icon} className="size-5" />
                          </span>
                          <span className="min-w-0">
                            <span className="flex items-center gap-2 font-bold text-ink">
                              {p.name}
                              <ArrowLeft aria-hidden className="size-4 -translate-x-0 text-ink-3 opacity-0 transition-all group-hover:-translate-x-1 group-hover:opacity-100" />
                            </span>
                            <span className="block text-[13.5px] leading-6 text-ink-3">{p.category}</span>
                            <span className="mt-1 block text-[14px] leading-6 text-ink-2">{p.tagline}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                    <div className="flex flex-col justify-between border-s border-line bg-paper p-5">
                      <div>
                        <p className="text-[12.5px] font-bold text-ink-3">راهکار اختصاصی</p>
                        <p className="mt-2 font-bold">نیاز شما خارج از محصولات آماده است؟</p>
                        <p className="mt-1 text-[14px] leading-6 text-ink-2">سامانهٔ متناسب با فرایند شما را طراحی و توسعه می‌دهیم.</p>
                      </div>
                      <div className="mt-6 grid gap-2">
                        <ButtonLink href="/services/custom-software/" variant="dark" size="sm">نرم‌افزار سفارشی</ButtonLink>
                        <ButtonLink href="/products/" variant="outline" size="sm">همهٔ محصولات</ButtonLink>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
          {mainNav.slice(0, 4).map((item) => {
            const active = pathname.startsWith(norm(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn("rounded-lg px-3.5 py-2 text-[15px] font-medium transition-colors",
                    onDark ? "text-white/80 hover:text-white" : "text-ink-2 hover:text-ink", active && (onDark ? "text-white" : "text-ink"))}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <ButtonLink href="/contact/" variant={onDark ? "light" : "primary"} size="sm" className="hidden sm:inline-flex">
            درخواست مشاوره
          </ButtonLink>

          <Dialog.Root open={mobile} onOpenChange={setMobile}>
            <Dialog.Trigger asChild>
              <button type="button" aria-label="باز کردن منو" className={cn("grid size-11 place-items-center rounded-xl border lg:hidden",
                onDark ? "border-white/15 text-white" : "border-line-2 text-ink")}>
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
                    <motion.div
                      dir="rtl"
                      className="fixed inset-y-0 right-0 z-[70] flex w-[min(420px,100%)] flex-col bg-white shadow-2xl"
                      initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                      transition={{ type: "tween", duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
                    >
                      <div className="flex h-[72px] items-center justify-between border-b border-line px-5">
                        <Dialog.Title asChild><span><Logo /></span></Dialog.Title>
                        <Dialog.Close aria-label="بستن منو" className="grid size-11 place-items-center rounded-xl border border-line-2"><X className="size-5" aria-hidden /></Dialog.Close>
                      </div>
                      <Dialog.Description className="sr-only">منوی پیمایش سایت</Dialog.Description>
                      <div className="flex-1 overflow-y-auto px-5 py-6">
                        <p className="mb-3 text-[13px] font-bold text-ink-3">محصولات</p>
                        <div className="grid gap-2">
                          {productList.map((p) => (
                            <Link key={p.slug} href={p.href} className="flex items-center gap-3 rounded-2xl border border-line p-3.5 active:bg-paper">
                              <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl", p.theme.bg, p.theme.accent)}><Icon name={p.icon} className="size-5" /></span>
                              <span><span className="block font-bold">{p.name}</span><span className="block text-[13px] leading-6 text-ink-3">{p.category}</span></span>
                            </Link>
                          ))}
                        </div>
                        <ul className="mt-6 divide-y divide-line border-y border-line">
                          <li><Link href="/products/" className="flex items-center justify-between py-4 text-[16px] font-semibold">همهٔ محصولات<ArrowLeft className="size-4 text-ink-3" aria-hidden /></Link></li>
                          {mainNav.map((item) => (
                            <li key={item.href}><Link href={item.href} className="flex items-center justify-between py-4 text-[16px] font-semibold">{item.label}<ArrowLeft className="size-4 text-ink-3" aria-hidden /></Link></li>
                          ))}
                        </ul>
                      </div>
                      <div className="border-t border-line p-5">
                        <ButtonLink href="/contact/" className="w-full" size="lg">درخواست مشاوره</ButtonLink>
                        <p className="mt-3 text-center text-[13px] text-ink-3">{site.name}</p>
                      </div>
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
