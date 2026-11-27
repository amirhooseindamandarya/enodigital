"use client";
/* پلن‌های قیمت‌گذاری: داده به‌صورت زنده از /api/plans (پنل مدیریت) خوانده می‌شود */
import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { at } from "@/account/i18n";
import { fmtNum, toToman, tomanUnit } from "@/lib/money";
import type { Locale } from "@/cms/types";
import { cn } from "@/lib/utils";
import { Heading, th, type SectionProps } from "./kit";

type L = { fa: string; en?: string; ar?: string };
type Plan = { id: number; name: L; description: L; features: { fa: string[]; en?: string[]; ar?: string[] }; price: number; period: string; durationDays: number; highlighted: boolean };
type Product = { key: string; name: L; plans: Plan[] };

const pick = (v: L | undefined, l: Locale) => (v ? v[l] || v.fa : "");
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function PricingPlans({ c, ctx }: SectionProps) {
  const l = ctx.locale;
  const [data, setData] = useState<Product[] | null>(null);
  const [failed, setFailed] = useState(false);
  const product = (c.product_key as string) || "";

  useEffect(() => {
    let alive = true;
    fetch(`${BASE}/api/plans/${product ? `?product=${encodeURIComponent(product)}` : ""}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: Product[]) => alive && setData(d))
      .catch(() => alive && setFailed(true));
    return () => { alive = false; };
  }, [product]);

  // بدون پلن فعال (یا بدون سرور) این بخش نمایش داده نمی‌شود
  if (failed || (data && data.every((p) => p.plans.length === 0))) return null;
  const t = th(c.theme);
  const prefix = l === "fa" ? "" : `/${l}`;

  return (
    <section id={c.anchor || "pricing"} className={cn("relative overflow-hidden py-24 sm:py-28", c.surface === "paper" ? "bg-paper" : c.surface === "cream" ? "bg-limoc-cream" : "bg-white")}>
      <div className="container-x">
        <Heading c={c} center accent={t.accent} />
        {!data ? (
          <div className="mt-14 grid place-items-center py-10 text-ink-3"><Loader2 className="size-6 animate-spin" aria-hidden /></div>
        ) : data.map((p) => (
          <div key={p.key} className="mt-14">
            {data.length > 1 && <h3 className="mb-5 text-center text-[20px] font-extrabold">{pick(p.name, l)}</h3>}
            <ul className={cn("mx-auto grid max-w-5xl gap-5", p.plans.length === 1 ? "max-w-md" : p.plans.length === 2 ? "md:grid-cols-2 max-w-3xl" : "md:grid-cols-2 lg:grid-cols-3")}>
              {p.plans.map((pl) => {
                const feats = pl.features[l]?.length ? pl.features[l]! : pl.features.fa;
                return (
                  <li key={pl.id} className={cn("relative flex flex-col rounded-3xl border bg-white p-7 transition-shadow hover:shadow-[var(--shadow-lift)]", pl.highlighted ? "border-transparent ring-2 ring-amber shadow-[var(--shadow-lift)]" : "border-line")}>
                    {pl.highlighted && c.badge && <span className="absolute -top-3 start-7 rounded-full bg-amber px-3 py-0.5 text-[12px] font-bold text-navy">{c.badge}</span>}
                    <p className="text-[17px] font-extrabold">{pick(pl.name, l)}</p>
                    {pick(pl.description, l) && <p className="mt-1 text-[14px] leading-7 text-ink-3">{pick(pl.description, l)}</p>}
                    <p className="mt-5 flex items-baseline gap-1.5">
                      <span className="text-[34px] font-extrabold leading-none">{pl.price ? fmtNum(toToman(pl.price), l) : at("free", l)}</span>
                      {pl.price > 0 && <span className="text-[14px] text-ink-3">{tomanUnit(l)} / {at(`per_${pl.period}` as never, l)}</span>}
                    </p>
                    {c.tax_note && <p className="mt-1 text-[12.5px] text-ink-3">{c.tax_note}</p>}
                    <ul className="mt-6 grid flex-1 content-start gap-2.5 text-[14.5px]">
                      {feats.map((f, i) => <li key={i} className="flex items-start gap-2.5"><Check className={cn("mt-1 size-4 shrink-0", t.accent)} strokeWidth={2.5} aria-hidden />{f}</li>)}
                    </ul>
                    <a href={`${BASE}${prefix}/account/checkout/?plan=${pl.id}`}
                      className={cn("mt-7 inline-flex h-12 items-center justify-center rounded-xl text-[15px] font-bold transition-colors", pl.highlighted ? "bg-amber text-navy hover:bg-[#ffb81f]" : "bg-navy text-white hover:bg-navy-3")}>
                      {c.buy_label || at("pricing", l)}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        {c.note && <p className="mx-auto mt-8 max-w-2xl text-center text-[14px] leading-7 text-ink-3">{c.note}</p>}
      </div>
    </section>
  );
}
