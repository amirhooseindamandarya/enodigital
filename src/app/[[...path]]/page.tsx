import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSite, SITE_URL } from "@/cms/site";
import { alternatesFor, matchPath, type Match } from "@/cms/routes";
import { BASE_PATH, L, localeMeta, num, pathFor, ui } from "@/cms/i18n";
import { pageHref, pageTitle, publishedPosts, resolveGlobals, BLOG_PAGE } from "@/cms/resolve";
import { DEFAULT_LOCALE, type Locale, type SiteData } from "@/cms/types";
import { RenderSections } from "@/sections/render";
import { Arrow, Breadcrumb, type Crumb, type Globals, type SectionCtx } from "@/sections/kit";
import { buttonVariants } from "@/components/ui/button";
import { JsonLd } from "@/lib/seo";

type Props = { params: Promise<{ path?: string[] }> };

/** والد هر صفحه در مسیر صفحه: صفحات محصول زیر «محصولات» */
function crumbsFor(site: SiteData, m: Match, g: Globals): Crumb[] {
  if (m.kind !== "page" && m.kind !== "post") return [];
  const l = m.locale;
  const home: Crumb = { label: ui("home", l), href: pathFor(l) };
  if (m.kind === "post") {
    const post = site.blog.posts.find((p) => p.slug === m.slug)!;
    return [home, { label: pageTitle(site, BLOG_PAGE, l), href: pageHref(site, BLOG_PAGE, l) }, { label: (post.translations[l] ?? post.translations[DEFAULT_LOCALE])!.title }];
  }
  if (m.page.key === "home") return [home];
  const isProduct = g.products.items.some((p) => p.page?.key === m.page.key);
  const self = { label: (m.page.translations[l] ?? m.page.translations[DEFAULT_LOCALE]).title };
  return isProduct ? [home, { label: pageTitle(site, "products", l), href: pageHref(site, "products", l) }, self] : [home, self];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path } = await params;
  const site = await getSite();
  const m = matchPath(site, path);
  const l = m.locale;
  const brand = L(site.globalGroups.brand.content.name as never, l);
  if (m.kind === "redirect") return { title: brand, robots: { index: false, follow: true }, alternates: { canonical: `${SITE_URL}${m.to}` } };
  if (m.kind === "notfound") return { title: `${ui("notFoundCode", l)} | ${brand}`, robots: { index: false } };

  let title = "", description = "", canonicalPath = "";
  if (m.kind === "post") {
    const tr = site.blog.posts.find((p) => p.slug === m.slug)!.translations;
    const x = (tr[l] ?? tr[DEFAULT_LOCALE])!;
    title = `${x.title} | ${brand}`; description = x.excerpt ?? ""; canonicalPath = `${pageHref(site, BLOG_PAGE, l)}${m.slug}/`;
  } else {
    const seo = m.page.seo?.[l] ?? m.page.seo?.[DEFAULT_LOCALE];
    const base = seo?.seo_title || (m.page.translations[l] ?? m.page.translations[DEFAULT_LOCALE]).title;
    title = m.page.key === "home" || base.includes(brand) ? base : `${base} | ${brand}`;
    description = seo?.meta_description ?? "";
    canonicalPath = pathFor(l, (m.page.translations[l] ?? m.page.translations[DEFAULT_LOCALE]).slug);
  }
  const alts = alternatesFor(site, m);
  const url = `${SITE_URL}${canonicalPath}`;
  const ogFile = site.media.find((x) => x.ref === "og-cover")?.file;
  const og = ogFile ? `${SITE_URL}/${ogFile}` : undefined;
  return {
    metadataBase: new URL(SITE_URL + "/"),
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: { ...Object.fromEntries(alts.map((a) => [localeMeta[a.locale].htmlLang, `${SITE_URL}${a.href}`])), "x-default": `${SITE_URL}${alts.find((a) => a.locale === DEFAULT_LOCALE)?.href ?? "/"}` },
    },
    openGraph: { type: m.kind === "post" ? "article" : "website", locale: localeMeta[l].og, siteName: brand, title, description, url, images: og ? [{ url: og, width: 1200, height: 630 }] : undefined },
    twitter: { card: "summary_large_image", title, description },
    icons: { icon: `${BASE_PATH}/favicon.png`, apple: `${BASE_PATH}/apple-touch-icon.png` },
    robots: { index: true, follow: true },
  };
}

export default async function Page({ params }: Props) {
  const { path } = await params;
  const site = await getSite();
  const m = matchPath(site, path);
  const l = m.locale;

  if (m.kind === "redirect") {
    const to = `${BASE_PATH}${m.to}`;
    return (
      <section className="grid min-h-[70vh] place-items-center bg-paper pt-[72px] text-center">
        <meta httpEquiv="refresh" content={`0; url=${to}`} />
        <script dangerouslySetInnerHTML={{ __html: `location.replace(${JSON.stringify(to)} + location.hash)` }} />
        <a href={to} className="font-bold text-ink underline">{to}</a>
      </section>
    );
  }
  if (m.kind === "notfound") notFound();

  const g = resolveGlobals({ site, locale: l }) as unknown as Globals;
  const ctx: SectionCtx = { site, locale: l, dir: localeMeta[l].dir, g, pageKey: m.page.key, crumbs: crumbsFor(site, m, g), siteUrl: SITE_URL };
  if (m.kind === "post") return <PostView ctx={ctx} slug={m.slug} />;
  return <RenderSections sections={m.page.sections} ctx={ctx} />;
}

function PostView({ ctx, slug }: { ctx: SectionCtx; slug: string }) {
  const l = ctx.locale;
  const all = publishedPosts(ctx.site, l);
  const a = all.find((p) => p.slug === slug)!;
  const others = all.filter((p) => p.slug !== slug);
  const brand = ctx.g.brand.name as string;
  return (
    <article className="bg-white pt-[72px]">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: a.title, description: a.excerpt, inLanguage: localeMeta[l].htmlLang, datePublished: a.date, publisher: { "@type": "Organization", name: brand }, mainEntityOfPage: `${SITE_URL}${a.href}` }} />
      <header className="bg-paper">
        <div className="container-x max-w-[820px]! pb-14 pt-10 sm:pt-14">
          <Breadcrumb ctx={ctx} label={ui("breadcrumb", l)} />
          <p className="mt-10 text-[14px] font-bold text-amber-ink">{a.category} · {num(a.minutes, l)} {ui("minutesRead", l)}</p>
          <h1 className="mt-4 text-[30px] font-extrabold leading-[1.45] sm:text-[42px]">{a.title}</h1>
          {a.excerpt && <p className="lead mt-5">{a.excerpt}</p>}
        </div>
      </header>
      <div className="container-x max-w-[820px]! py-14">
        <div className="prose-rich" dangerouslySetInnerHTML={{ __html: a.content }} />
        <div className="mt-14 flex flex-col items-start justify-between gap-4 rounded-3xl bg-paper p-7 sm:flex-row sm:items-center">
          <p className="font-bold">{String(ctx.g.header.mega_title ?? "")}</p>
          <Link href={pageHref(ctx.site, "contact", l)} className={buttonVariants({ variant: "primary" })}>{String(ctx.g.header.cta?.label ?? "")}</Link>
        </div>
        {others.length > 0 && (
          <nav aria-label={ui("otherPosts", l)} className="mt-14 border-t border-line pt-10">
            <p className="mb-5 text-[14px] font-bold text-ink-3">{ui("otherPosts", l)}</p>
            <ul className="grid gap-3">
              {others.map((o) => (
                <li key={o.slug}><Link href={o.href} className="group flex items-center justify-between gap-4 rounded-2xl border border-line p-5 hover:border-line-2"><span className="font-bold">{o.title}</span><Arrow nudge className="size-4 shrink-0 text-ink-3" /></Link></li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </article>
  );
}
