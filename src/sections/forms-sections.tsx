/* سکشن‌های دارای فرم: فرم درخواست و صفحهٔ تماس */
import { Reveal } from "@/components/motion/reveal";
import { Icon } from "@/components/ui/icon";
import { ui } from "@/cms/i18n";
import { cn } from "@/lib/utils";
import { CmsForm } from "./form";
import { Arrow, Breadcrumb, Check, Heading, SmartLink, th, type C, type SectionProps } from "./kit";

const fallbackContact = (ctx: SectionProps["ctx"]) => ctx.g.contact_info.phone || ctx.g.contact_info.email || "";

export function LeadFormSection({ c, ctx }: SectionProps) {
  if (!c.form) return null;
  const t = th(c.theme);
  const link = c.secondary_link as { label: string; href: string; external: boolean };
  const bullets = (c.bullets ?? []) as { text: string }[];
  if (c.layout === "split") {
    return (
      <section id={c.anchor || undefined} className="bg-white py-24 sm:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <Heading c={c} accent={t.accent} />
            {bullets.length > 0 && <ul className="mt-8 grid gap-3 text-[15px] text-ink-2">{bullets.map((b, i) => <li key={i} className="flex items-center gap-3"><Check theme={c.theme} />{b.text}</li>)}</ul>}
          </div>
          <div className="rounded-3xl border border-line bg-paper p-6 sm:p-9">
            <CmsForm form={c.form} locale={ctx.locale} submitLabel={c.submit_label} context={c.context} fallbackContact={fallbackContact(ctx)} />
          </div>
        </div>
      </section>
    );
  }
  const surface = c.banner_surface === "limoc_dark" ? "surface-limoc" : "surface-dark";
  return (
    <section id={c.anchor || "demo"} className={cn("pb-24 sm:pb-28", c.theme === "limoc" ? "bg-limoc-cream pt-4" : "bg-white")}>
      <div className="container-x">
        <div className={cn(surface, "relative grid gap-12 overflow-hidden rounded-[2rem] p-7 text-white sm:p-12 lg:grid-cols-[0.9fr_1.1fr] lg:p-16")}>
          <div aria-hidden className="grid-lines pointer-events-none absolute inset-0" />
          <div className="relative">
            {c.badge && <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[12.5px] font-bold text-white/80"><i className={cn("size-2 rounded-full", t.dot)} />{c.badge}</span>}
            <h2 className="h-section mt-5 text-white">{c.title}</h2>
            {c.lead && <p className="lead mt-4 text-white/65!">{c.lead}</p>}
            {bullets.length > 0 && <ul className="mt-6 grid gap-2.5 text-[15px] text-white/75">{bullets.map((b, i) => <li key={i} className="flex items-center gap-3"><Check dark />{b.text}</li>)}</ul>}
            {link?.href && (
              <SmartLink href={link.href} external={link.external} className="mt-8 inline-flex items-center gap-2 text-[15px] font-bold text-white/80 hover:text-white">
                {link.label} {link.external ? <Icon name="external" className="size-4" /> : <Arrow className="size-4" />}
              </SmartLink>
            )}
          </div>
          <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
            <CmsForm form={c.form} locale={ctx.locale} dark submitLabel={c.submit_label} context={c.context} fallbackContact={fallbackContact(ctx)} />
          </div>
        </div>
      </div>
    </section>
  );
}

export function ContactPanel({ c, ctx }: SectionProps) {
  const ci = ctx.g.contact_info;
  const links = (c.quick_links ?? []) as C[];
  return (
    <section className="bg-paper pt-[72px]">
      <div className="container-x pb-24 pt-10 sm:pt-14">
        <Breadcrumb ctx={ctx} label={ui("breadcrumb", ctx.locale)} />
        <div className="mt-10 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <Heading c={c} as="h1" />
            {(ci.phone || ci.email || ci.address || ci.hours) && (
              <ul className="mt-10 grid gap-4">
                {ci.phone && <li className="flex items-center gap-3"><Icon name="phone" className="size-5 text-indigo" /><a href={`tel:${ci.phone.replace(/\s/g, "")}`} dir="ltr" className="font-bold">{ci.phone}</a></li>}
                {ci.email && <li className="flex items-center gap-3"><Icon name="mail" className="size-5 text-indigo" /><a href={`mailto:${ci.email}`} dir="ltr" className="font-bold">{ci.email}</a></li>}
                {ci.address && <li className="flex items-center gap-3"><Icon name="map" className="size-5 text-indigo" />{ci.address}</li>}
                {ci.hours && <li className="flex items-center gap-3"><Icon name="clock" className="size-5 text-indigo" />{ci.hours}</li>}
              </ul>
            )}
            {links.length > 0 && (
              <div className="mt-10 grid gap-3">
                {c.quick_title && <p className="text-[13.5px] font-bold text-ink-3">{c.quick_title}</p>}
                {links.map((l, i) => {
                  const t = th(l.theme);
                  return (
                    <Reveal key={i} delay={i * 0.04}>
                      <SmartLink href={l.href} external={l.external} className="group flex items-center gap-3 rounded-2xl border border-line bg-white p-4 hover:border-line-2">
                        <span className={cn("grid size-10 place-items-center rounded-xl", t.soft, t.accent)}><Icon name={l.icon ?? "arrow"} className="size-5" /></span>
                        <span className="flex-1"><b>{l.label}</b>{l.subtitle && <span className="block text-[13px] text-ink-3">{l.subtitle}</span>}</span>
                        <Arrow nudge className="size-4 text-ink-3" />
                      </SmartLink>
                    </Reveal>
                  );
                })}
              </div>
            )}
          </div>
          <div className="rounded-3xl border border-line bg-white p-6 shadow-[var(--shadow-soft)] sm:p-9">
            {c.form_title && <h2 className="mb-6 text-[20px] font-extrabold">{c.form_title}</h2>}
            {c.form && <CmsForm form={c.form} locale={ctx.locale} fallbackContact={fallbackContact(ctx)} />}
          </div>
        </div>
      </div>
    </section>
  );
}
