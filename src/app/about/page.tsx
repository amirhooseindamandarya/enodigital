import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section";
import { Icon } from "@/components/ui/icon";
import { Breadcrumb } from "@/components/product/blocks";
import { FinalCta } from "@/components/home/sections";
import { approach } from "@/lib/content";
import { productList } from "@/lib/products";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import Image from "next/image";
import logoFull from "@/assets/brand/logo-full.webp";

export const metadata = pageMeta({ title: "درباره ما", description: `${site.name}؛ شرکت توسعهٔ نرم‌افزار با دو حوزهٔ فعالیت: محصولات نرم‌افزاری آماده و توسعهٔ نرم‌افزار سفارشی.`, path: "/about/" });

export default function AboutPage() {
  return (
    <>
      <section className="surface-dark relative overflow-hidden pt-[72px]">
        <div aria-hidden className="grid-lines pointer-events-none absolute inset-0" />
        <div className="container-x relative pb-24 pt-10 sm:pt-14">
          <Breadcrumb dark items={[{ href: "/", label: "خانه" }, { label: "درباره ما" }]} />
          <div className="mt-12 max-w-3xl">
            <p className="eyebrow text-[#f5b82e]">درباره {site.name}</p>
            <h1 className="h-display mt-5 text-white">نرم‌افزار می‌سازیم تا کار، ساده‌تر و قابل پیگیری‌تر شود.</h1>
            {/* TODO: داستان، سال تأسیس و تیم شرکت را اضافه کنید */}
            <p className="mt-6 text-[17px] leading-[2] text-white/70 sm:text-[19px]">{site.name} یک شرکت توسعهٔ نرم‌افزار است که در دو حوزه فعالیت می‌کند: ساخت و پشتیبانی محصولات نرم‌افزاری آماده، و طراحی و توسعهٔ نرم‌افزار سفارشی برای سازمان‌ها و کسب‌وکارها.</p>
          </div>
        </div>
      </section>

      <section className="bg-white pt-24 sm:pt-28">
        <div className="container-x">
          <Reveal className="grid items-center gap-10 rounded-3xl border border-line bg-paper p-8 sm:p-12 md:grid-cols-[0.8fr_1.2fr]">
            <Image src={logoFull} alt={`لوگوی ${site.name}؛ ${site.legalTagline}`} className="mx-auto h-auto w-full max-w-[340px]" sizes="340px" />
            <div>
              <p className="eyebrow text-amber-ink">هویت ما</p>
              <h2 className="mt-3 text-[26px] font-extrabold leading-[1.5] sm:text-[30px]">{site.legalTagline}</h2>
              <p className="mt-3 text-[15.5px] leading-8 text-ink-2">نشانهٔ {site.name} از سه لایه ساخته شده است؛ لایه‌هایی که مثل محصولات و خدمات ما، هرکدام نقش خودشان را دارند و در کنار هم یک کل منسجم می‌سازند.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-24 sm:py-28">
        <div className="container-x grid gap-6 md:grid-cols-2">
          <Reveal className="rounded-3xl border border-line p-8 sm:p-10">
            <span className="grid size-12 place-items-center rounded-2xl bg-indigo/8 text-indigo"><Icon name="layers" className="size-6" /></span>
            <h2 className="mt-6 text-[24px] font-extrabold">محصولات نرم‌افزاری آماده</h2>
            <p className="mt-3 text-[15.5px] leading-8 text-ink-2">سه محصول مستقل که هرکدام بازار هدف، مدل فروش و تیم خود را دارند.</p>
            <ul className="mt-6 grid gap-3">
              {productList.map((p) => (
                <li key={p.slug} className="flex items-center gap-3 text-[15px]"><i className={cn("size-2 rounded-full", p.theme.dot)} /><b>{p.name}</b><span className="text-ink-3">— {p.category}</span></li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.06} className="rounded-3xl border border-line p-8 sm:p-10">
            <span className="grid size-12 place-items-center rounded-2xl bg-violet/10 text-violet"><Icon name="code" className="size-6" /></span>
            <h2 className="mt-6 text-[24px] font-extrabold">توسعهٔ نرم‌افزار سفارشی</h2>
            <p className="mt-3 text-[15.5px] leading-8 text-ink-2">برای سازمان‌هایی که نیاز خاصی دارند: تحلیل نیازمندی‌ها، طراحی، توسعه، پیاده‌سازی و پشتیبانی.</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper py-24 sm:py-28">
        <div className="container-x">
          <SectionHeading eyebrow="اصول کاری" title="چطور کار می‌کنیم" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {approach.map((a, i) => (
              <Reveal key={a.title} delay={i * 0.05} className="rounded-2xl border border-line bg-white p-7">
                <Icon name={a.icon} className="size-6 text-indigo" />
                <h3 className="mt-5 text-[17px] font-extrabold">{a.title}</h3>
                <p className="mt-1.5 text-[14.5px] leading-7 text-ink-2">{a.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <div className="h-24 bg-white" />
      <FinalCta />
    </>
  );
}
