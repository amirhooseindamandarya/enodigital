"use client";
/* کاتالوگ خدمات دیجیتال: دسته‌ها و قیمت‌ها به‌صورت زنده از /api/services (پنل مدیریت) */
import { useEffect, useState } from "react";
import { Check, Clock, Loader2 } from "lucide-react";
import { at } from "@/account/i18n";
import { fmtNum, fmtUsd, toToman, tomanUnit } from "@/lib/money";
import type { Locale } from "@/cms/types";
import { cn } from "@/lib/utils";
import { Heading, th, type SectionProps } from "./kit";

type L = { fa: string; en?: string; ar?: string };
type Service = {
  id: number; slug: string; name: L; summary: L; unit: L; features: { fa: string[]; en?: string[]; ar?: string[] };
  pricing: "fixed" | "quote"; price: number | null; usd: number | null; deliveryDays: number; highlighted: boolean;
};
type Category = { slug: string; name: L; description: L; services: Service[] };

const pick = (v: L | undefined, l: Locale) => (v ? v[l] || v.fa : "");
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function ServicesCatalog({ c, ctx }: SectionProps) {
  const l = ctx.locale;
  const [data, setData] = useState<Category[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [tab, setTab] = useState<string>("");
  const only = (c.category as string) || "";

  useEffect(() => {
    let alive = true;
    fetch(`${BASE}/api/services/${only ? `?category=${encodeURIComponent(only)}` : ""}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: Category[]) => alive && setData(d))
      .catch(() => alive && setFailed(true));
    return () => { alive = false; };
  }, [only]);

  if (failed || (data && data.length === 0)) return null;
  const t = th(c.theme);
  const prefix = l === "fa" ? "" : `/${l}`;
  const quote = c.quote_link as { href?: string } | undefined;
  const quoteHref = quote?.href || `${prefix}/contact/`;
  const shown = data ? (tab ? data.filter((x) => x.slug === tab) : data) : [];
  const num = (n: number) => n.toLocaleString(l === "fa" ? "fa-IR" : l === "ar" ? "ar-u-nu-latn" : "en-US");

  return (
    <section id={c.anchor || "services"} className={cn("relative overflow-hidden py-24 sm:py-28", c.surface === "paper" ? "bg-paper" : c.surface === "cream" ? "bg-limoc-cream" : "bg-white")}>
      <div className="container-x">
        <Heading c={c} center accent={t.accent} />
        {!data ? (
          <div className="mt-14 grid place-items-center py-10 text-ink-3"><Loader2 className="size-6 animate-spin" aria-hidden /></div>
        ) : (
          <>
            {data.length > 1 && (
              <div role="tablist" className="mt-10 flex flex-wrap justify-center gap-2">
                {[{ slug: "", name: { fa: "همه", en: "All", ar: "الكل" } as L }, ...data].map((cat) => (
                  <button key={cat.slug || "all"} type="button" role="tab" aria-selected={tab === cat.slug} onClick={() => setTab(cat.slug)}
                    className={cn("h-10 rounded-full border px-5 text-[14px] font-bold transition-colors", tab === cat.slug ? "border-navy bg-navy text-white" : "border-line bg-white text-ink-2 hover:border-ink-3")}>
                    {pick(cat.name, l)}
                  </button>
                ))}
              </div>
            )}
            {shown.map((cat) => (
              <div key={cat.slug} className="mt-12">
                {(data.length > 1 || pick(cat.description, l)) && (
                  <div className="mb-5 text-center">
                    {data.length > 1 && <h3 className="text-[20px] font-extrabold">{pick(cat.name, l)}</h3>}
                    {pick(cat.description, l) && <p className="mx-auto mt-1 max-w-2xl text-[14.5px] leading-7 text-ink-3">{pick(cat.description, l)}</p>}
                  </div>
                )}
                <ul className={cn("mx-auto grid gap-5", cat.services.length === 1 ? "max-w-md" : cat.services.length === 2 ? "max-w-3xl md:grid-cols-2" : "max-w-6xl md:grid-cols-2 lg:grid-cols-3")}>
                  {cat.services.map((sv) => {
                    const feats = sv.features[l]?.length ? sv.features[l]! : sv.features.fa;
                    const unit = pick(sv.unit, l);
                    return (
                      <li key={sv.id} className={cn("relative flex flex-col rounded-3xl border bg-white p-7 transition-shadow hover:shadow-[var(--shadow-lift)]", sv.highlighted ? "border-transparent ring-2 ring-amber shadow-[var(--shadow-lift)]" : "border-line")}>
                        {sv.highlighted && c.badge && <span className="absolute -top-3 start-7 rounded-full bg-amber px-3 py-0.5 text-[12px] font-bold text-navy">{c.badge}</span>}
                        <p className="text-[17px] font-extrabold">{pick(sv.name, l)}</p>
                        {pick(sv.summary, l) && <p className="mt-1 text-[14px] leading-7 text-ink-3">{pick(sv.summary, l)}</p>}
                        <div className="mt-5">
                          {sv.pricing === "quote" ? (
                            <p className="text-[22px] font-extrabold">{at("startsFrom", l)}</p>
                          ) : (
                            <>
                              <p className="flex flex-wrap items-baseline gap-1.5">
                                <span className="text-[30px] font-extrabold leading-none">{sv.price === null ? fmtUsd(Math.round((sv.usd ?? 0) * 100), l) : fmtNum(toToman(sv.price), l)}</span>
                                {sv.price !== null && <span className="text-[14px] text-ink-3">{tomanUnit(l)}{unit ? ` / ${unit}` : ""}</span>}
                              </p>
                              {sv.usd !== null && sv.price !== null && <p className="mt-1 text-[12.5px] text-ink-3">{fmtUsd(Math.round(sv.usd * 100), l)}</p>}
                            </>
                          )}
                          {sv.deliveryDays > 0 && <p className="mt-2 flex items-center gap-1.5 text-[13px] text-ink-3"><Clock className="size-3.5" aria-hidden />{at("deliveryIn", l)}: {num(sv.deliveryDays)} {at("workDays", l)}</p>}
                        </div>
                        <ul className="mt-5 grid flex-1 content-start gap-2.5 text-[14.5px]">
                          {feats.map((f, i) => <li key={i} className="flex items-start gap-2.5"><Check className={cn("mt-1 size-4 shrink-0", t.accent)} strokeWidth={2.5} aria-hidden />{f}</li>)}
                        </ul>
                        <a href={sv.pricing === "quote" ? `${quoteHref.startsWith("http") ? "" : BASE}${quoteHref}` : `${BASE}${prefix}/account/checkout/?service=${sv.id}`}
                          className={cn("mt-7 inline-flex h-12 items-center justify-center rounded-xl text-[15px] font-bold transition-colors", sv.pricing === "quote" ? "border border-line-2 bg-white text-ink hover:border-ink-3" : sv.highlighted ? "bg-amber text-navy hover:bg-[#ffb81f]" : "bg-navy text-white hover:bg-navy-3")}>
                          {sv.pricing === "quote" ? c.quote_label || at("requestQuote", l) : c.buy_label || at("buyService", l)}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </>
        )}
        {c.note && <p className="mx-auto mt-8 max-w-2xl text-center text-[14px] leading-7 text-ink-3">{c.note}</p>}
      </div>
    </section>
  );
}
