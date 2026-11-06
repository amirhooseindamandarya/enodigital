import Link from "next/link";
import { Breadcrumb } from "@/components/product/blocks";
import { LeadForm } from "@/components/forms/lead-form";
import { Icon } from "@/components/ui/icon";
import { productList } from "@/lib/products";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata = pageMeta({ title: "تماس و درخواست مشاوره", description: "برای دریافت دموی محصولات، مشاوره یا ثبت درخواست پروژهٔ نرم‌افزاری با ما در تماس باشید.", path: "/contact/" });

export default function ContactPage() {
  const { phone, email, address } = site.contact;
  return (
    <section className="bg-paper pt-[72px]">
      <div className="container-x pb-24 pt-10 sm:pt-14">
        <Breadcrumb items={[{ href: "/", label: "خانه" }, { label: "تماس" }]} />
        <div className="mt-10 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <h1 className="h-display">بیایید گفتگو کنیم</h1>
            <p className="lead mt-5">دموی محصول، مشاوره برای انتخاب راهکار یا ثبت درخواست پروژهٔ سفارشی؛ پیام بگذارید تا با شما تماس بگیریم.</p>

            {(phone || email || address) && (
              <ul className="mt-10 grid gap-4">
                {phone && <li className="flex items-center gap-3"><Icon name="phone" className="size-5 text-indigo" /><a href={`tel:${phone}`} className="ltr font-bold">{phone}</a></li>}
                {email && <li className="flex items-center gap-3"><Icon name="mail" className="size-5 text-indigo" /><a href={`mailto:${email}`} className="ltr font-bold">{email}</a></li>}
                {address && <li className="flex items-center gap-3"><Icon name="map" className="size-5 text-indigo" />{address}</li>}
              </ul>
            )}

            <div className="mt-10 grid gap-3">
              <p className="text-[13.5px] font-bold text-ink-3">یا مستقیم به صفحهٔ مرتبط بروید</p>
              {productList.map((p) => (
                <Link key={p.slug} href={`${p.href}#demo`} className="group flex items-center gap-3 rounded-2xl border border-line bg-white p-4 hover:border-line-2">
                  <span className={cn("grid size-10 place-items-center rounded-xl", p.theme.bg, p.theme.accent)}><Icon name={p.icon} className="size-5" /></span>
                  <span className="flex-1"><b>{p.cta.primary}</b><span className="block text-[13px] text-ink-3">{p.name}</span></span>
                  <Icon name="arrow" className="size-4 text-ink-3 transition-transform group-hover:-translate-x-1" />
                </Link>
              ))}
              <Link href="/services/custom-software/#request" className="group flex items-center gap-3 rounded-2xl border border-line bg-white p-4 hover:border-line-2">
                <span className="grid size-10 place-items-center rounded-xl bg-violet/10 text-violet"><Icon name="code" className="size-5" /></span>
                <span className="flex-1"><b>ثبت درخواست پروژه</b><span className="block text-[13px] text-ink-3">نرم‌افزار سفارشی</span></span>
                <Icon name="arrow" className="size-4 text-ink-3 transition-transform group-hover:-translate-x-1" />
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-line bg-white p-6 shadow-[var(--shadow-soft)] sm:p-9">
            <h2 className="mb-6 text-[20px] font-extrabold">فرم تماس</h2>
            <LeadForm variant="contact" />
          </div>
        </div>
      </div>
    </section>
  );
}
