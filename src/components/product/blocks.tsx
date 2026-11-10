import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { Float, ParallaxShot, ScrollLine, TiltCard } from "@/components/motion/fx";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section";
import { FaqList } from "@/components/ui/accordion";
import { LeadForm } from "@/components/forms/lead-form";
import { JsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { productList, type Product } from "@/lib/products";
import { cn } from "@/lib/utils";

export function Breadcrumb({ items, dark }: { items: { href?: string; label: string }[]; dark?: boolean }) {
  return (
    <>
      <nav aria-label="مسیر صفحه">
        <ol className={cn("flex flex-wrap items-center gap-2 text-[13.5px]", dark ? "text-white/50" : "text-ink-3")}>
          {items.map((it, i) => (
            <li key={it.label} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden className={dark ? "text-white/25" : "text-line-2"}>/</span>}
              {it.href ? <Link href={it.href} className={dark ? "hover:text-white" : "hover:text-ink"}>{it.label}</Link> : <span aria-current="page" className={dark ? "text-white/80" : "text-ink-2"}>{it.label}</span>}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.label, item: it.href ? `${site.url}${it.href}` : undefined })),
      }} />
    </>
  );
}

export function ProblemSection({ p }: { p: Product }) {
  return (
    <section className="bg-white py-24 sm:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <Reveal>
          <p className={cn("eyebrow mb-4", p.theme.accent)}>مسئله</p>
          <h2 className="h-section">{p.problem.title}</h2>
        </Reveal>
        <ul className="grid gap-3">
          {p.problem.points.map((pt, i) => (
            <Reveal as="li" key={pt} delay={i * 0.07} className="flex items-start gap-4 rounded-2xl border border-line bg-paper/60 p-5 transition-[transform,box-shadow] duration-300 hover:-translate-x-1 hover:shadow-[var(--shadow-soft)]">
              <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-white text-[#d6455d] ring-1 ring-line"><Icon name="x" className="size-3.5" strokeWidth={2.5} /></span>
              <span className="text-[16px] leading-8">{pt}</span>
            </Reveal>
          ))}
          <Reveal as="li" delay={0.25} className={cn("flex items-start gap-4 rounded-2xl p-5", p.theme.bg)}>
            <span className={cn("mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-white ring-1 ring-line", p.theme.accent)}><Icon name="check" className="size-3.5" strokeWidth={2.5} /></span>
            <span className="text-[16px] font-bold leading-8">{p.tagline}</span>
          </Reveal>
        </ul>
      </div>
    </section>
  );
}

export function FeatureGrid({ p, title, dark, columns = 3 }: { p: Product; title?: string; dark?: boolean; columns?: 3 | 4 }) {
  return (
    <section className={cn("py-24 sm:py-28", dark ? "surface-dark" : "bg-paper")}>
      <div className="container-x">
        <SectionHeading dark={dark} eyebrow="امکانات کلیدی" eyebrowClass={dark ? "text-teal!" : p.theme.accent} title={title ?? `هر آنچه ${p.name} در اختیار تیم شما می‌گذارد`} />
        <ul className={cn("mt-14 grid gap-4 sm:grid-cols-2", columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
          {p.features.map((f, i) => (
            <Reveal as="li" key={f.title} delay={(i % 3) * 0.06}>
              <TiltCard className={cn("h-full rounded-2xl border p-6 transition-[border-color,box-shadow] duration-300",
                dark ? "border-white/10 bg-white/[0.035] hover:border-white/25" : "border-line bg-white hover:border-line-2 hover:shadow-[var(--shadow-lift)]")}>
                <span className={cn("mb-4 grid size-11 place-items-center rounded-xl transition-transform duration-300 group-hover/tilt:-translate-y-0.5 group-hover/tilt:scale-110", dark ? "bg-teal/15 text-teal" : cn(p.theme.bg, p.theme.accent))}><Icon name={f.icon} className="size-5" /></span>
                <h3 className={cn("text-[17px] font-extrabold", dark && "text-white")}>{f.title}</h3>
                <p className={cn("mt-1.5 text-[14.5px] leading-7", dark ? "text-white/60" : "text-ink-2")}>{f.desc}</p>
              </TiltCard>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Audience({ p, title }: { p: Product; title?: string }) {
  return (
    <section className="bg-white py-24 sm:py-28">
      <div className="container-x">
        <SectionHeading eyebrow="کاربران و صنایع هدف" eyebrowClass={p.theme.accent} title={title ?? `${p.name} برای چه کسانی است؟`} />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {p.industries.map((it, i) => (
            <Reveal key={it.title} delay={i * 0.08}>
              <TiltCard className="h-full rounded-2xl border border-line bg-white p-7 transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]">
                <span className={cn("mb-5 grid size-12 place-items-center rounded-2xl transition-transform duration-300 group-hover/tilt:rotate-[-6deg] group-hover/tilt:scale-110", p.theme.bg, p.theme.accent)}><Icon name={it.icon} className="size-6" /></span>
                <h3 className="text-[18px] font-extrabold">{it.title}</h3>
                <p className="mt-1 text-[15px] text-ink-2">{it.desc}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks({ p, title }: { p: Product; title?: string }) {
  return (
    <section className="bg-paper py-24 sm:py-28">
      <div className="container-x">
        <SectionHeading eyebrow="نحوهٔ کار" eyebrowClass={p.theme.accent} title={title ?? "چطور کار می‌کند؟"} />
        <ScrollLine color={p.theme.solid} className="mt-14 h-1" />
        <ol className="mt-4 grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-5">
          {p.steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.08} className="group bg-white p-6 transition-colors duration-300 hover:bg-paper">
              <span className={cn("inline-grid size-9 place-items-center rounded-full text-[13px] font-extrabold transition-transform duration-300 group-hover:scale-110", p.theme.bg, p.theme.accent)}>{(i + 1).toLocaleString("fa-IR")}</span>
              <h3 className="mt-3 text-[16.5px] font-extrabold">{s.title}</h3>
              <p className="mt-1.5 text-[14px] leading-7 text-ink-2">{s.desc}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ProductFaq({ p }: { p: Product }) {
  return (
    <section className="bg-white py-24 sm:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading eyebrow="سؤالات متداول" eyebrowClass={p.theme.accent} title={`پرسش‌های رایج دربارهٔ ${p.name}`} />
        <FaqList items={p.faqs} />
      </div>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: p.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }} />
    </section>
  );
}

export function DemoSection({ p, title, lead, surface = "surface-dark" }: { p: Product; title: string; lead: string; surface?: string }) {
  return (
    <section id="demo" className="bg-white pb-24 sm:pb-28">
      <div className="container-x">
        <div className={cn(surface, "relative grid gap-12 overflow-hidden rounded-[2rem] p-7 text-white sm:p-12 lg:grid-cols-[0.9fr_1.1fr] lg:p-16")}>
          <div aria-hidden className="grid-lines pointer-events-none absolute inset-0" />
          <div className="relative">
            <span className={cn("inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[12.5px] font-bold text-white/80")}><i className={cn("size-2 rounded-full", p.theme.dot)} />{p.name}</span>
            <h2 className="h-section mt-5">{title}</h2>
            <p className="lead mt-4 text-white/65!">{lead}</p>
            {p.externalUrl && (
              <a href={p.externalUrl} target="_blank" rel="noopener" className="mt-8 inline-flex items-center gap-2 text-[15px] font-bold text-white/80 hover:text-white">
                {p.cta.secondary ?? "وب‌سایت محصول"} <Icon name="external" className="size-4" />
              </a>
            )}
          </div>
          <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
            <LeadForm variant="demo" product={p.name} dark submitLabel={p.cta.primary} />
          </div>
        </div>
      </div>
    </section>
  );
}

export function OtherProducts({ current }: { current: Product["slug"] }) {
  const others = productList.filter((x) => x.slug !== current);
  return (
    <section className="border-t border-line bg-paper py-16">
      <div className="container-x">
        <p className="mb-6 text-[14px] font-bold text-ink-3">سایر محصولات</p>
        <div className="grid gap-4 md:grid-cols-3">
          {others.map((o) => (
            <Link key={o.slug} href={o.href} className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-5 transition-shadow hover:shadow-[var(--shadow-soft)]">
              <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl", o.theme.bg, o.theme.accent)}><Icon name={o.icon} className="size-5" /></span>
              <span className="min-w-0 flex-1"><span className="block font-extrabold">{o.name}</span><span className="block truncate text-[13.5px] text-ink-3">{o.category}</span></span>
              <Icon name="arrow" className="size-4 text-ink-3 transition-transform group-hover:-translate-x-1" />
            </Link>
          ))}
          <Link href="/services/custom-software/" className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-5 transition-shadow hover:shadow-[var(--shadow-soft)]">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-violet/10 text-violet"><Icon name="code" className="size-5" /></span>
            <span className="min-w-0 flex-1"><span className="block font-extrabold">نرم‌افزار سفارشی</span><span className="block truncate text-[13.5px] text-ink-3">راهکار اختصاصی برای فرایند شما</span></span>
            <Icon name="arrow" className="size-4 text-ink-3 transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function SoftwareJsonLd({ p }: { p: Product }) {
  return <JsonLd data={{
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: p.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    inLanguage: "fa-IR",
    description: p.seo.description,
    url: `${site.url}${p.href}`,
    featureList: p.features.map((f) => f.title),
    publisher: { "@type": "Organization", name: site.name, url: site.url },
  }} />;
}
