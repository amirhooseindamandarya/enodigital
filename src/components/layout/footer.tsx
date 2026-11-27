import Link from "next/link";
import type { ResolvedMenuItem } from "@/cms/resolve";
import { Logo, type LogoData } from "./logo";

const SOCIAL: Record<string, Record<string, string>> = {
  instagram: { fa: "اینستاگرام", en: "Instagram", ar: "إنستغرام" },
  linkedin: { fa: "لینکدین", en: "LinkedIn", ar: "لينكدإن" },
  telegram: { fa: "تلگرام", en: "Telegram", ar: "تيليجرام" },
  whatsapp: { fa: "واتساپ", en: "WhatsApp", ar: "واتساب" },
  x: { fa: "ایکس", en: "X", ar: "إكس" },
};

export type FooterProps = {
  locale: string;
  logo: LogoData;
  homeHref: string;
  legalTagline: string;
  note: string;
  columns: ResolvedMenuItem[];
  contact: { title: string; phone?: string; email?: string; address?: string; hours?: string; socials: { name: string; url: string }[]; formLabel: string; formHref: string };
  copyright: string;
};

export function Footer(p: FooterProps) {
  const c = p.contact;
  return (
    <footer className="bg-navy text-white">
      <div className="container-x grid gap-12 py-16 lg:grid-cols-[1.4fr_repeat(3,1fr)_1.2fr]">
        <div>
          <Logo data={p.logo} href={p.homeHref} dark label={p.logo.name} />
          {p.legalTagline && <p className="mt-4 text-[13px] font-semibold text-amber">{p.legalTagline}</p>}
          {p.note && <p className="mt-2 max-w-xs text-[14.5px] leading-7 text-white/60">{p.note}</p>}
        </div>
        {p.columns.map((col, i) => (
          <div key={i}>
            <h2 className="mb-4 text-[13px] font-bold text-white/45">{col.label}</h2>
            <ul className="grid gap-3">
              {col.children.map((l, j) => <li key={j}><Link href={l.href} className="text-[14.5px] text-white/75 transition-colors hover:text-white">{l.label}</Link></li>)}
            </ul>
          </div>
        ))}
        <div>
          <h2 className="mb-4 text-[13px] font-bold text-white/45">{c.title}</h2>
          <ul className="grid gap-3 text-[14.5px] text-white/75">
            {c.phone && <li><a href={`tel:${c.phone.replace(/\s/g, "")}`} dir="ltr" className="hover:text-white">{c.phone}</a></li>}
            {c.email && <li><a href={`mailto:${c.email}`} dir="ltr" className="hover:text-white">{c.email}</a></li>}
            {c.address && <li className="leading-7">{c.address}</li>}
            {c.hours && <li className="text-white/55">{c.hours}</li>}
            <li><Link href={c.formHref} className="font-semibold text-amber hover:text-[#ffc94d]">{c.formLabel}</Link></li>
          </ul>
          {c.socials.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {c.socials.map((s, i) => (
                <li key={i}><a href={s.url} target="_blank" rel="noopener" className="inline-flex h-9 items-center rounded-lg border border-white/10 px-3 text-[13px] text-white/75 transition-colors hover:border-white/30 hover:text-white">{SOCIAL[s.name]?.[p.locale] ?? s.name}</a></li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-6 text-[13px] text-white/45 sm:flex-row sm:justify-between">
          <p>{p.copyright}</p>
          <p dir="ltr">ENODIGITAL</p>
        </div>
      </div>
    </footer>
  );
}
