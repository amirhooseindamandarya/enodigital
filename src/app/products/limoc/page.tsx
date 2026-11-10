import { Reveal } from "@/components/motion/reveal";
import { Float, ParallaxShot, ScrollLine, Stagger, StaggerItem, TiltCard } from "@/components/motion/fx";
import { SectionHeading } from "@/components/ui/section";
import { Icon } from "@/components/ui/icon";
import { ButtonLink } from "@/components/ui/button";
import { FaqList } from "@/components/ui/accordion";
import { BrowserFrame, Screenshot } from "@/components/mockups/frames";
import { limocScreens } from "@/components/mockups/limoc";
import { LimocHero } from "@/components/product/heroes";
import { Breadcrumb, DemoSection, OtherProducts, SoftwareJsonLd } from "@/components/product/blocks";
import { limocFeatureGroups, limocJourney, limocQuoteSteps, limocSla, limocSmsEvents, products } from "@/lib/products";
import { JsonLd, pageMeta } from "@/lib/seo";

const p = products.limoc;
export const metadata = pageMeta({ title: p.seo.title, description: p.seo.description, path: p.href, keywords: p.seo.keywords });

const realTag = "rounded-full border border-limoc/20 bg-white px-2.5 py-0.5 text-[11px] font-semibold text-limoc-900";
const eyebrow = "text-limoc!";
const shadow = "shadow-[0_40px_90px_-40px_rgb(6_75_46/0.45)]";

function Check() {
  return <span className="grid size-5 shrink-0 place-items-center rounded-full bg-limoc/12 text-limoc"><Icon name="check" className="size-3" strokeWidth={3} /></span>;
}

export default function LimocPage() {
  return (
    <>
      <SoftwareJsonLd p={p} />
      <LimocHero crumb={<Breadcrumb items={[{ href: "/", label: "خانه" }, { href: "/products/", label: "محصولات" }, { label: p.name }]} />} />

      {/* مسیر کامل مشتری */}
      <section className="bg-white py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading center eyebrow="لیموسی فقط CRM نیست" eyebrowClass={eyebrow} title="تمام مسیر مشتری، از اولین تماس تا پشتیبانی" lead="در بیشتر تیم‌های خدماتی، هر مرحله در یک ابزار جداگانه انجام می‌شود. لیموسی همهٔ این مراحل را به هم وصل می‌کند." />
          <div className="relative mx-auto mt-16 max-w-5xl">
            <ScrollLine className="absolute inset-x-6 top-[27px] hidden h-1 lg:block" />
            <Stagger as="ol" className="relative grid grid-cols-3 gap-4 sm:grid-cols-5 lg:grid-cols-9">
              {limocJourney.map((s, i) => (
                <StaggerItem as="li" key={s} className="flex flex-col items-center gap-3 text-center">
                  <span className="relative grid size-14 place-items-center rounded-2xl border border-limoc/15 bg-white text-[17px] font-extrabold text-limoc shadow-[0_10px_24px_-14px_rgb(6_75_46/0.5)] transition-transform duration-300 hover:-translate-y-1 hover:bg-limoc hover:text-white">
                    {(i + 1).toLocaleString("fa-IR")}
                  </span>
                  <span className="text-[14.5px] font-bold text-limoc-ink">{s}</span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
          <p className="mt-10 text-center text-[14px] text-ink-3">هر مرحله به مرحلهٔ بعد وصل است: پیش‌فاکتور تأییدشده به معامله، معامله به قرارداد و قرارداد به پروژه و پشتیبانی می‌رسد.</p>
        </div>
      </section>

      {/* مسئله */}
      <section className="bg-limoc-cream py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading center eyebrow="مسئله" eyebrowClass={eyebrow} title={p.problem.title} lead="این‌ها مشکلاتی است که تیم‌های خدماتی کوچک هر روز با آن‌ها روبه‌رو می‌شوند." />
          <Stagger className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {p.problem.points.map((pt) => (
              <StaggerItem key={pt} className="flex items-start gap-4 rounded-2xl border border-[#f0e6c8] bg-white p-6 transition-shadow duration-300 hover:shadow-[0_20px_40px_-25px_rgb(6_75_46/0.35)]">
                <span className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-[#fde8e8] text-[#d6455d]"><Icon name="x" className="size-3.5" strokeWidth={2.5} /></span>
                <span className="text-[15.5px] leading-8 text-ink">{pt}</span>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-10">
            <div className="surface-limoc relative overflow-hidden rounded-3xl p-8 text-center sm:p-12">
              <h3 className="text-[24px] font-extrabold sm:text-[30px]">همهٔ این فرایندها را در لیموسی یکپارچه کنید</h3>
              <p className="mx-auto mt-3 max-w-2xl text-white/70">مشتری، فروش، قرارداد، پروژه و پشتیبانی؛ به‌جای چند ابزار جدا، در یک سیستم.</p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <ButtonLink href="#demo" variant="limocSun">{p.cta.primary}</ButtonLink>
                <ButtonLink href="#features" variant="ghostDark">مشاهدهٔ امکانات</ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* نتیجه‌ها */}
      <section id="features" className="bg-white py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading center eyebrow="نتیجه‌ای که می‌گیرید" eyebrowClass={eyebrow} title="لیموسی دقیقاً چه کاری برای شما انجام می‌دهد؟" lead="هر قابلیت با نتیجه‌ای که برای تیم شما دارد توضیح داده شده، نه با نام فنی آن." />
          <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {p.features.map((f) => (
              <StaggerItem key={f.title}>
                <TiltCard className="h-full rounded-2xl border border-line bg-white p-7 hover:border-limoc/30">
                  <span className="relative grid size-12 place-items-center rounded-xl bg-limoc-sun/25 text-limoc-900 transition-transform duration-300 group-hover/tilt:-translate-y-0.5 group-hover/tilt:scale-110"><Icon name={f.icon} className="size-5" /></span>
                  <h3 className="relative mt-5 text-[17.5px] font-extrabold">{f.title}</h3>
                  <p className="relative mt-1.5 text-[14.5px] leading-7 text-ink-2">{f.desc}</p>
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* قیف فروش */}
      <section className="overflow-hidden bg-limoc-cream py-24 sm:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <SectionHeading eyebrow="قیف فروش" eyebrowClass={eyebrow} title="بدانید هر فروش دقیقاً در چه مرحله‌ای است" lead="معاملات را در نمای Kanban بین مراحل Pipeline جابه‌جا کنید؛ از مذاکره و پیشنهاد ارسال‌شده تا برنده یا ازدست‌رفته. هر کارت مبلغ، مشتری و پیش‌فاکتور مرتبط را نشان می‌دهد." />
            <Stagger as="ul" className="mt-8 grid gap-3">
              {["Pipelineهای قابل تعریف و نمای لیستی یا Kanban", "تبدیل پیش‌فاکتور تأییدشده به فروش", "اختصاص مشتری و معامله به فروشنده", "تحلیل فروش و عملکرد فروشندگان"].map((t) => (
                <StaggerItem as="li" key={t} className="flex items-center gap-3 text-[15.5px]"><Check />{t}</StaggerItem>
              ))}
            </Stagger>
          </Reveal>
          <ParallaxShot className="relative">
            <span className={`absolute -top-8 end-0 z-10 ${realTag}`}>تصویر واقعی محصول</span>
            <BrowserFrame title="لیموسی · نمای Kanban فروش" className={shadow}><Screenshot src={limocScreens.kanban.src} alt={limocScreens.kanban.alt} sizes="(max-width: 1024px) 100vw, 700px" /></BrowserFrame>
          </ParallaxShot>
        </div>
      </section>

      {/* پیش‌فاکتور آنلاین */}
      <section className="overflow-hidden bg-white py-24 sm:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-[1.2fr_0.8fr]">
          <ParallaxShot className="relative order-2 lg:order-1">
            <span className={`absolute -top-8 end-0 z-10 ${realTag}`}>تصویر واقعی محصول</span>
            <BrowserFrame title="لیموسی · پیش‌فاکتور" className={shadow}><Screenshot src={limocScreens.quote.src} alt={limocScreens.quote.alt} sizes="(max-width: 1024px) 100vw, 700px" /></BrowserFrame>
          </ParallaxShot>
          <div className="order-1 lg:order-2">
            <SectionHeading eyebrow="قابلیت کلیدی" eyebrowClass={eyebrow} title="پیش‌فاکتور را ارسال کنید؛ مشتری آنلاین تأیید کند" lead="دیگر لازم نیست منتظر بمانید تا مشتری فایل را باز کند، امضا بزند و برایتان بفرستد." />
            <div className="relative mt-9">
              <ScrollLine vertical className="absolute bottom-4 right-[15px] top-4 w-1" />
              <Stagger as="ol" className="relative grid gap-6">
                {limocQuoteSteps.map((s, i) => (
                  <StaggerItem as="li" key={s.title} className="flex gap-4">
                    <span className="relative z-10 grid size-8 shrink-0 place-items-center rounded-full bg-limoc-sun text-[13px] font-extrabold text-limoc-ink ring-4 ring-white">{(i + 1).toLocaleString("fa-IR")}</span>
                    <span><b className="block text-[16px] text-limoc-ink">{s.title}</b><span className="text-[14.5px] leading-7 text-ink-2">{s.desc}</span></span>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </div>
        </div>
      </section>

      {/* پرتال مشتریان */}
      <section className="overflow-hidden bg-limoc-cream py-24 sm:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionHeading eyebrow="پرتال مشتری" eyebrowClass={eyebrow} title="یک پرتال اختصاصی برای مشتریانتان" lead="به‌جای ارسال مداوم فایل و پاسخ به سؤال «پروژهٔ من در چه مرحله‌ای است؟»، به مشتری یک پرتال اختصاصی بدهید." />
            <Stagger className="mt-8 grid gap-3 sm:grid-cols-2">
              {([["shield", "قراردادها", "قراردادهای جاری و شرایط آن‌ها"], ["file", "پیش‌فاکتورها", "مشاهده و دریافت PDF"], ["wallet", "فاکتورها و وضعیت مالی", "صورت‌حساب‌ها و ماندهٔ قابل پرداخت"], ["message", "تیکت‌ها", "ثبت تیکت، پاسخ و سابقهٔ درخواست‌ها"]] as const).map(([ic, t, d]) => (
                <StaggerItem key={t}>
                  <TiltCard className="h-full rounded-2xl border border-[#f0e6c8] bg-white p-5">
                    <Icon name={ic} className="relative size-5 text-limoc" />
                    <p className="relative mt-3 font-bold text-limoc-ink">{t}</p>
                    <p className="relative text-[13.5px] text-ink-3">{d}</p>
                  </TiltCard>
                </StaggerItem>
              ))}
            </Stagger>
            <p className="mt-5 text-[14px] leading-7 text-ink-3">مشتری با حساب جداگانهٔ خودش وارد می‌شود و فقط اطلاعات مربوط به خودش را می‌بیند؛ به پنل اصلی و اطلاعات سایر مشتریان دسترسی ندارد.</p>
          </div>
          <ParallaxShot className="relative">
            <span className={`absolute -top-8 end-0 z-10 ${realTag}`}>تصویر واقعی محصول</span>
            <BrowserFrame title="پرتال مشتریان" className={shadow}><Screenshot src={limocScreens.portal.src} alt={limocScreens.portal.alt} sizes="(max-width: 1024px) 100vw, 700px" /></BrowserFrame>
          </ParallaxShot>
        </div>
      </section>

      {/* SLA */}
      <section className="surface-limoc overflow-hidden py-24 sm:py-32">
        <div className="container-x">
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <SectionHeading dark eyebrow="برای شرکت‌های خدماتی" eyebrowClass="text-limoc-sun!" title="پشتیبانی حرفه‌ای با SLA" lead="اگر به مشتری تعهد زمانی می‌دهید، باید بتوانید آن را اندازه بگیرید. لیموسی مهلت پاسخ و حل هر درخواست را بر اساس قوانین خودتان محاسبه و رصد می‌کند." />
              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5" aria-hidden>
                <div className="flex justify-between text-[13px] text-white/60"><span>زمان باقی‌مانده تا مهلت پاسخ</span><b className="text-white">۲ ساعت کاری</b></div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <Reveal y={0} className="h-full"><div className="h-full w-2/3 origin-right animate-[grow-x_1.6s_ease-out_both] rounded-full bg-gradient-to-l from-limoc-sun to-[#8bd17c]" /></Reveal>
                </div>
                <p className="mt-3 text-[12px] text-white/40">نمونهٔ نمایشی از نحوهٔ محاسبهٔ مهلت</p>
              </div>
            </div>
            <ParallaxShot tilt={false}>
              <BrowserFrame dark title="تیکت پشتیبانی" className="shadow-[var(--shadow-float)]"><Screenshot src={limocScreens.ticket.src} alt={limocScreens.ticket.alt} sizes="(max-width: 1024px) 100vw, 640px" /></BrowserFrame>
            </ParallaxShot>
          </div>
          <Stagger className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {limocSla.map((x) => (
              <StaggerItem key={x.title} className="group rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition-colors duration-300 hover:border-limoc-sun/40 hover:bg-white/[0.06]">
                <span className="grid size-10 place-items-center rounded-xl bg-limoc-sun text-limoc-ink transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110"><Icon name="clock" className="size-[18px]" /></span>
                <h3 className="mt-4 text-[17px] font-extrabold">{x.title}</h3>
                <p className="mt-1.5 text-[14.5px] leading-7 text-white/60">{x.desc}</p>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-[17px] font-extrabold">پیگیری‌های مهم فراموش نمی‌شوند</h3>
              <p className="mt-1 text-[14.5px] text-white/60">لیموسی می‌تواند به پنل پیامکی کسب‌وکار شما متصل شود تا رویدادهای مهم به تیم یا مشتری اطلاع داده شود.</p>
            </div>
            <ul className="flex flex-wrap gap-2">
              {limocSmsEvents.map((e) => <li key={e} className="rounded-full border border-white/15 px-3 py-1 text-[13px] text-white/80 transition-colors hover:border-limoc-sun hover:text-limoc-sun">{e}</li>)}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* همهٔ امکانات */}
      <section className="bg-white py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading center eyebrow="همهٔ امکانات" eyebrowClass={eyebrow} title="همهٔ امکانات، دسته‌بندی‌شده" />
          <Stagger className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {limocFeatureGroups.map((g) => (
              <StaggerItem key={g.title}>
                <TiltCard className="h-full rounded-2xl border border-line bg-limoc-cream/60 p-7 hover:border-limoc/30">
                  <span className="relative grid size-11 place-items-center rounded-xl bg-limoc text-white"><Icon name={g.icon} className="size-5" /></span>
                  <h3 className="relative mt-5 text-[18px] font-extrabold text-limoc-ink">{g.title}</h3>
                  <p className="relative mt-1 text-[14.5px] leading-7 text-ink-2">{g.desc}</p>
                  <ul className="relative mt-4 grid gap-2">
                    {g.items.map((it) => <li key={it} className="flex items-center gap-2 text-[14.5px]"><Check />{it}</li>)}
                  </ul>
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-10 grid items-center gap-8 overflow-hidden rounded-3xl border border-line bg-limoc-cream p-6 sm:p-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h3 className="text-[22px] font-extrabold text-limoc-ink">پروژه، قرارداد و پورسانت در یک فرم</h3>
              <p className="mt-2 text-[15px] leading-8 text-ink-2">هر پروژه به شرکت طرف قرارداد، قرارداد و مدیر پروژه متصل است و مبنای پورسانت و سیاست موجودی آن مشخص می‌شود.</p>
            </div>
            <Float duration={8}>
              <BrowserFrame title="ویرایش پروژه" className={shadow}><Screenshot src={limocScreens.project.src} alt={limocScreens.project.alt} sizes="(max-width: 1024px) 100vw, 640px" /></BrowserFrame>
            </Float>
          </Reveal>
        </div>
      </section>

      {/* بازار هدف */}
      <section className="bg-limoc-cream py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading center eyebrow="بازار هدف" eyebrowClass={eyebrow} title="لیموسی برای چه کسانی مناسب است؟" lead="برای تیم‌های خدماتی ۲ تا ۱۰ نفره که فروش، پروژه و پشتیبانی‌شان به هم گره خورده است." />
          <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {p.industries.map((it) => (
              <StaggerItem key={it.title}>
                <TiltCard className="h-full rounded-2xl border border-[#f0e6c8] bg-white p-7">
                  <span className="relative grid size-12 place-items-center rounded-2xl bg-limoc/10 text-limoc"><Icon name={it.icon} className="size-6" /></span>
                  <h3 className="relative mt-5 text-[18px] font-extrabold">{it.title}</h3>
                  <p className="relative mt-1 text-[15px] leading-7 text-ink-2">{it.desc}</p>
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>
          <p className="mt-6 text-center text-[14px] text-ink-3">فریلنسرها، فروشندگان مستقل و تیم‌های کوچک فروش هم می‌توانند از لیموسی استفاده کنند.</p>
        </div>
      </section>

      {/* راه‌اندازی */}
      <section className="bg-white py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading center eyebrow="شروع کار" eyebrowClass={eyebrow} title="در چند قدم فضای کاری خود را بسازید" />
          <div className="relative mt-14">
            <ScrollLine className="absolute inset-x-[10%] top-6 hidden h-1 md:block" />
            <Stagger as="ol" className="relative grid gap-8 md:grid-cols-5">
              {p.steps.map((s, i) => (
                <StaggerItem as="li" key={s.title} className="text-center">
                  <span className="mx-auto grid size-12 place-items-center rounded-full bg-limoc text-[15px] font-extrabold text-white ring-8 ring-white">{(i + 1).toLocaleString("fa-IR")}</span>
                  <h3 className="mt-4 text-[16.5px] font-extrabold">{s.title}</h3>
                  <p className="mt-1 text-[14px] leading-7 text-ink-2">{s.desc}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-limoc-cream py-24 sm:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeading eyebrow="سؤالات متداول" eyebrowClass={eyebrow} title="پرسش‌های رایج دربارهٔ لیموسی" />
            <div className="mt-8 rounded-2xl border border-limoc-sun/50 bg-limoc-sun/20 p-5">
              <p className="font-bold text-limoc-ink">می‌خواهید خودتان امتحان کنید؟</p>
              <p className="mt-1 text-[14px] text-ink-2">لیموسی ۶۰ روز استفادهٔ رایگان دارد.</p>
              <ButtonLink href={p.externalUrl!} external variant="limoc" size="sm" className="mt-4">شروع در limoc.ir <Icon name="external" /></ButtonLink>
            </div>
          </div>
          <FaqList items={p.faqs} />
        </div>
        <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: p.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />
      </section>

      <div className="bg-limoc-cream pt-4">
        <DemoSection p={p} surface="surface-limoc" title="لیموسی را با فرایند فروش تیم خودتان ببینید" lead="درخواست دمو ثبت کنید تا مسیر فروش، پیش‌فاکتور، پروژه و پشتیبانی تیم شما را در لیموسی مرور کنیم." />
      </div>
      <OtherProducts current={p.slug} />
    </>
  );
}
