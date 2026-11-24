import { Reveal } from "@/components/motion/reveal";
import { Float, ParallaxShot, TiltCard } from "@/components/motion/fx";
import { SectionHeading } from "@/components/ui/section";
import { Icon } from "@/components/ui/icon";
import { BrowserFrame, Screenshot } from "@/components/mockups/frames";
import { LimoFoodBoard, limofoodScreens } from "@/components/mockups/limofood";
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
      <section className="bg-[#fff8f7] py-24 sm:py-28">
        <div className="container-x grid items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <SectionHeading eyebrow="تجربهٔ سفارش" eyebrowClass="text-sun-700" title="منوی آنلاین فروشگاه شما، با برند خودتان" lead="محصولات با دسته‌بندی، تصویر، وزن و قیمت؛ مشتری انتخاب می‌کند، به سبد اضافه می‌کند و آنلاین پرداخت می‌کند." />
            <ul className="mt-8 grid gap-3">
              {["منوی موبایلی با دسته‌بندی و تصویر محصول", "اعمال کد تخفیف هنگام سفارش", "پرداخت از طریق درگاه آنلاین", "اطلاع‌رسانی وضعیت سفارش با پیامک"].map((t) => (
                <li key={t} className="flex items-center gap-3 text-[15.5px]"><Icon name="check" className="size-4 text-sun-700" strokeWidth={2.5} />{t}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1} className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-b from-[#ffe3df] to-[#fff6f5] px-6 pt-12 sm:px-12">
            <ParallaxShot strength={26} tilt={false} className="relative mx-auto h-[460px] max-w-[440px] overflow-hidden rounded-t-2xl border border-b-0 border-line bg-white shadow-[var(--shadow-lift)]">
              <Screenshot src={limofoodScreens.menu.src} alt={limofoodScreens.menu.alt} sizes="440px" />
              <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
            </ParallaxShot>
          </Reveal>
        </div>
      </section>

      {/* نمای عملیاتی */}
      <section className="bg-white py-24 sm:py-28">
        <div className="container-x">
          <SectionHeading eyebrow="کنترل فروش آنلاین" eyebrowClass="text-sun-700" title="همهٔ سفارش‌ها، یک تابلوی عملیات" lead="سفارش‌های جدید، در حال آماده‌سازی، در حال ارسال و تحویل‌شده را یک‌جا ببینید و پیک را به سفارش اختصاص دهید." />
          <ParallaxShot strength={30} className="relative mt-12">
            <BrowserFrame title="لیموفود · پنل رستوران" className="shadow-[var(--shadow-lift)]"><LimoFoodBoard /></BrowserFrame>
          </ParallaxShot>
        </div>
      </section>

      <FeatureGrid p={p} title="امکانات سفارش‌گیری و مدیریت فروش" columns={4} />
      <HowItWorks p={p} title="راه‌اندازی تا اولین سفارش" />
      <Audience p={p} />
      <ProductFaq p={p} />
      <DemoSection p={p} title="کانال فروش آنلاین خودتان را راه بیندازید" lead="اطلاعات کسب‌وکارتان را بفرستید تا برای راه‌اندازی لیموفود با شما تماس بگیریم." />
      <OtherProducts current={p.slug} />
    </>
  );
}
