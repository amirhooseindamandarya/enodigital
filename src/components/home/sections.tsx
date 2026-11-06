import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section";
import { BrowserFrame, MockLabel, PhoneFrame, Screenshot } from "@/components/mockups/frames";
import { LimocDashboard } from "@/components/mockups/limoc";
import { LimoFoodMenu, OrderCard } from "@/components/mockups/limofood";
import { benefitsScreens } from "@/components/mockups/benefits";
import { products, type Product } from "@/lib/products";
import { approach, articles, processSteps, projects, services } from "@/lib/content";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------ */
/* معرفی شرکت                                                    */
/* ------------------------------------------------------------ */
export function Intro() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.25fr] lg:gap-20">
        <Reveal>
          <p className="eyebrow mb-4 text-indigo">رویکرد ما</p>
          <h2 className="h-section">ما فقط نرم‌افزار نمی‌نویسیم؛ راهکارهایی می‌سازیم که به کار می‌آیند.</h2>
          <p className="lead mt-5">هر محصول و هر پروژه از یک مسئلهٔ واقعی شروع می‌شود. اول فرایند را می‌فهمیم، بعد تجربه‌ای طراحی می‌کنیم که کاربر بدون آموزش طولانی از آن استفاده کند، و آن را طوری می‌سازیم که سال‌ها قابل نگهداری بماند.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/about/" variant="outline">دربارهٔ شرکت</ButtonLink>
          </div>
        </Reveal>
        <div className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2">
          {approach.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.06} className="bg-white p-7 sm:p-8">
              <span className="mb-5 grid size-11 place-items-center rounded-xl bg-paper text-indigo ring-1 ring-line"><Icon name={a.icon} className="size-5" /></span>
              <h3 className="text-[18px] font-extrabold">{a.title}</h3>
              <p className="mt-2 text-[15px] leading-7 text-ink-2">{a.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ */
/* سه محصول                                                      */
/* ------------------------------------------------------------ */
function Highlights({ p, dark }: { p: Product; dark?: boolean }) {
  return (
    <ul className="mt-6 grid gap-2.5">
      {p.highlights.map((h) => (
        <li key={h} className={cn("flex items-start gap-2.5 text-[15px]", dark ? "text-white/80" : "text-ink")}>
          <span className={cn("mt-1 grid size-5 shrink-0 place-items-center rounded-full", p.theme.bg, p.theme.accent)}><Icon name="check" className="size-3.5" strokeWidth={2.5} /></span>
          {h}
        </li>
      ))}
    </ul>
  );
}

function ProductMeta({ p }: { p: Product }) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <span className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12.5px] font-bold", p.theme.bg, p.theme.accent)}><Icon name={p.icon} className="size-4" />{p.category}</span>
      </div>
      <h3 className="mt-5 text-[30px] font-extrabold leading-tight sm:text-[36px]">{p.name}</h3>
      <p className="mt-1 text-[14px] text-ink-3">مناسب برای: {p.audience}</p>
      <p className="mt-4 text-[16.5px] leading-8 text-ink-2">{p.value}</p>
    </>
  );
}

export function ProductsShowcase() {
  const { limoc, limofood, benefits } = products;
  return (
    <section id="products" className="bg-paper py-24 sm:py-32">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading eyebrow="محصولات" title="سه محصول مستقل، هرکدام برای یک بازار مشخص" lead="هر محصول تیم، نقشهٔ راه و مخاطب خودش را دارد؛ اما همه با یک استاندارد ساخته می‌شوند." />
          <ButtonLink href="/products/" variant="outline" className="self-start lg:self-auto">مقایسهٔ محصولات</ButtonLink>
        </div>

        {/* Limoc — کارت عریض */}
        <Reveal className="mt-14">
          <article className="group grid overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-[var(--shadow-soft)] transition-shadow duration-500 hover:shadow-[var(--shadow-lift)] lg:grid-cols-[1fr_1.35fr]">
            <div className="flex flex-col p-8 sm:p-11">
              <ProductMeta p={limoc} />
              <Highlights p={limoc} />
              <div className="mt-auto flex flex-wrap gap-3 pt-9">
                <ButtonLink href={limoc.href}>مشاهدهٔ جزئیات <Icon name="arrow" /></ButtonLink>
              </div>
            </div>
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo/[0.07] to-violet/[0.06] p-6 sm:p-10">
              <MockLabel className="absolute end-5 top-5 z-20" />
              <BrowserFrame title="Limoc · قیف فروش" className="shadow-[var(--shadow-lift)] transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:-translate-y-1.5 lg:translate-x-[-12%] lg:w-[118%]">
                <LimocDashboard />
              </BrowserFrame>
            </div>
          </article>
        </Reveal>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* LimoFood */}
          <Reveal>
            <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-[var(--shadow-soft)] transition-shadow duration-500 hover:shadow-[var(--shadow-lift)]">
              <div className="relative h-[300px] overflow-hidden bg-gradient-to-b from-[#fff4d9] to-[#fffaf0] sm:h-[340px]">
                <MockLabel className="absolute end-5 top-5 z-20" />
                <div className="absolute -bottom-24 right-[10%] w-[200px] transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:-translate-y-2 sm:w-[220px]">
                  <PhoneFrame><LimoFoodMenu /></PhoneFrame>
                </div>
                <OrderCard className="absolute left-[7%] top-[22%] w-[230px] shadow-[var(--shadow-lift)]" />
              </div>
              <div className="flex flex-1 flex-col p-8 sm:p-10">
                <ProductMeta p={limofood} />
                <Highlights p={limofood} />
                <div className="mt-auto pt-9"><ButtonLink href={limofood.href} variant="dark">مشاهدهٔ جزئیات <Icon name="arrow" /></ButtonLink></div>
              </div>
            </article>
          </Reveal>

          {/* رفاهیات */}
          <Reveal delay={0.08}>
            <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-navy-3 bg-navy text-white shadow-[var(--shadow-soft)] transition-shadow duration-500 hover:shadow-[var(--shadow-lift)]">
              <div className="relative h-[300px] overflow-hidden bg-[radial-gradient(80%_80%_at_50%_0%,rgb(22_184_166/0.22),transparent)] sm:h-[340px]">
                <span className="absolute end-5 top-5 z-20 rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-white/70 backdrop-blur">تصویر واقعی · دادهٔ آزمایشی</span>
                <div className="absolute -bottom-6 left-[6%] w-[88%] transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:-translate-y-2">
                  <BrowserFrame title="پنل مدیریت · صدور بن" className="shadow-[var(--shadow-float)]">
                    <Screenshot src={benefitsScreens.wizard.src} alt={benefitsScreens.wizard.alt} sizes="(max-width: 1024px) 90vw, 40vw" />
                  </BrowserFrame>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-8 sm:p-10">
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-teal/15 px-3 py-1 text-[12.5px] font-bold text-teal"><Icon name="building" className="size-4" />{benefits.category}</span>
                <h3 className="mt-5 text-[30px] font-extrabold leading-tight text-white sm:text-[36px]">{benefits.name}</h3>
                <p className="mt-1 text-[14px] text-white/50">مناسب برای: {benefits.audience}</p>
                <p className="mt-4 text-[16.5px] leading-8 text-white/70">{benefits.value}</p>
                <Highlights p={benefits} dark />
                <div className="mt-auto pt-9"><ButtonLink href={benefits.href} variant="teal">مشاهدهٔ جزئیات <Icon name="arrow" /></ButtonLink></div>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ */
/* توسعهٔ نرم‌افزار سفارشی                                        */
/* ------------------------------------------------------------ */
export function CustomDev() {
  return (
    <section className="surface-dark relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-60" />
      <div className="container-x relative grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow mb-4 text-[#a9b1ff]">توسعهٔ نرم‌افزار سفارشی</p>
          <h2 className="h-section">نیاز شما خارج از چارچوب نرم‌افزارهای آماده است؟</h2>
          <p className="lead mt-5 text-white/65!">ما نیازهای اختصاصی کسب‌وکار شما را بررسی می‌کنیم و متناسب با فرایندها، اهداف و زیرساخت‌های شما راهکار نرم‌افزاری طراحی و توسعه می‌دهیم.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/services/custom-software/#request" variant="light" size="lg">ثبت درخواست پروژه <Icon name="arrow" /></ButtonLink>
            <ButtonLink href="/services/custom-software/" variant="ghostDark" size="lg">جزئیات خدمات</ButtonLink>
          </div>
        </Reveal>
        <ul className="grid gap-3 sm:grid-cols-2">
          {services.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.04}
              className={cn("rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.06]", i === services.length - 1 && "sm:col-span-2")}>
              <span className="mb-4 grid size-10 place-items-center rounded-xl bg-indigo/20 text-[#b4baff]"><Icon name={s.icon} className="size-5" /></span>
              <h3 className="text-[17px] font-extrabold">{s.title}</h3>
              <p className="mt-1.5 text-[14.5px] leading-7 text-white/60">{s.desc}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ */
/* فرایند همکاری                                                 */
/* ------------------------------------------------------------ */
export function Process({ id, className }: { id?: string; className?: string }) {
  return (
    <section id={id} className={cn("bg-white py-24 sm:py-32", className)}>
      <div className="container-x">
        <SectionHeading eyebrow="فرایند همکاری" title="از شناخت مسئله تا استقرار؛ قدم‌به‌قدم و شفاف" />
        <ol className="relative mt-14 grid gap-8 lg:grid-cols-5 lg:gap-6">
          <span aria-hidden className="absolute right-[19px] top-2 bottom-2 w-px bg-line lg:hidden" />
          <span aria-hidden className="absolute inset-x-[10%] top-[19px] hidden h-px bg-gradient-to-l from-indigo/50 via-line to-line lg:block" />
          {processSteps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.07} className="relative flex gap-5 lg:block">
              <span className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full border border-line bg-white text-[14px] font-extrabold text-indigo shadow-[var(--shadow-soft)]">
                {(i + 1).toLocaleString("fa-IR")}
              </span>
              <div className="lg:mt-6">
                <h3 className="text-[17px] font-extrabold">{s.title}</h3>
                <p className="mt-1.5 text-[14.5px] leading-7 text-ink-2">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ */
/* پروژه‌ها                                                      */
/* ------------------------------------------------------------ */
export function ProjectCards({ limit }: { limit?: number }) {
  const list = limit ? projects.slice(0, limit) : projects;
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {list.map((p, i) =>
        p.status === "published" ? (
          <Reveal key={p.slug} delay={i * 0.06} className="lg:col-span-2">
            <article className="grid h-full overflow-hidden rounded-3xl border border-line bg-white sm:grid-cols-[1fr_1fr]">
              <div className="flex flex-col p-7 sm:p-8">
                <div className="flex flex-wrap gap-1.5">{p.tags.map((t) => <span key={t} className="rounded-full bg-paper px-2.5 py-0.5 text-[12px] font-semibold text-ink-2">{t}</span>)}</div>
                <h3 className="mt-4 text-[21px] font-extrabold">{p.name}</h3>
                <dl className="mt-4 grid gap-3 text-[14.5px] leading-7">
                  <div><dt className="font-bold text-ink-3">مسئله</dt><dd className="text-ink-2">{p.problem}</dd></div>
                  <div><dt className="font-bold text-ink-3">راهکار</dt><dd className="text-ink-2">{p.solution}</dd></div>
                  <div><dt className="font-bold text-ink-3">نتیجه</dt><dd className="text-ink-2">{p.result}</dd></div>
                </dl>
                <Link href="/products/benefits/" className="mt-auto inline-flex items-center gap-1.5 pt-6 font-bold text-teal-700 hover:text-teal">مشاهدهٔ محصول <Icon name="arrow" className="size-4" /></Link>
              </div>
              <div className="relative min-h-[260px] overflow-hidden bg-navy bg-[radial-gradient(70%_60%_at_50%_0%,rgb(22_184_166/0.25),transparent)]">
                <div className="absolute -left-8 top-10 w-[125%]">
                  <BrowserFrame dark className="shadow-[var(--shadow-float)]"><Screenshot src={benefitsScreens.dashboard.src} alt={benefitsScreens.dashboard.alt} sizes="40vw" /></BrowserFrame>
                </div>
              </div>
            </article>
          </Reveal>
        ) : (
          <Reveal key={p.slug} delay={i * 0.06}>
            <article className="flex h-full min-h-[260px] flex-col justify-between rounded-3xl border-2 border-dashed border-line-2 bg-paper/60 p-7">
              <span className="w-fit rounded-full border border-line bg-white px-2.5 py-0.5 text-[12px] font-semibold text-ink-3">محتوای قابل جایگزینی</span>
              <div>
                <h3 className="text-[18px] font-extrabold text-ink-2">{p.name}</h3>
                <p className="mt-2 text-[14.5px] leading-7 text-ink-3">{p.problem} {p.solution}</p>
              </div>
            </article>
          </Reveal>
        ),
      )}
    </div>
  );
}

export function ProjectsTeaser() {
  return (
    <section className="bg-paper py-24 sm:py-32">
      <div className="container-x">
        <div className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading eyebrow="پروژه‌ها" title="نمونه‌کارها" lead="پروژه‌ها را فقط با اطلاعات قابل‌استناد و پس از تأیید کارفرما منتشر می‌کنیم." />
          <ButtonLink href="/projects/" variant="outline" className="self-start lg:self-auto">همهٔ پروژه‌ها</ButtonLink>
        </div>
        <ProjectCards limit={2} />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ */
/* مقالات                                                        */
/* ------------------------------------------------------------ */
export function ArticleCards() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {articles.map((a, i) => (
        <Reveal key={a.slug} delay={i * 0.06}>
          <Link href={`/blog/${a.slug}/`} className="group flex h-full flex-col rounded-3xl border border-line bg-white p-7 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-line-2 hover:shadow-[var(--shadow-lift)]">
            <span className="text-[12.5px] font-bold text-indigo">{a.category}</span>
            <h3 className="mt-3 text-[19px] font-extrabold leading-8">{a.title}</h3>
            <p className="mt-3 flex-1 text-[14.5px] leading-7 text-ink-2">{a.excerpt}</p>
            <span className="mt-6 flex items-center justify-between border-t border-line pt-4 text-[13.5px] text-ink-3">
              {a.readMinutes.toLocaleString("fa-IR")} دقیقه مطالعه
              <Icon name="arrow" className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
            </span>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}

export function ArticlesTeaser() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="container-x">
        <div className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading eyebrow="مقالات و دانشنامه" title="یادداشت‌هایی دربارهٔ فروش، تجربهٔ مشتری و تحول دیجیتال" />
          <ButtonLink href="/blog/" variant="outline" className="self-start lg:self-auto">همهٔ مقالات</ButtonLink>
        </div>
        <ArticleCards />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ */
/* CTA نهایی                                                     */
/* ------------------------------------------------------------ */
export function FinalCta({ title = "برای تبدیل ایده‌تان به یک راهکار نرم‌افزاری آماده‌اید؟", lead = "دربارهٔ نیازتان بگویید؛ محصول مناسب را پیشنهاد می‌دهیم یا راهکار اختصاصی را با هم تعریف می‌کنیم." }: { title?: string; lead?: string }) {
  return (
    <section className="bg-white pb-24 sm:pb-32">
      <div className="container-x">
        <Reveal>
          <div className="surface-dark relative overflow-hidden rounded-[2rem] px-7 py-16 text-center sm:px-16 sm:py-20">
            <div aria-hidden className="grid-lines pointer-events-none absolute inset-0" />
            <div aria-hidden className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[640px] -translate-x-1/2 rounded-full bg-indigo/30 blur-[100px]" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="h-section">{title}</h2>
              <p className="lead mt-5 text-white/65!">{lead}</p>
              <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                <ButtonLink href="/contact/" variant="light" size="lg">شروع گفتگو <Icon name="arrow" /></ButtonLink>
                <ButtonLink href="/products/" variant="ghostDark" size="lg">مشاهدهٔ محصولات</ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
