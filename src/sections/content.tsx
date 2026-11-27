/* سکشن‌های محتوایی: محصولات، پروژه‌ها، بلاگ، متن و تصویر */
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { Float, ParallaxShot, Stagger, StaggerItem, TiltCard } from "@/components/motion/fx";
import { Icon } from "@/components/ui/icon";
import { BrowserFrame, PhoneFrame } from "@/components/mockups/frames";
import { LimoFoodBoard } from "@/components/mockups/limofood";
import { num, ui } from "@/cms/i18n";
import { publishedPosts } from "@/cms/resolve";
import { cn } from "@/lib/utils";
import { Arrow, Buttons, Check, Framed, Heading, Img, Section, SmartLink, lis, sf, th, type C, type Product, type Project, type SectionProps } from "./kit";

/* ---------------- معرفی با کارت‌ها ---------------- */
export function IntroCards({ c }: SectionProps) {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.25fr] lg:gap-20">
        <Reveal>
          {c.eyebrow && <p className="eyebrow mb-4 text-amber-ink">{c.eyebrow}</p>}
          <h2 className="h-section">{c.title}</h2>
          {c.lead && <p className="lead mt-5">{c.lead}</p>}
          <Buttons items={c.buttons} size="md" firstArrow={false} className="mt-8" override={() => "outline"} />
        </Reveal>
        <div className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2">
          {(c.cards as C[]).map((a, i) => (
            <Reveal key={i} delay={i * 0.08} className="bg-white">
              <TiltCard className="h-full p-7 sm:p-8">
                <span className="relative mb-5 grid size-11 place-items-center rounded-xl bg-amber/10 text-amber-ink ring-1 ring-amber/20 transition-transform duration-300 group-hover/tilt:rotate-[-6deg] group-hover/tilt:scale-110"><Icon name={a.icon ?? "check"} className="size-5" /></span>
                <h3 className="relative text-[18px] font-extrabold">{a.title}</h3>
                <p className="relative mt-2 text-[15px] leading-7 text-ink-2">{a.desc}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- ویترین محصولات ---------------- */
function Highlights({ p, dark }: { p: Product; dark?: boolean }) {
  return (
    <ul className="mt-6 grid gap-2.5">
      {lis(p.highlights).map((h, i) => (
        <li key={i} className={cn("flex items-start gap-2.5 text-[15px]", dark ? "text-white/80" : "text-ink")}>
          <Check theme={p.theme} className={cn("mt-1", dark && "bg-white/10")} />{h}
        </li>
      ))}
    </ul>
  );
}

function ProductMeta({ p, ctx, dark }: { p: Product; ctx: SectionProps["ctx"]; dark?: boolean }) {
  const t = th(p.theme);
  return (
    <>
      <span className={cn("inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-[12.5px] font-bold", dark ? "bg-white/10 " + t.onDark : cn(t.soft, t.accent))}><Icon name={p.icon} className="size-4" />{p.category}</span>
      <h3 className={cn("mt-5 text-[30px] font-extrabold leading-tight sm:text-[36px]", dark && "text-white")}>{p.name}</h3>
      <p className={cn("mt-1 text-[14px]", dark ? "text-white/50" : "text-ink-3")}>{ui("suitableFor", ctx.locale)}: {p.audience}</p>
      <p className={cn("mt-4 text-[16.5px] leading-8", dark ? "text-white/70" : "text-ink-2")}>{p.value}</p>
    </>
  );
}

function ProductCta({ p, dark }: { p: Product; dark?: boolean }) {
  if (!p.page) return null;
  return <Buttons items={[{ label: p.cta_label, href: p.page.href }]} theme={p.theme} dark={dark} size="md" className="mt-auto pt-9" override={() => (p.theme === "limoc" ? "limoc" : p.theme === "benefits" ? "teal" : dark ? "light" : "dark")} />;
}

export function ProductsShowcase({ c, ctx }: SectionProps) {
  const [first, ...rest] = ctx.g.products.items;
  return (
    <section id="products" className="bg-paper py-24 sm:py-32">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <Heading c={c} />
          <Buttons items={c.buttons} size="md" firstArrow={false} override={() => "outline"} className="self-start lg:self-auto" />
        </div>
        {first && (
          <Reveal className="mt-14">
            <article className="group grid overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-[var(--shadow-soft)] transition-shadow duration-500 hover:shadow-[var(--shadow-lift)] lg:grid-cols-[1fr_1.35fr]">
              <div className="flex flex-col p-8 sm:p-11">
                <ProductMeta p={first} ctx={ctx} />
                <Highlights p={first} />
                <ProductCta p={first} />
              </div>
              <div className="relative overflow-hidden bg-gradient-to-br from-limoc/[0.08] to-limoc-sun/[0.10] p-6 sm:p-10">
                <Framed image={first.image} title={first.image_title} className="shadow-[var(--shadow-lift)] transition-transform duration-700 group-hover:-translate-y-1.5 lg:w-[118%] lg:translate-x-[-12%] ltr:lg:translate-x-0" />
              </div>
            </article>
          </Reveal>
        )}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {rest.map((p, i) => {
            const dark = !!p.dark_card;
            return (
              <Reveal key={p.key} delay={i * 0.08}>
                <article className={cn("group flex h-full flex-col overflow-hidden rounded-[1.75rem] border shadow-[var(--shadow-soft)] transition-shadow duration-500 hover:shadow-[var(--shadow-lift)]", dark ? "border-navy-3 bg-navy" : "border-line bg-white")}>
                  <div className={cn("relative h-[300px] overflow-hidden sm:h-[340px]", dark ? "bg-[radial-gradient(80%_80%_at_50%_0%,rgb(22_184_166/0.22),transparent)]" : "bg-gradient-to-b from-[#fff0ee] to-[#fffafa]")}>
                    <div className="absolute -bottom-6 left-[6%] w-[88%] transition-transform duration-700 group-hover:-translate-y-2">
                      <Framed image={p.image} title={p.image_title} className={dark ? "shadow-[var(--shadow-float)]" : "shadow-[var(--shadow-lift)]"} />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-8 sm:p-10">
                    <ProductMeta p={p} ctx={ctx} dark={dark} />
                    <Highlights p={p} dark={dark} />
                    <ProductCta p={p} dark={dark} />
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- فهرست محصولات (صفحهٔ محصولات) ---------------- */
export function ProductList({ c, ctx }: SectionProps) {
  return (
    <section className="bg-paper pb-24">
      <div className="container-x grid gap-6">
        {ctx.g.products.items.map((p, i) => {
          const t = th(p.theme);
          return (
            <Reveal key={p.key} delay={i * 0.05}>
              <SmartLink href={p.page?.href ?? ""} className="group grid gap-8 rounded-3xl border border-line bg-white p-7 transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] sm:p-10 md:grid-cols-[auto_1fr_auto] md:items-center">
                <span className={cn("grid size-16 place-items-center rounded-2xl transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110", t.soft, t.accent)}><Icon name={p.icon} className="size-7" /></span>
                <div>
                  <p className="text-[13.5px] font-bold text-ink-3">{p.category}</p>
                  <h2 className="mt-1 text-[28px] font-extrabold">{p.name}</h2>
                  <p className="mt-2 max-w-2xl text-[16px] leading-8 text-ink-2">{p.tagline}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {lis(p.highlights).map((h, j) => <li key={j} className="rounded-full bg-paper px-3 py-1 text-[13px] font-semibold text-ink-2">{h}</li>)}
                  </ul>
                </div>
                <span className="inline-flex items-center gap-2 font-bold text-ink">{c.link_label} <Arrow nudge className="size-4" /></span>
              </SmartLink>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- سایر محصولات ---------------- */
export function OtherProducts({ c, ctx }: SectionProps) {
  const others = ctx.g.products.items.filter((p) => p.page?.key !== ctx.pageKey);
  const extra = c.extra_link as { href: string };
  const Card = ({ href, icon, cls, title, desc }: { href: string; icon: never; cls: string; title: string; desc: string }) => (
    <SmartLink href={href} className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-5 transition-shadow hover:shadow-[var(--shadow-soft)]">
      <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl", cls)}><Icon name={icon} className="size-5" /></span>
      <span className="min-w-0 flex-1"><span className="block font-extrabold">{title}</span><span className="block truncate text-[13.5px] text-ink-3">{desc}</span></span>
      <Arrow nudge className="size-4 text-ink-3" />
    </SmartLink>
  );
  return (
    <section className="border-t border-line bg-paper py-16">
      <div className="container-x">
        <p className="mb-6 text-[14px] font-bold text-ink-3">{c.title}</p>
        <div className="grid gap-4 md:grid-cols-3">
          {others.map((o) => <Card key={o.key} href={o.page?.href ?? ""} icon={o.icon as never} cls={cn(th(o.theme).soft, th(o.theme).accent)} title={o.name} desc={o.category} />)}
          {c.extra_title && extra?.href && <Card href={extra.href} icon={"code" as never} cls="bg-violet/10 text-violet" title={c.extra_title} desc={c.extra_desc} />}
        </div>
      </div>
    </section>
  );
}

/* ---------------- خدمات (دوستونه تیره) ---------------- */
export function ServicesSplit({ c }: SectionProps) {
  const items = c.items as C[];
  return (
    <section className="surface-dark relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-60" />
      <div className="container-x relative grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          {c.eyebrow && <p className="eyebrow mb-4 text-[#f5b82e]">{c.eyebrow}</p>}
          <h2 className="h-section text-white">{c.title}</h2>
          {c.lead && <p className="lead mt-5 text-white/65!">{c.lead}</p>}
          <Buttons items={c.buttons} dark className="mt-9" override={(_, i) => (i === 0 ? "light" : "ghostDark")} />
        </Reveal>
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((s, i) => (
            <Reveal as="li" key={i} delay={i * 0.06} className={cn(i === items.length - 1 && items.length % 2 === 1 && "sm:col-span-2")}>
              <TiltCard className="h-full rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition-colors duration-300 hover:border-amber/40 hover:bg-white/[0.06]">
                <span className="relative mb-4 grid size-10 place-items-center rounded-xl bg-amber/15 text-[#f5b82e] transition-transform duration-300 group-hover/tilt:scale-110 group-hover/tilt:rotate-[-6deg]"><Icon name={s.icon ?? "check"} className="size-5" /></span>
                <h3 className="relative text-[17px] font-extrabold text-white">{s.title}</h3>
                <p className="relative mt-1.5 text-[14.5px] leading-7 text-white/60">{s.desc}</p>
              </TiltCard>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------- نمونه‌کارها ---------------- */
function ProjectCard({ p, wide, ctx }: { p: Project; wide?: boolean; ctx: SectionProps["ctx"] }) {
  const href = p.page?.href ?? p.url ?? "";
  const rows = ([["problem", p.problem], ["solution", p.solution], ["result", p.result]] as const).filter(([, v]) => v);
  const dark = p.frame !== "light";
  return (
    <article className={cn("group grid h-full overflow-hidden rounded-3xl border border-line bg-white transition-shadow duration-500 hover:shadow-[var(--shadow-lift)]", p.image && (wide ? "md:grid-cols-[1fr_1.15fr]" : "md:grid-cols-2"))}>
      <div className="flex flex-col p-7 sm:p-9">
        {lis(p.tags).length > 0 && <div className="flex flex-wrap gap-1.5">{lis(p.tags).map((t, i) => <span key={i} className="rounded-full bg-paper px-2.5 py-0.5 text-[12px] font-semibold text-ink-2">{t}</span>)}</div>}
        <h3 className="mt-4 text-[22px] font-extrabold">{p.name}</h3>
        <dl className="mt-5 grid gap-4 text-[14.5px] leading-7">
          {rows.map(([k, v]) => (
            <div key={k} className="border-s-2 border-line ps-4 transition-colors duration-300 group-hover:border-amber/50"><dt className="text-[13px] font-bold text-ink-3">{ui(k, ctx.locale)}</dt><dd className="text-ink-2">{v}</dd></div>
          ))}
        </dl>
        {href && <SmartLink href={href} className="mt-auto inline-flex w-fit items-center gap-1.5 pt-7 font-bold text-ink hover:text-amber-ink">{ui("details", ctx.locale)} <Arrow nudge className="size-4" /></SmartLink>}
      </div>
      {p.image && (
        <div className={cn("relative min-h-[260px] overflow-hidden p-6 sm:p-8 md:p-0", dark ? "bg-navy bg-[radial-gradient(70%_60%_at_50%_0%,rgb(22_184_166/0.25),transparent)]" : "bg-gradient-to-br from-paper to-[#eef2f8]")}>
          <div className="md:absolute md:inset-y-10 md:-left-10 md:right-8 ltr:md:-right-10 ltr:md:left-8">
            <BrowserFrame dark={dark} className="shadow-[var(--shadow-float)] transition-transform duration-700 group-hover:-translate-y-1.5"><Img image={p.image} /></BrowserFrame>
          </div>
        </div>
      )}
    </article>
  );
}

function NextProjectCard({ c }: { c: C }) {
  const link = c.cta_link as { href: string; label: string };
  if (!c.cta_title) return null;
  return (
    <SmartLink href={link?.href ?? ""} className="group surface-dark relative flex h-full min-h-[300px] flex-col justify-between overflow-hidden rounded-3xl p-7 sm:p-9">
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-70" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-16 size-64 rounded-full bg-amber/25 blur-[80px] transition-transform duration-700 group-hover:scale-125" />
      <span className="relative grid size-12 place-items-center rounded-2xl bg-amber/15 text-[#f5b82e] ring-1 ring-amber/25"><Icon name="code" className="size-6" /></span>
      <div className="relative">
        <h3 className="text-[22px] font-extrabold text-white">{c.cta_title}</h3>
        {c.cta_desc && <p className="mt-2 text-[14.5px] leading-7 text-white/65">{c.cta_desc}</p>}
        {link?.label && <span className="mt-6 inline-flex items-center gap-1.5 font-bold text-[#f5b82e]">{link.label} <Arrow nudge className="size-4" /></span>}
      </div>
    </SmartLink>
  );
}

export function ProjectsShowcase({ c, ctx }: SectionProps) {
  const projects = ctx.g.projects.items.filter((p) => p.published);
  if (c.mode === "full") {
    return (
      <section className="bg-paper pb-24">
        <div className="container-x grid gap-6">
          {projects.map((p, i) => <Reveal key={p.key} delay={i * 0.06}><ProjectCard p={p} wide ctx={ctx} /></Reveal>)}
          {projects.length === 0 && <NextProjectCard c={c} />}
        </div>
      </section>
    );
  }
  return (
    <section className="bg-paper py-24 sm:py-32">
      <div className="container-x">
        <div className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <Heading c={c} />
          <Buttons items={c.buttons} size="md" firstArrow={false} override={() => "outline"} className="self-start lg:self-auto" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {projects[0] && <Reveal className="lg:col-span-2"><ProjectCard p={projects[0]} ctx={ctx} /></Reveal>}
          <Reveal delay={0.08} className={cn(!projects[0] && "lg:col-span-3")}><NextProjectCard c={c} /></Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- بلاگ ---------------- */
function PostCards({ ctx, count }: { ctx: SectionProps["ctx"]; count?: number }) {
  const posts = publishedPosts(ctx.site, ctx.locale).slice(0, count || undefined);
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {posts.map((a, i) => (
        <Reveal key={a.slug} delay={i * 0.08}>
          <Link href={a.href} className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white p-7 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1.5 hover:border-amber/40 hover:shadow-[var(--shadow-lift)]">
            <span aria-hidden className="absolute inset-x-0 top-0 h-1 origin-right scale-x-0 bg-amber transition-transform duration-500 group-hover:scale-x-100 ltr:origin-left" />
            {a.category && <span className="text-[12.5px] font-bold text-amber-ink">{a.category}</span>}
            <h3 className="mt-3 text-[19px] font-extrabold leading-8">{a.title}</h3>
            <p className="mt-3 flex-1 text-[14.5px] leading-7 text-ink-2">{a.excerpt}</p>
            <span className="mt-6 flex items-center justify-between border-t border-line pt-4 text-[13.5px] text-ink-3">
              {num(a.minutes, ctx.locale)} {ui("minutesRead", ctx.locale)}
              <Arrow nudge className="size-4" />
            </span>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}

export function BlogTeaser({ c, ctx }: SectionProps) {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="container-x">
        <div className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <Heading c={c} />
          <Buttons items={c.buttons} size="md" firstArrow={false} override={() => "outline"} className="self-start lg:self-auto" />
        </div>
        <PostCards ctx={ctx} count={c.count || 3} />
      </div>
    </section>
  );
}

export function BlogList({ c, ctx }: SectionProps) {
  const has = publishedPosts(ctx.site, ctx.locale).length > 0;
  return (
    <section className="bg-paper pb-24">
      <div className="container-x">{has ? <PostCards ctx={ctx} /> : <p className="text-ink-3">{c.empty_text}</p>}</div>
    </section>
  );
}

/* ---------------- متن و تصویر ---------------- */
function MediaVisual({ c, ctx }: { c: C; ctx: SectionProps["ctx"] }) {
  const shadow = c.theme === "limoc" ? "shadow-[0_40px_90px_-40px_rgb(6_75_46/0.45)]" : "shadow-[var(--shadow-lift)]";
  if (c.frame === "board") return <ParallaxShot strength={30}><BrowserFrame title={c.frame_title} className={shadow}><LimoFoodBoard locale={ctx.locale} /></BrowserFrame></ParallaxShot>;
  if (!c.image) return null;
  if (c.frame === "tall") {
    return (
      <Reveal delay={0.1} className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-b from-[#ffe3df] to-[#fff6f5] px-6 pt-12 sm:px-12">
        <ParallaxShot strength={26} tilt={false} className="relative mx-auto h-[460px] max-w-[440px] overflow-hidden rounded-t-2xl border border-b-0 border-line bg-white shadow-[var(--shadow-lift)]">
          <Img image={c.image} />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
        </ParallaxShot>
      </Reveal>
    );
  }
  if (c.frame === "phone") {
    return (
      <Reveal delay={0.1} className="flex justify-center overflow-hidden rounded-[1.75rem] bg-navy bg-[radial-gradient(60%_60%_at_50%_0%,rgb(22_184_166/0.25),transparent)] px-6 pt-10">
        <ParallaxShot strength={24} className="w-[min(260px,70%)] translate-y-8">
          <PhoneFrame screenClassName="aspect-[9/17]"><Img image={c.image} /></PhoneFrame>
        </ParallaxShot>
      </Reveal>
    );
  }
  return <ParallaxShot><Framed image={c.image} frame={c.frame} title={c.frame_title} className={shadow} /></ParallaxShot>;
}

export function MediaSplit({ c, ctx }: SectionProps) {
  const s = sf(c.surface);
  const t = th(c.theme);
  const bullets = (c.bullets ?? []) as { text: string }[];
  const steps = (c.steps ?? []) as { title: string; desc: string }[];
  const cards = (c.cards ?? []) as C[];
  const text = (
    <div>
      <Heading c={c} dark={s.dark} accent={s.dark ? t.onDark : t.accent} />
      {bullets.length > 0 && (
        <Stagger as="ul" className="mt-8 grid gap-3">
          {bullets.map((b, i) => <StaggerItem as="li" key={i} className="flex items-center gap-3 text-[15.5px]"><Check theme={c.theme} dark={s.dark} />{b.text}</StaggerItem>)}
        </Stagger>
      )}
      {steps.length > 0 && (
        <Stagger as="ol" className="relative mt-9 grid gap-6">
          {steps.map((st, i) => (
            <StaggerItem as="li" key={i} className="flex gap-4">
              <span className={cn("relative z-10 grid size-8 shrink-0 place-items-center rounded-full text-[13px] font-extrabold ring-4 ring-white", c.theme === "limoc" ? "bg-limoc-sun text-limoc-ink" : cn(t.soft, t.accent))}>{num(i + 1, ctx.locale)}</span>
              <span><b className="block text-[16px] text-ink">{st.title}</b><span className="text-[14.5px] leading-7 text-ink-2">{st.desc}</span></span>
            </StaggerItem>
          ))}
        </Stagger>
      )}
      {cards.length > 0 && (
        <Stagger className="mt-8 grid gap-3 sm:grid-cols-2">
          {cards.map((cd, i) => (
            <StaggerItem key={i}>
              <TiltCard className="h-full rounded-2xl border border-line bg-white p-5">
                <Icon name={cd.icon ?? "check"} className={cn("relative size-5", t.accent)} />
                <p className="relative mt-3 font-bold text-ink">{cd.title}</p>
                {cd.desc && <p className="relative text-[13.5px] text-ink-3">{cd.desc}</p>}
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
      )}
      {c.note && <p className={cn("mt-6 rounded-2xl border p-4 text-[14px] leading-7", s.dark ? "border-white/10 text-white/60" : "border-line bg-paper text-ink-2")}>{c.note}</p>}
    </div>
  );
  if (c.layout === "stacked") {
    return (
      <Section c={c}>
        {text}
        <div className="relative mt-12"><MediaVisual c={c} ctx={ctx} /></div>
      </Section>
    );
  }
  const start = c.image_side === "start";
  return (
    <Section c={c}>
      <div className={cn("grid items-center gap-14", start ? "lg:grid-cols-[1.2fr_0.8fr]" : "lg:grid-cols-[0.85fr_1.15fr]")}>
        <div className={cn(start && "lg:order-2")}>{text}</div>
        <div className={cn("relative", start && "lg:order-1")}><MediaVisual c={c} ctx={ctx} /></div>
      </div>
    </Section>
  );
}

/* ---------------- پشتیبانی و SLA ---------------- */
export function SlaPanel({ c, ctx }: SectionProps) {
  return (
    <section className="surface-limoc overflow-hidden py-24 sm:py-32">
      <div className="container-x">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Heading c={c} dark accent="text-limoc-sun" />
            {c.meter_label && (
              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5" aria-hidden>
                <div className="flex justify-between text-[13px] text-white/60"><span>{c.meter_label}</span><b className="text-white">{c.meter_value}</b></div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <Reveal y={0} className="h-full"><div className="h-full w-2/3 origin-right animate-[grow-x_1.6s_ease-out_both] rounded-full bg-gradient-to-l from-limoc-sun to-[#8bd17c] ltr:origin-left ltr:bg-gradient-to-r" /></Reveal>
                </div>
                <p className="mt-3 text-[12px] text-white/40">{c.meter_note || ui("liveDemo", ctx.locale)}</p>
              </div>
            )}
          </div>
          <ParallaxShot tilt={false}><Framed image={c.image} frame="browser_dark" title={c.frame_title} className="shadow-[var(--shadow-float)]" /></ParallaxShot>
        </div>
        <Stagger className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(c.items as C[]).map((x, i) => (
            <StaggerItem key={i} className="group rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition-colors duration-300 hover:border-limoc-sun/40 hover:bg-white/[0.06]">
              <span className="grid size-10 place-items-center rounded-xl bg-limoc-sun text-limoc-ink transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110"><Icon name="clock" className="size-[18px]" /></span>
              <h3 className="mt-4 text-[17px] font-extrabold text-white">{x.title}</h3>
              <p className="mt-1.5 text-[14.5px] leading-7 text-white/60">{x.desc}</p>
            </StaggerItem>
          ))}
        </Stagger>
        {c.extra_title && (
          <Reveal className="mt-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-[17px] font-extrabold text-white">{c.extra_title}</h3>
              {c.extra_desc && <p className="mt-1 text-[14.5px] text-white/60">{c.extra_desc}</p>}
            </div>
            <ul className="flex flex-wrap gap-2">
              {(c.chips as { text: string }[]).map((e, i) => <li key={i} className="rounded-full border border-white/15 px-3 py-1 text-[13px] text-white/80 transition-colors hover:border-limoc-sun hover:text-limoc-sun">{e.text}</li>)}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ---------------- امکانات دسته‌بندی‌شده ---------------- */
export function FeatureGroups({ c }: SectionProps) {
  const t = th(c.theme);
  return (
    <Section c={c} className="sm:py-32">
      <Heading c={c} center accent={t.accent} />
      <Stagger className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(c.groups as C[]).map((g, i) => (
          <StaggerItem key={i}>
            <TiltCard className="h-full rounded-2xl border border-line bg-limoc-cream/60 p-7 hover:border-limoc/30">
              <span className={cn("relative grid size-11 place-items-center rounded-xl text-white", t.solid)}><Icon name={g.icon ?? "check"} className="size-5" /></span>
              <h3 className="relative mt-5 text-[18px] font-extrabold text-ink">{g.title}</h3>
              {g.desc && <p className="relative mt-1 text-[14.5px] leading-7 text-ink-2">{g.desc}</p>}
              <ul className="relative mt-4 grid gap-2">
                {lis(g.items).map((it, j) => <li key={j} className="flex items-center gap-2 text-[14.5px]"><Check theme={c.theme} />{it}</li>)}
              </ul>
            </TiltCard>
          </StaggerItem>
        ))}
      </Stagger>
      {c.highlight_title && (
        <Reveal className="mt-10 grid items-center gap-8 overflow-hidden rounded-3xl border border-line bg-limoc-cream p-6 sm:p-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h3 className="text-[22px] font-extrabold text-ink">{c.highlight_title}</h3>
            {c.highlight_desc && <p className="mt-2 text-[15px] leading-8 text-ink-2">{c.highlight_desc}</p>}
          </div>
          <Float duration={8}><Framed image={c.highlight_image} title={c.highlight_frame_title} className="shadow-[0_40px_90px_-40px_rgb(6_75_46/0.45)]" /></Float>
        </Reveal>
      )}
    </Section>
  );
}

/* ---------------- پنل‌های سامانه ---------------- */
export function PanelsShowcase({ c }: SectionProps) {
  const t = th(c.theme);
  return (
    <Section c={c} className="pt-0 sm:pt-0">
      <Heading c={c} accent={t.accent} />
      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {(c.panels as C[]).map((pn, i) => (
          <Reveal key={i} delay={i * 0.06}>
            <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white transition-[box-shadow,transform] duration-500 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)]">
              <div className="relative flex h-[280px] items-start justify-center overflow-hidden bg-navy px-6 pt-8">
                {pn.device === "phone" ? (
                  <PhoneFrame className="w-[56%] transition-transform duration-700 group-hover:-translate-y-3" screenClassName="aspect-[9/17.5]"><Img image={pn.image} /></PhoneFrame>
                ) : (
                  <BrowserFrame dark className="w-[118%] shrink-0 shadow-[var(--shadow-float)] transition-transform duration-700 group-hover:-translate-y-3"><Img image={pn.image} /></BrowserFrame>
                )}
              </div>
              <div className="flex-1 p-7">
                <h3 className="text-[19px] font-extrabold">{pn.name}</h3>
                {pn.audience && <p className="text-[14px] text-ink-3">{pn.audience}</p>}
                <ul className="mt-5 grid gap-2.5">
                  {lis(pn.items).map((it, j) => <li key={j} className="flex items-start gap-2.5 text-[14.5px] leading-7"><Icon name="check" className={cn("mt-1.5 size-4 shrink-0", t.accent)} strokeWidth={2.5} />{it}</li>)}
                </ul>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
