/* سکشن‌های عمومی و قابل استفاده در همهٔ صفحات */
import { Reveal } from "@/components/motion/reveal";
import { ScrollLine, Stagger, StaggerItem, TiltCard } from "@/components/motion/fx";
import { Icon } from "@/components/ui/icon";
import { FaqList } from "@/components/ui/accordion";
import { JsonLd } from "@/lib/seo";
import { num, ui } from "@/cms/i18n";
import { cn } from "@/lib/utils";
import { Breadcrumb, Buttons, Check, Heading, Section, SmartLink, sf, th, type C, type SectionProps } from "./kit";
import { buttonVariants } from "@/components/ui/button";

/* ---------------- سربرگ صفحه ---------------- */
export function PageHeader({ c, ctx }: SectionProps) {
  const dark = c.surface === "dark";
  const tiles = (c.tiles ?? []) as { icon: never; title: string }[];
  return (
    <section className={cn("relative overflow-hidden pt-[72px]", dark ? "surface-dark" : "bg-paper")}>
      {dark && <div aria-hidden className="grid-lines pointer-events-none absolute inset-0" />}
      <div className="container-x relative pb-20 pt-10 sm:pb-24 sm:pt-14">
        <Breadcrumb ctx={ctx} dark={dark} label={ui("breadcrumb", ctx.locale)} />
        <div className={cn("mt-10 grid items-end gap-12", tiles.length && "lg:grid-cols-[1.2fr_0.8fr]")}>
          <div className="max-w-3xl">
            {c.eyebrow && <p className={cn("eyebrow mb-5", dark ? "text-[#f5b82e]" : "text-amber-ink")}>{c.eyebrow}</p>}
            <h1 className={cn("h-display", dark && "text-white")}>{c.title}</h1>
            {c.lead && <p className={cn("mt-6 max-w-2xl text-[17px] leading-[2] sm:text-[19px]", dark ? "text-white/70" : "text-ink-2")}>{c.lead}</p>}
            <Buttons items={c.buttons} dark={dark} className="mt-9" />
          </div>
          {tiles.length > 0 && (
            <ul className="grid grid-cols-2 gap-3">
              {tiles.map((s, i) => (
                <li key={i} className={cn("rounded-2xl p-4 transition-[transform,background-color] duration-300 hover:-translate-y-1", dark ? "glass hover:bg-white/10" : "border border-line bg-white")}>
                  <Icon name={s.icon} className={cn("size-5", dark ? "text-[#f5b82e]" : "text-amber-ink")} />
                  <p className={cn("mt-3 text-[14.5px] font-bold", dark && "text-white")}>{s.title}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------------- متن آزاد ---------------- */
export function RichText({ c }: SectionProps) {
  const s = sf(c.surface);
  return (
    <Section c={c}>
      <Heading c={c} dark={s.dark} />
      <div className={cn("prose-rich mt-8 max-w-3xl", s.dark && "text-white/80")} dangerouslySetInnerHTML={{ __html: c.body }} />
    </Section>
  );
}

/* ---------------- بنر دعوت ---------------- */
export function CtaBanner({ c }: SectionProps) {
  return (
    <section className="bg-white pb-24 pt-4 sm:pb-32">
      <div className="container-x">
        <Reveal>
          <div className="surface-dark relative overflow-hidden rounded-[2rem] px-7 py-16 text-center sm:px-16 sm:py-20">
            <div aria-hidden className="grid-lines pointer-events-none absolute inset-0" />
            <div aria-hidden className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[640px] -translate-x-1/2 rounded-full bg-amber/25 blur-[100px]" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="h-section text-white">{c.title}</h2>
              {c.lead && <p className="lead mt-5 text-white/65!">{c.lead}</p>}
              <Buttons items={c.buttons} dark className="mt-10 justify-center" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- شبکهٔ کارت‌ها ---------------- */
export function FeatureGrid({ c, ctx }: SectionProps) {
  const s = sf(c.surface, "paper");
  const t = th(c.theme);
  const cols = c.columns === "2" ? "md:grid-cols-2" : c.columns === "4" ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3";
  const center = c.align === "center";
  return (
    <Section c={c} fallback="paper">
      <Heading c={c} dark={s.dark} center={center} accent={s.dark ? t.onDark : t.accent} />
      <Stagger className={cn("mt-14 grid gap-4", cols)}>
        {(c.items as { icon: never; title: string; desc: string }[]).map((f, i) => (
          <StaggerItem key={i}>
            <TiltCard className={cn("h-full rounded-2xl border p-7 transition-[border-color,box-shadow] duration-300",
              s.dark ? "border-white/10 bg-white/[0.035] hover:border-white/25" : "border-line bg-white hover:border-line-2 hover:shadow-[var(--shadow-lift)]")}>
              {c.number_prefix ? (
                <span className={cn("relative text-[13px] font-extrabold", s.dark ? t.onDark : t.accent)}>{`${c.number_prefix} ${num(i + 1, ctx.locale)}`}</span>
              ) : (
                <span className={cn("relative mb-5 grid size-11 place-items-center rounded-xl transition-transform duration-300 group-hover/tilt:-translate-y-0.5 group-hover/tilt:scale-110", s.dark ? t.iconDark : cn(t.soft, t.accent))}>
                  <Icon name={f.icon ?? "check"} className="size-5" />
                </span>
              )}
              <h3 className={cn("relative text-[17.5px] font-extrabold", c.number_prefix && "mt-3", s.dark && "text-white")}>{f.title}</h3>
              {f.desc && <p className={cn("relative mt-1.5 text-[14.5px] leading-7", s.dark ? "text-white/60" : "text-ink-2")}>{f.desc}</p>}
            </TiltCard>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}

/* ---------------- مراحل فرایند (خط افقی) ---------------- */
export function ProcessSteps({ c, ctx }: SectionProps) {
  const steps = c.steps as { title: string; desc: string }[];
  return (
    <Section c={c}>
      <Heading c={c} dark={sf(c.surface).dark} />
      <ol className={cn("relative mt-14 grid gap-8 lg:gap-6", steps.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-5")}>
        <ScrollLine vertical color="bg-amber" className="absolute bottom-2 start-[18px] top-2 w-[3px] lg:hidden" />
        <ScrollLine color="bg-amber" className="absolute inset-x-[10%] top-[18px] hidden h-[3px] lg:block" />
        {steps.map((s, i) => (
          <Reveal as="li" key={i} delay={i * 0.07} className="relative flex gap-5 lg:block">
            <span className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full border-2 border-amber bg-white text-[14px] font-extrabold text-amber-ink shadow-[0_8px_20px_-8px_rgb(245_168_0/0.6)]">
              {num(i + 1, ctx.locale)}
            </span>
            <div className="lg:mt-6">
              <h3 className="text-[17px] font-extrabold">{s.title}</h3>
              <p className="mt-1.5 text-[14.5px] leading-7 text-ink-2">{s.desc}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

/* ---------------- مراحل ردیفی ---------------- */
export function StepsRow({ c, ctx }: SectionProps) {
  const t = th(c.theme);
  const steps = c.steps as { title: string; desc: string }[];
  const cols = steps.length === 4 ? "md:grid-cols-4" : steps.length === 3 ? "md:grid-cols-3" : "md:grid-cols-5";
  if (c.style === "timeline") {
    return (
      <Section c={c}>
        <Heading c={c} center accent={t.accent} />
        <div className="relative mt-14">
          <ScrollLine color={t.line} className="absolute inset-x-[10%] top-6 hidden h-1 md:block" />
          <Stagger as="ol" className={cn("relative grid gap-8", cols)}>
            {steps.map((s, i) => (
              <StaggerItem as="li" key={i} className="text-center">
                <span className={cn("mx-auto grid size-12 place-items-center rounded-full text-[15px] font-extrabold text-white ring-8 ring-white", t.solid)}>{num(i + 1, ctx.locale)}</span>
                <h3 className="mt-4 text-[16.5px] font-extrabold">{s.title}</h3>
                <p className="mt-1 text-[14px] leading-7 text-ink-2">{s.desc}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>
    );
  }
  return (
    <Section c={c} fallback="paper">
      <Heading c={c} accent={t.accent} />
      <ScrollLine color={t.solid} className="mt-14 h-1" />
      <ol className={cn("mt-4 grid gap-px overflow-hidden rounded-3xl border border-line bg-line", cols)}>
        {steps.map((s, i) => (
          <Reveal as="li" key={i} delay={i * 0.08} className="group bg-white p-6 transition-colors duration-300 hover:bg-paper">
            <span className={cn("inline-grid size-9 place-items-center rounded-full text-[13px] font-extrabold transition-transform duration-300 group-hover:scale-110", t.soft, t.accent)}>{num(i + 1, ctx.locale)}</span>
            <h3 className="mt-3 text-[16.5px] font-extrabold">{s.title}</h3>
            <p className="mt-1.5 text-[14px] leading-7 text-ink-2">{s.desc}</p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

/* ---------------- فهرست شماره‌دار ---------------- */
export function NumberedList({ c, ctx }: SectionProps) {
  const t = th(c.theme);
  return (
    <Section c={c}>
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Heading c={c} accent={t.accent} />
        <ul className="grid gap-3">
          {(c.items as { text: string }[]).map((u, i) => (
            <Reveal as="li" key={i} delay={i * 0.05} className="flex items-start gap-4 rounded-2xl border border-line bg-white p-5">
              <span className={cn("grid size-8 shrink-0 place-items-center rounded-full text-[13px] font-extrabold", t.soft, t.accent)}>{num(i + 1, ctx.locale)}</span>
              <span className="pt-0.5 text-[16px] leading-8">{u.text}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/* ---------------- پرسش‌های متداول ---------------- */
export function Faq({ c }: SectionProps) {
  const t = th(c.theme);
  const items = (c.items as { q: string; a: string }[]).filter((x) => x.q && x.a);
  const link = c.aside_link as { label: string; href: string };
  return (
    <Section c={c}>
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Heading c={c} accent={t.accent} />
          {c.aside_title && (
            <div className={cn("mt-8 rounded-2xl border p-5", c.theme === "limoc" ? "border-limoc-sun/50 bg-limoc-sun/20" : "border-line bg-white")}>
              <p className="font-bold text-ink">{c.aside_title}</p>
              {c.aside_desc && <p className="mt-1 text-[14px] text-ink-2">{c.aside_desc}</p>}
              {link?.href && <SmartLink href={link.href} className={cn(buttonVariants({ variant: c.theme === "limoc" ? "limoc" : "dark", size: "sm" }), "mt-4")}>{link.label}</SmartLink>}
            </div>
          )}
        </div>
        <FaqList items={items} />
      </div>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />
    </Section>
  );
}

/* ---------------- مسیر مشتری ---------------- */
export function Journey({ c, ctx }: SectionProps) {
  const t = th(c.theme);
  const steps = c.steps as { text: string }[];
  return (
    <Section c={c} className="sm:py-32">
      <Heading c={c} center accent={t.accent} />
      <div className="relative mx-auto mt-16 max-w-5xl">
        <ScrollLine color={t.line} className="absolute inset-x-6 top-[27px] hidden h-1 lg:block" />
        <Stagger as="ol" className="relative grid grid-cols-3 gap-4 sm:grid-cols-5 lg:grid-cols-9">
          {steps.map((s, i) => (
            <StaggerItem as="li" key={i} className="flex flex-col items-center gap-3 text-center">
              <span className={cn("relative grid size-14 place-items-center rounded-2xl border bg-white text-[17px] font-extrabold shadow-[0_10px_24px_-14px_rgb(6_75_46/0.5)] transition-[transform,background-color,color] duration-300 hover:-translate-y-1 hover:text-white", t.accent, c.theme === "limoc" ? "border-limoc/15 hover:bg-limoc" : "border-line hover:bg-navy")}>
                {num(i + 1, ctx.locale)}
              </span>
              <span className="text-[14.5px] font-bold text-ink">{s.text}</span>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
      {c.note && <p className="mt-10 text-center text-[14px] text-ink-3">{c.note}</p>}
    </Section>
  );
}

/* ---------------- مسئله ---------------- */
export function ProblemList({ c }: SectionProps) {
  const t = th(c.theme);
  const points = c.points as { text: string }[];
  const X = () => <span className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-[#fde8e8] text-[#d6455d]"><Icon name="x" className="size-3.5" strokeWidth={2.5} /></span>;
  const callout = c.callout_title && (
    <Reveal className="mt-10">
      <div className={cn("relative overflow-hidden rounded-3xl p-8 text-center sm:p-12", c.theme === "limoc" ? "surface-limoc" : "surface-dark")}>
        <h3 className="text-[24px] font-extrabold text-white sm:text-[30px]">{c.callout_title}</h3>
        {c.callout_desc && <p className="mx-auto mt-3 max-w-2xl text-white/70">{c.callout_desc}</p>}
        <Buttons items={c.callout_buttons} theme={c.theme} dark size="md" firstArrow={false} className="mt-7 justify-center" />
      </div>
    </Reveal>
  );
  if (c.layout === "grid") {
    return (
      <Section c={c} className="sm:py-32">
        <Heading c={c} center accent={t.accent} />
        <Stagger className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {points.map((p, i) => (
            <StaggerItem key={i} className="flex items-start gap-4 rounded-2xl border border-line bg-white p-6 transition-shadow duration-300 hover:shadow-[var(--shadow-soft)]">
              <X /><span className="text-[15.5px] leading-8 text-ink">{p.text}</span>
            </StaggerItem>
          ))}
        </Stagger>
        {c.conclusion && <p className={cn("mx-auto mt-6 max-w-3xl rounded-2xl p-5 text-center font-bold", t.soft)}>{c.conclusion}</p>}
        {callout}
      </Section>
    );
  }
  return (
    <Section c={c}>
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <Heading c={c} accent={t.accent} />
        <ul className="grid gap-3">
          {points.map((p, i) => (
            <Reveal as="li" key={i} delay={i * 0.07} className="flex items-start gap-4 rounded-2xl border border-line bg-paper/60 p-5 transition-[transform,box-shadow] duration-300 hover:-translate-x-1 hover:shadow-[var(--shadow-soft)] ltr:hover:translate-x-1">
              <X /><span className="text-[16px] leading-8">{p.text}</span>
            </Reveal>
          ))}
          {c.conclusion && (
            <Reveal as="li" delay={0.25} className={cn("flex items-start gap-4 rounded-2xl p-5", t.soft)}>
              <span className={cn("mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-white ring-1 ring-line", t.accent)}><Icon name="check" className="size-3.5" strokeWidth={2.5} /></span>
              <span className="text-[16px] font-bold leading-8">{c.conclusion}</span>
            </Reveal>
          )}
        </ul>
      </div>
      {callout}
    </Section>
  );
}

/* ---------------- مخاطبان ---------------- */
export function Audience({ c }: SectionProps) {
  const t = th(c.theme);
  const items = c.items as { icon: never; title: string; desc: string }[];
  const center = c.align === "center";
  return (
    <Section c={c}>
      <Heading c={c} center={center} accent={t.accent} />
      <Stagger className={cn("mt-12 grid gap-4", items.length > 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-3")}>
        {items.map((it, i) => (
          <StaggerItem key={i}>
            <TiltCard className="h-full rounded-2xl border border-line bg-white p-7 transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]">
              <span className={cn("relative mb-5 grid size-12 place-items-center rounded-2xl transition-transform duration-300 group-hover/tilt:rotate-[-6deg] group-hover/tilt:scale-110", t.soft, t.accent)}><Icon name={it.icon ?? "users"} className="size-6" /></span>
              <h3 className="relative text-[18px] font-extrabold">{it.title}</h3>
              {it.desc && <p className="relative mt-1 text-[15px] leading-7 text-ink-2">{it.desc}</p>}
            </TiltCard>
          </StaggerItem>
        ))}
      </Stagger>
      {c.note && <p className="mt-6 text-center text-[14px] text-ink-3">{c.note}</p>}
    </Section>
  );
}

/* ---------------- هویت برند ---------------- */
export function IdentityCard({ c }: SectionProps) {
  return (
    <section className="bg-white pt-24 sm:pt-28">
      <div className="container-x">
        <Reveal className="grid items-center gap-10 rounded-3xl border border-line bg-paper p-8 sm:p-12 md:grid-cols-[0.8fr_1.2fr]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {c.image && <img src={c.image.src} alt={c.image.alt} className="mx-auto h-auto w-full max-w-[340px]" loading="lazy" />}
          <div>
            {c.eyebrow && <p className="eyebrow text-amber-ink">{c.eyebrow}</p>}
            <h2 className="mt-3 text-[26px] font-extrabold leading-[1.5] sm:text-[30px]">{c.title}</h2>
            {c.text && <p className="mt-3 text-[15.5px] leading-8 text-ink-2">{c.text}</p>}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- حوزه‌های فعالیت ---------------- */
export function Pillars({ c, ctx }: SectionProps) {
  return (
    <section className="bg-white py-24 sm:py-28">
      <div className="container-x grid gap-6 md:grid-cols-2">
        {(c.items as { icon: never; theme: string; title: string; desc: string; list_products?: boolean }[]).map((it, i) => {
          const t = th(it.theme);
          return (
            <Reveal key={i} delay={i * 0.06} className="rounded-3xl border border-line p-8 sm:p-10">
              <span className={cn("grid size-12 place-items-center rounded-2xl", t.soft, t.accent)}><Icon name={it.icon ?? "layers"} className="size-6" /></span>
              <h2 className="mt-6 text-[24px] font-extrabold">{it.title}</h2>
              {it.desc && <p className="mt-3 text-[15.5px] leading-8 text-ink-2">{it.desc}</p>}
              {it.list_products && (
                <ul className="mt-6 grid gap-3">
                  {ctx.g.products.items.map((p) => (
                    <li key={p.key} className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px]">
                      <i className={cn("size-2 rounded-full", th(p.theme).dot)} />
                      <SmartLink href={p.page?.href ?? ""} className="font-bold hover:underline">{p.name}</SmartLink>
                      <span className="text-ink-3">— {p.category}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- چرخهٔ سه‌مرحله‌ای ---------------- */
export function CycleDiagram({ c, ctx }: SectionProps) {
  const t = th(c.theme);
  const nodes = c.nodes as { icon: never; title: string; desc: string }[];
  const flows = (c.flows as { text: string }[]).map((f) => f.text);
  return (
    <Section c={c} fallback="paper">
      <Heading c={c} center accent={t.accent} />
      <Reveal className="mt-14">
        <ol className="grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch">
          {nodes.map((n, i) => (
            <li key={i} className="contents">
              <div className="relative rounded-2xl border border-line bg-white p-6">
                <span className="absolute end-5 top-5 text-[12px] font-bold text-ink-3">{num(i + 1, ctx.locale)}</span>
                <span className={cn("mb-4 grid size-12 place-items-center rounded-xl", t.soft, t.accent)}><Icon name={n.icon ?? "check"} className="size-6" /></span>
                <p className="text-[18px] font-extrabold text-ink">{n.title}</p>
                <p className="mt-1 text-[14.5px] leading-7 text-ink-2">{n.desc}</p>
              </div>
              {i < nodes.length - 1 && (
                <div className="flex items-center justify-center gap-2 lg:flex-col" aria-hidden>
                  {flows[i] && <span className="rounded-full bg-paper px-3 py-1 text-[12px] font-semibold text-ink-2 ring-1 ring-line">{flows[i]}</span>}
                  <Icon name="arrow" className={cn("size-5 rotate-90 lg:rotate-0 ltr:lg:-scale-x-100", t.accent)} />
                </div>
              )}
            </li>
          ))}
        </ol>
        {c.closing && (
          <div className="mt-4 flex items-center justify-center gap-3 rounded-2xl border border-dashed border-teal/40 p-4 text-center text-[14px] text-ink-2">
            <span className={cn("grid size-7 shrink-0 place-items-center rounded-full", t.soft, t.accent)}><Icon name="workflow" className="size-4" /></span>
            {c.closing}
          </div>
        )}
      </Reveal>
    </Section>
  );
}

/* ---------------- جدول مقایسه ---------------- */
export function ComparisonTable({ c }: SectionProps) {
  const cols = c.columns as { label: string; theme: string }[];
  const rows = c.rows as C[];
  const link = c.footer_link as { label: string; href: string };
  return (
    <section className="bg-white py-24">
      <div className="container-x">
        <h2 className="h-section">{c.title}</h2>
        <div className="mt-10 overflow-x-auto rounded-3xl border border-line">
          <table className="w-full min-w-[760px] border-collapse text-[15px]">
            <thead>
              <tr className="bg-paper">
                <td className="p-5" />
                {cols.slice(0, 4).map((col, i) => (
                  <th key={i} scope="col" className="p-5 text-start"><span className="flex items-center gap-2 font-extrabold"><i className={cn("size-2 rounded-full", th(col.theme).dot)} />{col.label}</span></th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-line align-top">
                  <th scope="row" className="w-44 p-5 text-start text-[14px] font-bold text-ink-3">{r.label}</th>
                  {cols.slice(0, 4).map((_, j) => <td key={j} className="p-5 leading-7 text-ink-2">{r[`cell_${j + 1}`]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(c.footer_text || link?.href) && (
          <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-3xl bg-paper p-7 sm:flex-row sm:items-center">
            <p className="text-[16px] font-bold">{c.footer_text}</p>
            {link?.href && <SmartLink href={link.href} className={buttonVariants({ variant: "primary" })}>{link.label}</SmartLink>}
          </div>
        )}
      </div>
    </section>
  );
}

export { Check };
