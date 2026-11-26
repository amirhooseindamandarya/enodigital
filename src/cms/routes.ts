import { DEFAULT_LOCALE, LOCALES, type Locale, type PageDef, type SiteData } from "./types";
import { isLocale, localeMeta, pathFor } from "./i18n";
import { BLOG_PAGE, pageSlug, postHref } from "./resolve";

export type Match =
  | { kind: "page"; locale: Locale; page: PageDef }
  | { kind: "post"; locale: Locale; page: PageDef; slug: string }
  | { kind: "redirect"; locale: Locale; to: string }
  | { kind: "notfound"; locale: Locale };

const published = (site: SiteData) => site.pages.filter((p) => p.status === "published");
const has = (p: PageDef, l: Locale) => !!p.translations[l];

export function splitLocale(segments: string[] = []): { locale: Locale; rest: string[] } {
  const [first, ...rest] = segments.map(decodeURIComponent);
  if (first && first !== DEFAULT_LOCALE && isLocale(first)) return { locale: first, rest };
  return { locale: DEFAULT_LOCALE, rest: first ? [first, ...rest] : [] };
}

export function matchPath(site: SiteData, segments: string[] = []): Match {
  const { locale, rest } = splitLocale(segments);
  const pages = published(site).filter((p) => has(p, locale));
  if (rest.length <= 1) {
    const slug = rest[0] ?? "";
    const page = pages.find((p) => pageSlug(p, locale) === slug);
    if (page) return { kind: "page", locale, page };
  }
  if (rest.length === 2) {
    const blog = pages.find((p) => p.key === BLOG_PAGE);
    const post = site.blog.posts.find((x) => x.slug === rest[1] && x.status === "published" && x.translations[locale]);
    if (blog && post && pageSlug(blog, locale) === rest[0]) return { kind: "post", locale, page: blog, slug: post.slug };
  }
  const from = "/" + rest.join("/");
  const r = site.redirects.find((x) => x.from.replace(/\/$/, "") === from);
  if (r) return { kind: "redirect", locale, to: r.to.endsWith("/") ? r.to : r.to + "/" };
  return { kind: "notfound", locale };
}

/** همهٔ مسیرهای ایستا برای generateStaticParams */
export function allPaths(site: SiteData): string[][] {
  const out: string[][] = [];
  const prefix = (l: Locale) => (l === DEFAULT_LOCALE ? [] : [l]);
  for (const l of LOCALES) {
    for (const p of published(site).filter((x) => has(x, l))) {
      const slug = pageSlug(p, l);
      out.push([...prefix(l), ...(slug ? [slug] : [])]);
    }
    const blog = published(site).find((p) => p.key === BLOG_PAGE);
    if (blog && has(blog, l)) {
      for (const post of site.blog.posts.filter((x) => x.status === "published" && x.translations[l])) out.push([...prefix(l), pageSlug(blog, l), post.slug]);
    }
  }
  // مسیرهای قدیمی (فقط زبان پیش‌فرض) به‌صورت صفحهٔ انتقال ایستا
  for (const r of site.redirects) {
    const segs = r.from.split("/").filter(Boolean);
    if (segs.length && !out.some((p) => p.join("/") === segs.join("/"))) out.push(segs);
  }
  out.push(["404"]);
  return out;
}

/** نسخه‌های همین صفحه در زبان‌های دیگر (برای hreflang و انتخاب زبان) */
export function alternatesFor(site: SiteData, m: Match): { locale: Locale; href: string; name: string }[] {
  if (m.kind !== "page" && m.kind !== "post") return LOCALES.map((l) => ({ locale: l, href: pathFor(l), name: localeMeta[l].name }));
  return LOCALES.filter((l) => has(m.page, l) && (m.kind === "page" || site.blog.posts.find((p) => p.slug === m.slug)?.translations[l]))
    .map((l) => ({ locale: l, href: m.kind === "post" ? postHref(site, m.slug, l) : pathFor(l, pageSlug(m.page, l)), name: localeMeta[l].name }));
}
