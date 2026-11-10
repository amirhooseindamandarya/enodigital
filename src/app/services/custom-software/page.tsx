import { Reveal } from "@/components/motion/reveal";
import { TiltCard } from "@/components/motion/fx";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section";
import { FaqList } from "@/components/ui/accordion";
import { LeadForm } from "@/components/forms/lead-form";
import { Breadcrumb } from "@/components/product/blocks";
import { Process } from "@/components/home/sections";
import { approach, customFaqs, customUseCases, engagementModels, services, systemTypes } from "@/lib/content";
import { JsonLd, pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMeta({
  title: "توسعهٔ نرم‌افزار سفارشی",
  description: "تحلیل نیازمندی‌ها، طراحی UI/UX، توسعهٔ وب‌اپلیکیشن، سیستم‌های مدیریت داخلی، داشبورد مدیریتی، API و یکپارچه‌سازی؛ از شناخت مسئله تا استقرار و پشتیبانی.",
  path: "/services/custom-software/",
  keywords: ["توسعه نرم افزار سفارشی", "طراحی وب اپلیکیشن", "نرم افزار اختصاصی سازمانی", "یکپارچه سازی سامانه ها"],
});

export default function CustomSoftwarePage() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Service", serviceType: "توسعهٔ نرم‌افزار سفارشی", provider: { "@type": "Organization", name: site.name, url: site.url }, areaServed: "IR", description: metadata.description }} />
      <section className="surface-dark relative overflow-hidden pt-[72px]">
        <div aria-hidden className="grid-lines pointer-events-none absolute inset-0" />
        <div className="container-x relative pb-24 pt-10 sm:pt-14">
          <Breadcrumb dark items={[{ href: "/", label: "خانه" }, { label: "توسعهٔ نرم‌افزار سفارشی" }]} />
          <div className="mt-12 grid items-end gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="eyebrow text-[#f5b82e]">توسعهٔ نرم‌افزار سفارشی</p>
              <h1 className="h-display mt-5 text-white">نرم‌افزاری که با فرایند شما ساخته می‌شود، نه برعکس.</h1>
              <p className="mt-6 max-w-2xl text-[17px] leading-[2] text-white/70 sm:text-[19px]">از شناخت مسئله و تحلیل نیاز تا طراحی، توسعه، استقرار و پشتیبانی، کنار تیم شما هستیم تا سامانه‌ای بسازیم که واقعاً استفاده شود.</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="#request" variant="light" size="lg">ثبت درخواست پروژه <Icon name="arrow" /></ButtonLink>
                <ButtonLink href="#process" variant="ghostDark" size="lg">فرایند اجرا</ButtonLink>
              </div>
            </div>
            <ul className="grid grid-cols-2 gap-3">
              {services.slice(0, 4).map((s) => (
                <li key={s.title} className="glass rounded-2xl p-4 transition-[transform,background-color] duration-300 hover:-translate-y-1 hover:bg-white/10">
                  <Icon name={s.icon} className="size-5 text-[#f5b82e]" />
                  <p className="mt-3 text-[14.5px] font-bold text-white">{s.title}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white py-24 sm:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <SectionHeading eyebrow="چه زمانی؟" title="چه زمانی نرم‌افزار سفارشی انتخاب درستی است؟" lead="نرم‌افزار آماده سریع‌تر و ارزان‌تر است؛ ما هم وقتی محصول آماده کافی باشد، همان را پیشنهاد می‌دهیم. اما در این موقعیت‌ها راهکار اختصاصی ارزش بیشتری می‌سازد:" />
          <ul className="grid gap-3">
            {customUseCases.map((u, i) => (
              <Reveal as="li" key={u} delay={i * 0.05} className="flex items-start gap-4 rounded-2xl border border-line p-5">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-violet/10 text-[13px] font-extrabold text-violet">{(i + 1).toLocaleString("fa-IR")}</span>
                <span className="pt-0.5 text-[16px] leading-8">{u}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-paper py-24 sm:py-28">
        <div className="container-x">
          <SectionHeading eyebrow="انواع سامانه‌ها" title="چه نوع سامانه‌هایی توسعه می‌دهیم؟" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {systemTypes.map((s, i) => (
              <Reveal key={s.title} delay={(i % 3) * 0.05}>
                <TiltCard className="h-full rounded-2xl border border-line bg-white p-7 transition-[box-shadow,border-color] duration-300 hover:shadow-[var(--shadow-lift)]">
                <span className="mb-5 grid size-11 place-items-center rounded-xl bg-amber/12 text-amber-ink transition-transform duration-300 group-hover/tilt:scale-110 group-hover/tilt:rotate-[-6deg]"><Icon name={s.icon} className="size-5" /></span>
                <h3 className="text-[17.5px] font-extrabold">{s.title}</h3>
                <p className="mt-1.5 text-[14.5px] leading-7 text-ink-2">{s.desc}</p>
              </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Process id="process" />

      <section className="surface-dark py-24 sm:py-28">
        <div className="container-x">
          <SectionHeading dark eyebrow="رویکرد ما" title="معماری و تجربهٔ کاربری؛ دو ستون یک سامانهٔ ماندگار" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {approach.map((a, i) => (
              <Reveal key={a.title} delay={i * 0.05}>
                <TiltCard className="h-full rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition-[box-shadow,border-color] duration-300 hover:border-amber/40">
                <Icon name={a.icon} className="size-6 text-[#f5b82e]" />
                <h3 className="mt-5 text-[17px] font-extrabold">{a.title}</h3>
                <p className="mt-1.5 text-[14.5px] leading-7 text-white/60">{a.desc}</p>
              </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-24 sm:py-28">
        <div className="container-x">
          <SectionHeading eyebrow="مدل همکاری" title="متناسب با مرحلهٔ پروژهٔ شما" />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {engagementModels.map((m, i) => (
              <Reveal key={m.title} delay={i * 0.05}>
                <TiltCard className="h-full rounded-2xl border border-line p-7 transition-[box-shadow,border-color] duration-300 hover:shadow-[var(--shadow-lift)]">
                <span className="text-[13px] font-extrabold text-violet">{`مدل ${(i + 1).toLocaleString("fa-IR")}`}</span>
                <h3 className="mt-3 text-[18px] font-extrabold">{m.title}</h3>
                <p className="mt-2 text-[15px] leading-7 text-ink-2">{m.desc}</p>
              </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper py-24 sm:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading eyebrow="سؤالات متداول" title="پیش از شروع پروژه" />
          <FaqList items={customFaqs} />
        </div>
        <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: customFaqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />
      </section>

      <section id="request" className="bg-white py-24 sm:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="ثبت درخواست پروژه" title="دربارهٔ پروژه‌تان بگویید" lead="پس از بررسی درخواست، برای جلسهٔ شناخت مسئله با شما تماس می‌گیریم." />
            <ul className="mt-8 grid gap-3 text-[15px] text-ink-2">
              {["بررسی نیاز و پیشنهاد دامنهٔ اولیه", "پیشنهاد معماری و زمان‌بندی", "شفافیت در هزینه پیش از شروع"].map((t) => (
                <li key={t} className="flex items-center gap-3"><Icon name="check" className="size-4 text-violet" strokeWidth={2.5} />{t}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-line bg-paper p-6 sm:p-9">
            <LeadForm variant="project" />
          </div>
        </div>
      </section>
    </>
  );
}
