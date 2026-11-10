import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section";
import { Icon } from "@/components/ui/icon";
import { ButtonLink } from "@/components/ui/button";
import { BrowserFrame, Screenshot } from "@/components/mockups/frames";
import { limocScreens } from "@/components/mockups/limoc";
import { LimocHero } from "@/components/product/heroes";
import { Audience, Breadcrumb, DemoSection, FeatureGrid, HowItWorks, OtherProducts, ProblemSection, ProductFaq, SoftwareJsonLd } from "@/components/product/blocks";
import { limocFeatureGroups, limocJourney, limocQuoteSteps, limocSla, limocSmsEvents, products } from "@/lib/products";
import { pageMeta } from "@/lib/seo";

const p = products.limoc;
export const metadata = pageMeta({ title: p.seo.title, description: p.seo.description, path: p.href, keywords: p.seo.keywords });

const realTag = "rounded-full border border-line bg-white px-2.5 py-0.5 text-[11px] font-semibold text-ink-3";

export default function LimocPage() {
  return (
    <>
      <SoftwareJsonLd p={p} />
      <LimocHero crumb={<Breadcrumb items={[{ href: "/", label: "خانه" }, { href: "/products/", label: "محصولات" }, { label: p.name }]} />} />

      {/* مسیر کامل مشتری */}
      <section className="bg-white py-24 sm:py-28">
        <div className="container-x">
          <SectionHeading center eyebrow="لیموسی فقط CRM نیست" eyebrowClass="text-indigo" title="تمام مسیر مشتری، از اولین تماس تا پشتیبانی" lead="در بیشتر تیم‌های خدماتی، هر مرحله در یک ابزار جداگانه انجام می‌شود. لیموسی همهٔ این مراحل را به هم وصل می‌کند." />
          <Reveal>
            <ol className="mx-auto mt-14 flex max-w-5xl flex-wrap justify-center gap-x-2 gap-y-3">
              {limocJourney.map((s, i) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="flex items-center gap-2 rounded-2xl border border-line bg-paper px-4 py-3 text-[15px] font-bold">
                    <span className="grid size-6 place-items-center rounded-full bg-indigo text-[12px] text-white">{(i + 1).toLocaleString("fa-IR")}</span>{s}
                  </span>
                  {i < limocJourney.length - 1 && <Icon name="arrow" className="size-4 text-indigo/60" />}
                </li>
              ))}
            </ol>
            <p className="mt-6 text-center text-[14px] text-ink-3">هر مرحله به مرحلهٔ بعد وصل است: پیش‌فاکتور تأییدشده به معامله، معامله به قرارداد و قرارداد به پروژه و پشتیبانی می‌رسد.</p>
          </Reveal>
        </div>
      </section>

      <ProblemSection p={p} />
      <FeatureGrid p={p} title="لیموسی دقیقاً چه کاری برای شما انجام می‌دهد؟" />

      {/* قیف فروش */}
      <section className="bg-white py-24 sm:py-28">
        <div className="container-x grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <SectionHeading eyebrow="قیف فروش" eyebrowClass="text-indigo" title="بدانید هر فروش دقیقاً در چه مرحله‌ای است" lead="معاملات را در نمای Kanban بین مراحل Pipeline جابه‌جا کنید؛ از مذاکره و پیشنهاد ارسال‌شده تا برنده یا ازدست‌رفته. هر کارت مبلغ، مشتری و پیش‌فاکتور مرتبط را نشان می‌دهد." />
            <ul className="mt-8 grid gap-3">
              {["Pipelineهای قابل تعریف و نمای لیستی یا Kanban", "تبدیل پیش‌فاکتور تأییدشده به فروش", "اختصاص مشتری و معامله به فروشنده", "تحلیل فروش و عملکرد فروشندگان"].map((t) => (
                <li key={t} className="flex items-center gap-3 text-[15.5px]"><Icon name="check" className="size-4 text-indigo" strokeWidth={2.5} />{t}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1} className="relative">
            <span className={`absolute -top-8 end-0 ${realTag}`}>تصویر واقعی محصول</span>
            <BrowserFrame title="لیموسی · نمای Kanban فروش" className="shadow-[var(--shadow-lift)]"><Screenshot src={limocScreens.kanban.src} alt={limocScreens.kanban.alt} sizes="(max-width: 1024px) 100vw, 640px" /></BrowserFrame>
          </Reveal>
        </div>
      </section>

      {/* پیش‌فاکتور آنلاین */}
      <section className="bg-paper py-24 sm:py-28">
        <div className="container-x grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal className="relative order-2 lg:order-1">
            <span className={`absolute -top-8 end-0 ${realTag}`}>تصویر واقعی محصول</span>
            <BrowserFrame title="لیموسی · پیش‌فاکتور" className="shadow-[var(--shadow-lift)]"><Screenshot src={limocScreens.quote.src} alt={limocScreens.quote.alt} sizes="(max-width: 1024px) 100vw, 640px" /></BrowserFrame>
          </Reveal>
          <Reveal className="order-1 lg:order-2">
            <SectionHeading eyebrow="قابلیت کلیدی" eyebrowClass="text-indigo" title="پیش‌فاکتور را ارسال کنید؛ مشتری آنلاین تأیید کند" lead="دیگر لازم نیست منتظر بمانید تا مشتری فایل را باز کند، امضا بزند و برایتان بفرستد. یک لینک بفرستید و پاسخ او را همان‌جا بگیرید." />
            <ol className="mt-8 grid gap-4">
              {limocQuoteSteps.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-sun text-[13px] font-extrabold text-navy">{(i + 1).toLocaleString("fa-IR")}</span>
                  <span><b className="block text-[16px]">{s.title}</b><span className="text-[14.5px] leading-7 text-ink-2">{s.desc}</span></span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* پرتال مشتریان */}
      <section className="bg-white py-24 sm:py-28">
        <div className="container-x grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <SectionHeading eyebrow="پرتال مشتری" eyebrowClass="text-indigo" title="یک پرتال اختصاصی برای مشتریانتان" lead="به‌جای ارسال مداوم فایل و پاسخ به سؤال «پروژهٔ من در چه مرحله‌ای است؟»، به مشتری یک پرتال اختصاصی بدهید تا اطلاعات مرتبط با خودش را ببیند." />
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[["shield", "قراردادها", "قراردادهای جاری و شرایط آن‌ها"], ["file", "پیش‌فاکتورها", "مشاهده و دریافت PDF"], ["wallet", "فاکتورها و وضعیت مالی", "صورت‌حساب‌ها و ماندهٔ قابل پرداخت"], ["message", "تیکت‌ها", "ثبت تیکت، پاسخ و سابقهٔ درخواست‌ها"]].map(([ic, t, d]) => (
                <div key={t} className="rounded-2xl border border-line p-4">
                  <Icon name={ic as "shield"} className="size-5 text-indigo" />
                  <p className="mt-3 font-bold">{t}</p>
                  <p className="text-[13.5px] text-ink-3">{d}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-[14px] leading-7 text-ink-3">مشتری با حساب جداگانهٔ خودش وارد می‌شود و فقط اطلاعات مربوط به خودش را می‌بیند؛ به پنل اصلی و اطلاعات سایر مشتریان دسترسی ندارد.</p>
          </Reveal>
          <Reveal delay={0.1} className="relative">
            <span className={`absolute -top-8 end-0 ${realTag}`}>تصویر واقعی محصول</span>
            <BrowserFrame title="پرتال مشتریان" className="shadow-[var(--shadow-lift)]"><Screenshot src={limocScreens.portal.src} alt={limocScreens.portal.alt} sizes="(max-width: 1024px) 100vw, 640px" /></BrowserFrame>
          </Reveal>
        </div>
      </section>

      {/* SLA */}
      <section className="surface-dark py-24 sm:py-28">
        <div className="container-x">
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_1fr]">
            <SectionHeading dark eyebrow="برای شرکت‌های خدماتی" title="پشتیبانی حرفه‌ای با SLA" lead="اگر به مشتری تعهد زمانی می‌دهید، باید بتوانید آن را اندازه بگیرید. لیموسی مهلت پاسخ و حل هر درخواست را بر اساس قوانین خودتان محاسبه و رصد می‌کند." />
            <Reveal className="relative">
              <BrowserFrame dark title="تیکت پشتیبانی" className="shadow-[var(--shadow-float)]"><Screenshot src={limocScreens.ticket.src} alt={limocScreens.ticket.alt} sizes="(max-width: 1024px) 100vw, 560px" /></BrowserFrame>
            </Reveal>
          </div>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {limocSla.map((x, i) => (
              <Reveal key={x.title} delay={(i % 3) * 0.05} className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
                <span className="grid size-9 place-items-center rounded-lg bg-sun text-navy"><Icon name="clock" className="size-[18px]" /></span>
                <h3 className="mt-4 text-[17px] font-extrabold">{x.title}</h3>
                <p className="mt-1.5 text-[14.5px] leading-7 text-white/60">{x.desc}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-[17px] font-extrabold">پیگیری‌های مهم فراموش نمی‌شوند</h3>
              <p className="mt-1 text-[14.5px] text-white/60">لیموسی می‌تواند به پنل پیامکی کسب‌وکار شما متصل شود تا رویدادهای مهم به تیم یا مشتری اطلاع داده شود.</p>
            </div>
            <ul className="flex flex-wrap gap-2">
              {limocSmsEvents.map((e) => <li key={e} className="rounded-full border border-white/15 px-3 py-1 text-[13px] text-white/80">{e}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* همهٔ امکانات */}
      <section className="bg-paper py-24 sm:py-28">
        <div className="container-x">
          <SectionHeading eyebrow="همهٔ امکانات" eyebrowClass="text-indigo" title="همهٔ امکانات، دسته‌بندی‌شده" />
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {limocFeatureGroups.map((g, i) => (
              <Reveal key={g.title} delay={(i % 3) * 0.05} className="rounded-2xl border border-line bg-white p-7">
                <span className="grid size-11 place-items-center rounded-xl bg-indigo/8 text-indigo"><Icon name={g.icon} className="size-5" /></span>
                <h3 className="mt-5 text-[18px] font-extrabold">{g.title}</h3>
                <p className="mt-1 text-[14.5px] leading-7 text-ink-2">{g.desc}</p>
                <ul className="mt-4 grid gap-2">
                  {g.items.map((it) => <li key={it} className="flex items-center gap-2 text-[14.5px]"><Icon name="check" className="size-4 text-indigo" strokeWidth={2.5} />{it}</li>)}
                </ul>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 grid items-center gap-8 rounded-3xl border border-line bg-white p-6 sm:p-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h3 className="text-[20px] font-extrabold">پروژه، قرارداد و پورسانت در یک فرم</h3>
              <p className="mt-2 text-[15px] leading-8 text-ink-2">هر پروژه به شرکت طرف قرارداد، قرارداد و مدیر پروژه متصل است و مبنای پورسانت و سیاست موجودی آن مشخص می‌شود.</p>
            </div>
            <BrowserFrame title="ویرایش پروژه" className="shadow-[var(--shadow-soft)]"><Screenshot src={limocScreens.project.src} alt={limocScreens.project.alt} sizes="(max-width: 1024px) 100vw, 640px" /></BrowserFrame>
          </Reveal>
        </div>
      </section>

      <Audience p={p} title="لیموسی برای چه کسانی مناسب است؟" />
      <HowItWorks p={p} title="در چند قدم فضای کاری خود را بسازید" />
      <ProductFaq p={p} />
      <section className="bg-white pb-12">
        <div className="container-x">
          <div className="flex flex-col items-start justify-between gap-4 rounded-3xl bg-indigo/6 p-7 sm:flex-row sm:items-center">
            <p className="text-[16px] font-bold">می‌خواهید خودتان امتحان کنید؟ لیموسی ۶۰ روز استفادهٔ رایگان دارد.</p>
            <ButtonLink href={p.externalUrl!} external>شروع در limoc.ir <Icon name="external" /></ButtonLink>
          </div>
        </div>
      </section>
      <DemoSection p={p} title="لیموسی را با فرایند فروش تیم خودتان ببینید" lead="درخواست دمو ثبت کنید تا مسیر فروش، پیش‌فاکتور، پروژه و پشتیبانی تیم شما را در لیموسی مرور کنیم." />
      <OtherProducts current={p.slug} />
    </>
  );
}
