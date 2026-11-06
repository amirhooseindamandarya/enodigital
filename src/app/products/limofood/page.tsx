import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section";
import { Icon } from "@/components/ui/icon";
import { BrowserFrame, MockLabel, PhoneFrame } from "@/components/mockups/frames";
import { LimoFoodBoard, LimoFoodMenu, OrderCard } from "@/components/mockups/limofood";
import { LimoFoodHero } from "@/components/product/heroes";
import { Audience, Breadcrumb, DemoSection, FeatureGrid, HowItWorks, OtherProducts, ProblemSection, ProductFaq, SoftwareJsonLd } from "@/components/product/blocks";
import { products } from "@/lib/products";
import { pageMeta } from "@/lib/seo";

const p = products.limofood;
export const metadata = pageMeta({ title: p.seo.title, description: p.seo.description, path: p.href, keywords: p.seo.keywords });

export default function LimoFoodPage() {
  return (
    <>
      <SoftwareJsonLd p={p} />
      <LimoFoodHero crumb={<Breadcrumb items={[{ href: "/", label: "خانه" }, { href: "/products/", label: "محصولات" }, { label: p.name }]} />} />
      <ProblemSection p={p} />

      {/* تجربهٔ مشتری */}
      <section className="bg-[#fffaf1] py-24 sm:py-28">
        <div className="container-x grid items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <SectionHeading eyebrow="تجربهٔ سفارش" eyebrowClass="text-sun-700" title="از دیدن منو تا پرداخت، روی موبایل مشتری" lead="منوی آنلاین با دسته‌بندی و تصویر، سبد خرید ساده، کد تخفیف و پرداخت آنلاین؛ بدون نصب اپلیکیشن." />
            <ul className="mt-8 grid gap-3">
              {["منوی موبایلی با دسته‌بندی و تصویر محصول", "اعمال کد تخفیف هنگام سفارش", "پرداخت از طریق درگاه آنلاین", "اطلاع‌رسانی وضعیت سفارش با پیامک"].map((t) => (
                <li key={t} className="flex items-center gap-3 text-[15.5px]"><Icon name="check" className="size-4 text-sun-700" strokeWidth={2.5} />{t}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1} className="relative flex items-end justify-center gap-5 rounded-[1.75rem] bg-gradient-to-b from-[#ffecc4] to-[#fff6e3] px-6 pt-14 sm:gap-8">
            <MockLabel className="absolute end-5 top-5" />
            <PhoneFrame className="w-[46%] max-w-[250px] translate-y-6"><LimoFoodMenu /></PhoneFrame>
            <div className="mb-14 w-[46%] max-w-[260px] space-y-3">
              <OrderCard className="shadow-[var(--shadow-lift)]" status="new" />
              <OrderCard className="hidden shadow-[var(--shadow-lift)] sm:block" status="send" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* نمای عملیاتی */}
      <section className="bg-white py-24 sm:py-28">
        <div className="container-x">
          <SectionHeading eyebrow="کنترل فروش آنلاین" eyebrowClass="text-sun-700" title="همهٔ سفارش‌ها، یک تابلوی عملیات" lead="سفارش‌های جدید، در حال آماده‌سازی، در حال ارسال و تحویل‌شده را یک‌جا ببینید و پیک را به سفارش اختصاص دهید." />
          <Reveal className="relative mt-12">
            <MockLabel className="absolute -top-8 end-0" />
            <BrowserFrame title="LimoFood · پنل رستوران" className="shadow-[var(--shadow-lift)]"><LimoFoodBoard /></BrowserFrame>
          </Reveal>
        </div>
      </section>

      <FeatureGrid p={p} title="امکانات سفارش‌گیری و مدیریت فروش" columns={4} />
      <HowItWorks p={p} title="راه‌اندازی تا اولین سفارش" />
      <Audience p={p} />
      <ProductFaq p={p} />
      <DemoSection p={p} title="کانال فروش آنلاین خودتان را راه بیندازید" lead="اطلاعات کسب‌وکارتان را بفرستید تا برای راه‌اندازی LimoFood با شما تماس بگیریم." />
      <OtherProducts current={p.slug} />
    </>
  );
}
