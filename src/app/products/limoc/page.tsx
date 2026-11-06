import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section";
import { Icon } from "@/components/ui/icon";
import { BrowserFrame, MockLabel } from "@/components/mockups/frames";
import { LimocCustomer, LimocTicket } from "@/components/mockups/limoc";
import { LimocHero } from "@/components/product/heroes";
import { Audience, Breadcrumb, DemoSection, FeatureGrid, HowItWorks, OtherProducts, ProblemSection, ProductFaq, SoftwareJsonLd } from "@/components/product/blocks";
import { products } from "@/lib/products";
import { pageMeta } from "@/lib/seo";

const p = products.limoc;
export const metadata = pageMeta({ title: p.seo.title, description: p.seo.description, path: p.href, keywords: p.seo.keywords });

export default function LimocPage() {
  return (
    <>
      <SoftwareJsonLd p={p} />
      <LimocHero crumb={<Breadcrumb items={[{ href: "/", label: "خانه" }, { href: "/products/", label: "محصولات" }, { label: p.name }]} />} />
      <ProblemSection p={p} />
      <HowItWorks p={p} title="از اولین تماس تا پشتیبانی، در یک مسیر" />

      <section className="bg-white py-24 sm:py-28">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <SectionHeading eyebrow="پروندهٔ واحد مشتری" eyebrowClass="text-indigo" title="هر کس پرونده را باز کند، همان تصویر را می‌بیند" lead="تماس‌ها، جلسات، یادآوری‌ها، فرصت‌های فروش، پیش‌فاکتورها و تیکت‌ها در پروندهٔ هر مشتری کنار هم ثبت می‌شوند؛ حافظهٔ مشترک تیم، نه حافظهٔ افراد." />
            <ul className="mt-8 grid gap-3">
              {["تاریخچهٔ کامل تعاملات با هر مشتری", "یادآوری پیگیری برای هر عضو تیم", "تیکت‌های پشتیبانی با زمان پاسخ تعهدشده (SLA)", "پرتال اختصاصی برای مشاهدهٔ وضعیت توسط مشتری"].map((t) => (
                <li key={t} className="flex items-center gap-3 text-[15.5px]"><Icon name="check" className="size-4 text-indigo" strokeWidth={2.5} />{t}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1} className="relative rounded-[1.75rem] bg-gradient-to-br from-indigo/[0.08] to-violet/[0.06] p-6 sm:p-10">
            <MockLabel className="absolute end-5 top-5" />
            <div className="grid gap-4 pt-6 sm:grid-cols-[1.1fr_1fr] sm:items-start">
              <BrowserFrame title="پروندهٔ مشتری" className="shadow-[var(--shadow-lift)]"><LimocCustomer /></BrowserFrame>
              <div className="overflow-hidden rounded-2xl border border-line shadow-[var(--shadow-lift)] sm:mt-16"><LimocTicket /></div>
            </div>
          </Reveal>
        </div>
      </section>

      <FeatureGrid p={p} title="نظم در فروش، اجرا و پشتیبانی" />
      <Audience p={p} />
      <ProductFaq p={p} />
      <DemoSection p={p} title="Limoc را با فرایند فروش تیم خودتان ببینید" lead="درخواست دمو ثبت کنید تا مسیر فروش و پشتیبانی تیم شما را در Limoc مرور کنیم." />
      <OtherProducts current={p.slug} />
    </>
  );
}
