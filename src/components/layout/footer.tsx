import Link from "next/link";
import { productList } from "@/lib/products";
import { site } from "@/lib/site";
import { Logo } from "./logo";

const cols = [
  { title: "محصولات", links: [...productList.map((p) => ({ href: p.href, label: p.name })), { href: "/products/", label: "همهٔ محصولات" }] },
  { title: "خدمات", links: [
    { href: "/services/custom-software/", label: "توسعهٔ نرم‌افزار سفارشی" },
    { href: "/services/custom-software/#process", label: "فرایند همکاری" },
    { href: "/services/custom-software/#request", label: "ثبت درخواست پروژه" },
  ] },
  { title: "شرکت", links: [
    { href: "/about/", label: "درباره ما" },
    { href: "/projects/", label: "پروژه‌ها" },
    { href: "/blog/", label: "مقالات" },
    { href: "/contact/", label: "تماس با ما" },
  ] },
];

export function Footer() {
  const { phone, email, address } = site.contact;
  return (
    <footer className="bg-navy text-white">
      <div className="container-x grid gap-12 py-16 lg:grid-cols-[1.4fr_repeat(3,1fr)_1.2fr]">
        <div>
          <Logo dark />
          <p className="mt-4 text-[13px] font-semibold text-amber">{site.legalTagline}</p>
          <p className="mt-2 max-w-xs text-[14.5px] leading-7 text-white/60">{site.tagline}؛ از محصولات آماده تا راهکارهای اختصاصی.</p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h2 className="mb-4 text-[13px] font-bold text-white/45">{c.title}</h2>
            <ul className="grid gap-3">
              {c.links.map((l) => (
                <li key={l.href}><Link href={l.href} className="text-[14.5px] text-white/75 transition-colors hover:text-white">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h2 className="mb-4 text-[13px] font-bold text-white/45">ارتباط با ما</h2>
          <ul className="grid gap-3 text-[14.5px] text-white/75">
            {phone && <li><a href={`tel:${phone}`} className="ltr hover:text-white">{phone}</a></li>}
            {email && <li><a href={`mailto:${email}`} className="ltr hover:text-white">{email}</a></li>}
            {address && <li>{address}</li>}
            <li><Link href="/contact/" className="hover:text-white">فرم تماس و درخواست مشاوره</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-6 text-[13px] text-white/45 sm:flex-row sm:justify-between">
          <p>© {new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric" }).format(new Date())} {site.name}. همهٔ حقوق محفوظ است.</p>
          <p>تصاویر سامانهٔ رفاهیات با دادهٔ آزمایشی تهیه شده‌اند.</p>
        </div>
      </div>
    </footer>
  );
}
