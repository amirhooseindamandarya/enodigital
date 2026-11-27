import type { Viewport } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { Header, type HeaderProduct } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MotionProvider } from "@/components/motion/reveal";
import { JsonLd } from "@/lib/seo";
import { getSite, SITE_URL } from "@/cms/site";
import { allPaths, alternatesFor, matchPath } from "@/cms/routes";
import { localeMeta, pathFor, ui } from "@/cms/i18n";
import { pageHref, resolveGlobals, resolveMenu } from "@/cms/resolve";
import { th, type Globals } from "@/sections/kit";
import { at } from "@/account/i18n";

const vazir = localFont({ src: "../../fonts/Vazirmatn-Variable.woff2", weight: "100 900", display: "swap", variable: "--font-vazir", preload: true });

export const viewport: Viewport = { themeColor: "#071c35", width: "device-width", initialScale: 1 };
export const dynamicParams = false;
export async function generateStaticParams() {
  return allPaths(await getSite()).map((path) => ({ path }));
}

/** آیا بخش بالای صفحه تیره است؟ (برای رنگ هدر روی آن) */
function isDarkTop(type?: string, content?: Record<string, unknown>) {
  if (type === "home_hero") return true;
  if (type === "page_header") return content?.surface === "dark";
  if (type === "product_hero") return content?.variant === "benefits";
  return false;
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ path?: string[] }> }) {
  const { path } = await params;
  const site = await getSite();
  const m = matchPath(site, path);
  const { locale } = m;
  const meta = localeMeta[locale];
  const ctx = { site, locale };
  const g = resolveGlobals(ctx) as unknown as Globals;
  const brand = g.brand;
  const logo = {
    name: brand.name, nameEn: site.website.key.toUpperCase(),
    mark: brand.logo_mark?.src, markWhite: brand.logo_mark_white?.src, word: brand.wordmark?.src, wordWhite: brand.wordmark_white?.src,
  };
  const products: HeaderProduct[] = g.products.items.map((p) => ({ key: p.key, name: p.name, category: p.category, tagline: p.tagline, icon: p.icon, href: p.page?.href ?? "", soft: th(p.theme).soft, accent: th(p.theme).accent }));
  const first = m.kind === "page" ? m.page.sections.find((s) => s.active !== false) : undefined;
  const header = g.header;
  const year = new Intl.DateTimeFormat(locale === "fa" ? "fa-IR-u-ca-persian" : meta.numbering, { year: "numeric" }).format(new Date());
  const footerMenu = resolveMenu(ctx, "footer");

  return (
    <html lang={meta.htmlLang} dir={meta.dir} className={vazir.variable}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-3 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg">{ui("skip", locale)}</a>
        <JsonLd data={{ "@context": "https://schema.org", "@type": "Organization", name: brand.name, alternateName: logo.nameEn, url: SITE_URL, logo: `${SITE_URL}/icon-512.png`, description: brand.description }} />
        <MotionProvider>
          <Header
            locale={locale} dir={meta.dir} darkTop={isDarkTop(first?.type, first?.content)} homeHref={pathFor(locale)} logo={logo}
            nav={resolveMenu(ctx, "header")} products={products}
            cta={header.cta?.href ? { label: header.cta.label, href: header.cta.href } : undefined}
            mega={{ eyebrow: header.mega_eyebrow, title: header.mega_title, desc: header.mega_desc, buttons: header.mega_buttons }}
            languages={alternatesFor(site, m)}
            account={{ href: `${locale === "fa" ? "" : `/${locale}`}/account/`, label: at("account", locale) }}
            t={{ mainNav: ui("mainNav", locale), openMenu: ui("openMenu", locale), closeMenu: ui("closeMenu", locale), siteNav: ui("siteNav", locale), language: ui("language", locale), home: ui("home", locale) }}
          />
          <main id="main">{children}</main>
          <Footer
            locale={locale} logo={logo} homeHref={pathFor(locale)} legalTagline={brand.legal_tagline} note={brand.footer_note} columns={footerMenu}
            contact={{ title: g.footer.contact_title, phone: g.contact_info.phone, email: g.contact_info.email, address: g.contact_info.address, hours: g.contact_info.hours, socials: g.contact_info.socials, formLabel: g.contact_info.form_link_label, formHref: pageHref(site, "contact", locale) }}
            copyright={`© ${year} ${brand.name}. ${ui("rights", locale)}`}
          />
        </MotionProvider>
      </body>
    </html>
  );
}

