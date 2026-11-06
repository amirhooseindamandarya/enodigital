import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Breadcrumb } from "@/components/product/blocks";
import { FinalCta } from "@/components/home/sections";
import { productList } from "@/lib/products";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = pageMeta({
  title: "محصولات نرم‌افزاری",
  description: "Limoc برای مدیریت مشتری و فروش، LimoFood برای سفارش‌گیری آنلاین غذا و سامانهٔ بن الکترونیکی رفاهیات کارکنان.",
  path: "/products/",
});

const rows: { label: string; values: string[] }[] = [
  { label: "مخاطب", values: productList.map((p) => p.audience) },
  { label: "مسئله‌ای که حل می‌کند", values: ["پراکندگی اطلاعات مشتری، فروش و پشتیبانی", "وابستگی فروش آنلاین به پلتفرم‌های واسطه", "مدیریت کاغذی بن و تسویهٔ دستی با فروشگاه‌ها"] },
  { label: "قابلیت‌های شاخص", values: productList.map((p) => p.highlights.join("، ")) },
  { label: "اقدام بعدی", values: productList.map((p) => p.cta.primary) },
];

export default function ProductsPage() {
  return (
    <>
      <section className="bg-paper pt-[72px]">
        <div className="container-x pb-16 pt-10 sm:pt-14">
          <Breadcrumb items={[{ href: "/", label: "خانه" }, { label: "محصولات" }]} />
          <div className="mt-10 max-w-3xl">
            <h1 className="h-display">محصولات نرم‌افزاری</h1>
            <p className="lead mt-5">سه محصول مستقل، هرکدام برای یک بازار مشخص. اگر هیچ‌کدام دقیقاً نیازتان را پوشش نمی‌دهد، راهکار اختصاصی می‌سازیم.</p>
          </div>
        </div>
      </section>

      <section className="bg-paper pb-24">
        <div className="container-x grid gap-6">
          {productList.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.05}>
              <Link href={p.href} className="group grid gap-8 rounded-3xl border border-line bg-white p-7 transition-shadow duration-300 hover:shadow-[var(--shadow-lift)] sm:p-10 md:grid-cols-[auto_1fr_auto] md:items-center">
                <span className={cn("grid size-16 place-items-center rounded-2xl", p.theme.bg, p.theme.accent)}><Icon name={p.icon} className="size-7" /></span>
                <div>
                  <p className="text-[13.5px] font-bold text-ink-3">{p.category}</p>
                  <h2 className="mt-1 text-[28px] font-extrabold">{p.name}</h2>
                  <p className="mt-2 max-w-2xl text-[16px] leading-8 text-ink-2">{p.tagline}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {p.highlights.map((h) => <li key={h} className="rounded-full bg-paper px-3 py-1 text-[13px] font-semibold text-ink-2">{h}</li>)}
                  </ul>
                </div>
                <span className="inline-flex items-center gap-2 font-bold text-ink">مشاهده <Icon name="arrow" className="size-4 transition-transform group-hover:-translate-x-1" /></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="container-x">
          <h2 className="h-section">مقایسهٔ سریع</h2>
          <div className="mt-10 overflow-x-auto rounded-3xl border border-line">
            <table className="w-full min-w-[760px] border-collapse text-[15px]">
              <thead>
                <tr className="bg-paper">
                  <th scope="col" className="p-5 text-start text-[13.5px] font-bold text-ink-3"> </th>
                  {productList.map((p) => (
                    <th key={p.slug} scope="col" className="p-5 text-start"><span className="flex items-center gap-2 font-extrabold"><i className={cn("size-2 rounded-full", p.theme.dot)} />{p.name}</span></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className="border-t border-line align-top">
                    <th scope="row" className="w-44 p-5 text-start text-[14px] font-bold text-ink-3">{r.label}</th>
                    {r.values.map((v, i) => <td key={i} className="p-5 leading-7 text-ink-2">{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-3xl bg-paper p-7 sm:flex-row sm:items-center">
            <p className="text-[16px] font-bold">مطمئن نیستید کدام محصول مناسب شماست؟</p>
            <ButtonLink href="/contact/">مشاوره بگیرید</ButtonLink>
          </div>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
