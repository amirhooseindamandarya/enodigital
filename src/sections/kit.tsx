/* ابزارهای مشترک کامپوننت‌های سکشن: تم، سطح، دکمه، تصویر، مسیر صفحه */
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { buttonVariants } from "@/components/ui/button";
import { Icon, type IconName } from "@/components/ui/icon";
import { BrowserFrame, PhoneFrame } from "@/components/mockups/frames";
import { JsonLd } from "@/lib/seo";
import type { ResolvedImage } from "@/cms/resolve";
import type { Locale, SiteData } from "@/cms/types";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* زمینهٔ رندر هر سکشن                                                 */
/* ------------------------------------------------------------------ */
export type Crumb = { label: string; href?: string };
export type SectionCtx = {
  site: SiteData;
  locale: Locale;
  dir: "rtl" | "ltr";
  /** گروه‌های سراسری حل‌شده در زبان جاری */
  g: Globals;
  pageKey: string;
  crumbs: Crumb[];
  siteUrl: string;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type C = Record<string, any>;
export type SectionProps = { c: C; ctx: SectionCtx };

export type LinkItem = { label: string; href: string; external?: boolean; style?: string; new_tab?: boolean };
export type Product = {
  key: string; name: string; category: string; audience: string; tagline: string; value: string;
  highlights: string; icon: IconName; theme: ThemeKey; page?: { key: string; href: string };
  cta_label: string; image?: ResolvedImage; image_title: string; dark_card?: boolean;
};
export type Project = {
  key: string; published?: boolean; name: string; problem: string; solution: string; result: string;
  tags: string; image?: ResolvedImage; frame?: "dark" | "light"; page?: { href: string }; url?: string;
};
export type Globals = {
  brand: C; header: C; footer: C;
  contact_info: { phone?: string; email?: string; address: string; hours: string; socials: { name: string; url: string }[]; form_link_label: string };
  products: { items: Product[] };
  projects: { items: Project[] };
};

/* ------------------------------------------------------------------ */
/* فهرست‌های richtext و پیوندهای تخت                                   */
/* ------------------------------------------------------------------ */
const decode = (s: string) => s.replace(/<[^>]+>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").trim();
/** آیتم‌های یک فهرست نقطه‌دار (richtext) به‌صورت آرایهٔ متن */
export function lis(html?: string): string[] {
  if (!html) return [];
  const items = [...html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map((m) => decode(m[1])).filter(Boolean);
  return items.length ? items : html.split(/<br\s*\/?>|<\/p>|\n/i).map(decode).filter(Boolean);
}
/** پیوند از فیلدهای تخت با پیشوند (مثل cta_label، cta_page، cta_anchor، cta_url) */
export function flatLink(o: C, prefix: string): LinkItem {
  const page = o[`${prefix}_page`] as { href: string } | undefined;
  const anchor = (o[`${prefix}_anchor`] as string | undefined)?.replace(/^#/, "");
  const url = o[`${prefix}_url`] as string | undefined;
  const href = page ? page.href + (anchor ? `#${anchor}` : "") : anchor ? `#${anchor}` : url ?? "";
  return { label: o[`${prefix}_label`] ?? "", href, external: !page && !anchor && !!url };
}

/* ------------------------------------------------------------------ */
/* تم‌ها و سطح‌ها                                                       */
/* ------------------------------------------------------------------ */
export type ThemeKey = "brand" | "limoc" | "limofood" | "benefits" | "custom";
export const themes: Record<ThemeKey, { accent: string; soft: string; solid: string; dot: string; onDark: string; iconDark: string; line: string; primary: string; secondary: string; ghost: string }> = {
  brand: { accent: "text-amber-ink", soft: "bg-amber/12", solid: "bg-amber", dot: "bg-amber", onDark: "text-[#f5b82e]", iconDark: "bg-amber/15 text-[#f5b82e]", line: "bg-amber", primary: "primary", secondary: "dark", ghost: "outline" },
  limoc: { accent: "text-limoc", soft: "bg-limoc/10", solid: "bg-limoc", dot: "bg-limoc", onDark: "text-limoc-sun", iconDark: "bg-limoc-sun text-limoc-ink", line: "bg-limoc", primary: "limocSun", secondary: "limoc", ghost: "limocOutline" },
  limofood: { accent: "text-sun-700", soft: "bg-sun/12", solid: "bg-sun", dot: "bg-sun", onDark: "text-[#ff8a9b]", iconDark: "bg-sun/20 text-[#ff8a9b]", line: "bg-sun", primary: "sun", secondary: "dark", ghost: "outline" },
  benefits: { accent: "text-teal-700", soft: "bg-teal/10", solid: "bg-teal", dot: "bg-teal", onDark: "text-teal", iconDark: "bg-teal/15 text-teal", line: "bg-teal", primary: "teal", secondary: "dark", ghost: "outline" },
  custom: { accent: "text-violet", soft: "bg-violet/10", solid: "bg-violet", dot: "bg-violet", onDark: "text-[#f5b82e]", iconDark: "bg-amber/15 text-[#f5b82e]", line: "bg-amber", primary: "primary", secondary: "dark", ghost: "outline" },
};
export const th = (key?: string) => themes[(key as ThemeKey) in themes ? (key as ThemeKey) : "brand"];

export const surfaces: Record<string, { cls: string; dark: boolean }> = {
  white: { cls: "bg-white", dark: false },
  paper: { cls: "bg-paper", dark: false },
  cream: { cls: "bg-limoc-cream", dark: false },
  rose: { cls: "bg-[#fff8f7]", dark: false },
  dark: { cls: "surface-dark", dark: true },
  limoc_dark: { cls: "surface-limoc", dark: true },
};
export const sf = (key?: string, fallback = "white") => surfaces[key ?? fallback] ?? surfaces[fallback];

/** پوستهٔ استاندارد هر سکشن */
export function Section({ c, fallback = "white", className, children, id }: { c: C; fallback?: string; className?: string; children: React.ReactNode; id?: string }) {
  const s = sf(c.surface, fallback);
  return (
    <section id={id ?? (c.anchor || undefined)} className={cn(s.cls, "relative overflow-hidden py-24 sm:py-28", className)}>
      <div className="container-x relative">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* عنوان سکشن                                                           */
/* ------------------------------------------------------------------ */
export function Heading({ c, dark, center, accent, className, as: H = "h2" }: { c: C; dark?: boolean; center?: boolean; accent?: string; className?: string; as?: "h1" | "h2" }) {
  if (!c.title && !c.eyebrow) return null;
  return (
    <div className={cn("max-w-[720px]", center && "mx-auto text-center", className)}>
      {c.eyebrow && (
        <Reveal y={8}>
          <p className={cn("eyebrow mb-4", accent ?? (dark ? "text-[#f5b82e]" : "text-amber-ink"), center && "justify-center")}>
            <span aria-hidden className={cn("h-px w-6 bg-current opacity-60", center && "hidden sm:inline-block")} />{c.eyebrow}
          </p>
        </Reveal>
      )}
      {c.title && <Reveal delay={0.05}><H className={cn(H === "h1" ? "h-display" : "h-section", dark && "text-white")}>{c.title}</H></Reveal>}
      {c.lead && <Reveal delay={0.12}><p className={cn("lead mt-4", dark && "text-white/65!")}>{c.lead}</p></Reveal>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* پیوند و دکمه                                                         */
/* ------------------------------------------------------------------ */
export function SmartLink({ href, external, newTab, className, children, ...rest }: { href: string; external?: boolean; newTab?: boolean; className?: string; children: React.ReactNode } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  if (!href) return <span className={className}>{children}</span>;
  if (external || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return <a href={href} className={className} {...(newTab || external ? { target: "_blank", rel: "noopener" } : {})} {...rest}>{children}</a>;
  }
  return <Link href={href} className={className} {...rest}>{children}</Link>;
}

type Variant = NonNullable<Parameters<typeof buttonVariants>[0]>["variant"];
export function variantFor(style: string | undefined, theme: string | undefined, dark: boolean): Variant {
  const t = th(theme);
  if (dark) {
    if (style === "ghost") return "ghostDark";
    if (style === "secondary") return "light";
    return (theme === "brand" || theme === "custom" || !theme ? "primary" : t.primary) as Variant;
  }
  return (style === "ghost" ? t.ghost : style === "secondary" ? t.secondary : t.primary) as Variant;
}

export function Buttons({ items, theme, dark, size = "lg", className, firstArrow = true, override }: { items?: LinkItem[]; theme?: string; dark?: boolean; size?: "sm" | "md" | "lg"; className?: string; firstArrow?: boolean; override?: (b: LinkItem, i: number) => Variant | undefined }) {
  const list = (items ?? []).filter((b) => b.label && b.href);
  if (!list.length) return null;
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:flex-wrap", className)}>
      {list.map((b, i) => (
        <SmartLink key={i} href={b.href} external={b.external} newTab={b.new_tab} className={buttonVariants({ variant: override?.(b, i) ?? variantFor(b.style, theme, !!dark), size })}>
          {b.label}
          {b.external ? <Icon name="external" /> : i === 0 && firstArrow && (b.style ?? "primary") === "primary" ? <Arrow /> : null}
        </SmartLink>
      ))}
    </div>
  );
}

/** فلش جهت‌دار: در فارسی/عربی به چپ، در انگلیسی به راست */
export function Arrow({ className, nudge }: { className?: string; nudge?: boolean }) {
  return <Icon name="arrow" className={cn("ltr:-scale-x-100", nudge && "transition-transform group-hover:-translate-x-1 ltr:group-hover:translate-x-1", className)} />;
}

export function Check({ theme, dark, className }: { theme?: string; dark?: boolean; className?: string }) {
  const t = th(theme);
  return <span className={cn("grid size-5 shrink-0 place-items-center rounded-full", dark ? "bg-white/10 text-white" : cn(t.soft, t.accent), className)}><Icon name="check" className="size-3" strokeWidth={3} /></span>;
}

/* ------------------------------------------------------------------ */
/* تصویر                                                                */
/* ------------------------------------------------------------------ */
export function Img({ image, className, eager }: { image?: ResolvedImage; className?: string; eager?: boolean }) {
  if (!image) return null;
  // تصاویر از CMS (یا پوشهٔ media) با آدرس مستقیم می‌آیند
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={image.src} alt={image.alt} className={cn("block h-auto w-full", className)} loading={eager ? "eager" : "lazy"} decoding="async" {...(eager ? { fetchPriority: "high" as const } : {})} />;
}

export function Framed({ image, frame = "browser", title, className, eager }: { image?: ResolvedImage; frame?: string; title?: string; className?: string; eager?: boolean }) {
  if (!image) return null;
  if (frame === "none") return <Img image={image} eager={eager} className={className} />;
  if (frame === "phone") return <PhoneFrame className={className}><Img image={image} eager={eager} /></PhoneFrame>;
  return <BrowserFrame dark={frame === "browser_dark"} title={title} className={className}><Img image={image} eager={eager} /></BrowserFrame>;
}

/* ------------------------------------------------------------------ */
/* مسیر صفحه                                                            */
/* ------------------------------------------------------------------ */
export function Breadcrumb({ ctx, dark, label }: { ctx: SectionCtx; dark?: boolean; label: string }) {
  const items = ctx.crumbs;
  if (items.length < 2) return null;
  return (
    <>
      <nav aria-label={label}>
        <ol className={cn("flex flex-wrap items-center gap-2 text-[13.5px]", dark ? "text-white/50" : "text-ink-3")}>
          {items.map((it, i) => (
            <li key={i} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden className={dark ? "text-white/25" : "text-line-2"}>/</span>}
              {it.href ? <Link href={it.href} className={dark ? "hover:text-white" : "hover:text-ink"}>{it.label}</Link> : <span aria-current="page" className={dark ? "text-white/80" : "text-ink-2"}>{it.label}</span>}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.label, item: it.href ? `${ctx.siteUrl}${it.href}` : undefined })),
      }} />
    </>
  );
}
