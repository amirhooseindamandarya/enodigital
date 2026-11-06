import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section";
import { Icon } from "@/components/ui/icon";
import { BrowserFrame, PhoneFrame, Screenshot } from "@/components/mockups/frames";
import { BenefitsCycle, benefitsScreens } from "@/components/mockups/benefits";
import { BenefitsHero } from "@/components/product/heroes";
import { Audience, Breadcrumb, DemoSection, FeatureGrid, HowItWorks, OtherProducts, ProblemSection, ProductFaq, SoftwareJsonLd } from "@/components/product/blocks";
import { products } from "@/lib/products";
import { pageMeta } from "@/lib/seo";

const p = products.benefits;
export const metadata = pageMeta({ title: p.seo.title, description: p.seo.description, path: p.href, keywords: p.seo.keywords });

const panels = [
  { name: "پنل مدیریت سازمان", who: "مدیران، منابع انسانی و واحد مالی", img: benefitsScreens.wizard, mobile: false,
    items: ["مدیریت کارکنان (تکی و ورود از Excel)", "فروشندگان، شعب و قراردادها", "صدور، تمدید و غیرفعال‌سازی بن", "تراکنش‌ها، تسویه‌ها و ۲۸ گزارش", "مدیران، نقش‌ها و لاگ سیستم"] },
  { name: "پنل فروشندگان", who: "فروشگاه‌های طرف قرارداد", img: benefitsScreens.sellerPurchase, mobile: true,
    items: ["شناسایی کارمند با QR، کد ملی یا شمارهٔ پرسنلی", "ثبت مبلغ فاکتور و درخواست خرید", "سفارش‌ها و مشتریان", "کیف پول: طلب، دریافت‌شده و مانده", "تاریخچهٔ تسویه و رسیدها"] },
  { name: "پنل کارکنان", who: "کارکنان مشمول", img: benefitsScreens.employeeVoucher, mobile: true,
    items: ["مشاهدهٔ اعتبار اولیه، مصرف‌شده و مانده", "فروشگاه‌های طرف قرارداد و تخفیف‌ها", "تأیید یا لغو درخواست خرید با کد", "تراکنش‌ها با جزئیات سهم بن و نقد", "حالت روشن و تیره"] },
];

export default function BenefitsPage() {
  return (
    <>
      <SoftwareJsonLd p={p} />
      <BenefitsHero crumb={<Breadcrumb dark items={[{ href: "/", label: "خانه" }, { href: "/products/", label: "محصولات" }, { label: "سامانهٔ رفاهیات" }]} />} />

      <section id="cycle" className="bg-paper py-24 sm:py-28">
        <div className="container-x">
          <SectionHeading center eyebrow="چرخهٔ سامانه" eyebrowClass="text-teal-700" title="سازمان، کارمند و فروشگاه؛ در یک چرخهٔ شفاف" lead="هر خرید یک تراکنش کامل است: کارمند، بن، فروشگاه، شعبه، مبلغ و زمان." />
          <Reveal className="mt-14"><BenefitsCycle /></Reveal>
        </div>
      </section>

      <ProblemSection p={p} />

      <section className="bg-white pb-24 sm:pb-28">
        <div className="container-x">
          <SectionHeading eyebrow="سه پنل، یک سامانه" eyebrowClass="text-teal-700" title="هر نقش، پنل مخصوص خودش" lead="هر سه پنل از طریق API با یک بک‌اند مشترک کار می‌کنند و ارقام در همهٔ آن‌ها یکسان است." />
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {panels.map((pn, i) => (
              <Reveal key={pn.name} delay={i * 0.06}>
                <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white">
                  <div className="relative flex h-[280px] items-start justify-center overflow-hidden bg-navy px-6 pt-8">
                    {pn.mobile ? (
                      <PhoneFrame className="w-[56%]" screenClassName="aspect-[9/17.5]"><Screenshot src={pn.img.src} alt={pn.img.alt} sizes="220px" /></PhoneFrame>
                    ) : (
                      <BrowserFrame dark className="w-[118%] shrink-0 shadow-[var(--shadow-float)]"><Screenshot src={pn.img.src} alt={pn.img.alt} sizes="480px" /></BrowserFrame>
                    )}
                  </div>
                  <div className="flex-1 p-7">
                    <h3 className="text-[19px] font-extrabold">{pn.name}</h3>
                    <p className="text-[14px] text-ink-3">{pn.who}</p>
                    <ul className="mt-5 grid gap-2.5">
                      {pn.items.map((t) => <li key={t} className="flex items-start gap-2.5 text-[14.5px] leading-7"><Icon name="check" className="mt-1.5 size-4 shrink-0 text-teal-700" strokeWidth={2.5} />{t}</li>)}
                    </ul>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FeatureGrid p={p} dark title="قابلیت‌های پیاده‌سازی‌شده" />
      <HowItWorks p={p} title="از صدور بن تا تسویه" />

      <section className="bg-white py-24 sm:py-28">
        <div className="container-x grid items-center gap-14 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <SectionHeading eyebrow="تسویه با فروشندگان" eyebrowClass="text-teal-700" title="طلب هر فروشنده، مستقیم از تراکنش‌ها" lead="مدیر پرداخت به فروشنده را با تاریخ، شمارهٔ پیگیری و رسید ثبت می‌کند؛ پرداخت جزئی یا کامل. فروشنده همان ارقام را در کیف پول خود می‌بیند." />
            <p className="mt-6 rounded-2xl border border-line bg-paper p-4 text-[14px] leading-7 text-ink-2">پرداخت به فروشندگان توسط سازمان انجام می‌شود و سامانه آن را ثبت و پیگیری می‌کند؛ پرداخت خودکار بانکی بخشی از سامانه نیست.</p>
          </Reveal>
          <Reveal delay={0.1} className="flex justify-center rounded-[1.75rem] bg-navy px-6 pt-10">
            <PhoneFrame className="w-[min(260px,70%)] translate-y-8" screenClassName="aspect-[9/17]"><Screenshot src={benefitsScreens.sellerWallet.src} alt={benefitsScreens.sellerWallet.alt} sizes="260px" /></PhoneFrame>
          </Reveal>
        </div>
      </section>

      <Audience p={p} title="برای سازمان، کارکنان و فروشگاه‌ها" />
      <ProductFaq p={p} />
      <DemoSection p={p} title="رفاهیات سازمانتان را دیجیتال کنید" lead="در جلسهٔ دمو، سه پنل سامانه را با سناریوی سازمان شما مرور می‌کنیم: روش تعیین مبلغ، فروشگاه‌های طرف قرارداد و فرایند تسویه." />
      <OtherProducts current={p.slug} />
    </>
  );
}
