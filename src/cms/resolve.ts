import { BASE_PATH, L, pathFor } from "./i18n";
import { DEFAULT_LOCALE, type FieldDef, type Locale, type PageDef, type SiteData } from "./types";

/* ------------------------------------------------------------------ */
/* آدرس‌ها                                                             */
/* ------------------------------------------------------------------ */
export function pageSlug(page: PageDef, locale: Locale) {
  return (page.translations[locale] ?? page.translations[DEFAULT_LOCALE]).slug;
}
export function pageHref(site: SiteData, key: string, locale: Locale) {
  const page = site.pages.find((p) => p.key === key);
  return page ? pathFor(locale, pageSlug(page, locale)) : pathFor(locale);
}
export function pageTitle(site: SiteData, key: string, locale: Locale) {
  const page = site.pages.find((p) => p.key === key);
  return page ? (page.translations[locale] ?? page.translations[DEFAULT_LOCALE]).title : "";
}
/** صفحه‌ای که فهرست مقالات را نشان می‌دهد؛ نوشته‌ها زیر همین مسیر قرار می‌گیرند */
export const BLOG_PAGE = "blog";
export const postHref = (site: SiteData, slug: string, locale: Locale) => `${pageHref(site, BLOG_PAGE, locale)}${slug}/`;

export function mediaUrl(site: SiteData, ref: string) {
  const m = site.media.find((x) => x.ref === ref);
  return m ? `${BASE_PATH}/${m.file}` : "";
}

/* ------------------------------------------------------------------ */
/* حل مقادیر بر اساس تعریف فیلد                                        */
/* ------------------------------------------------------------------ */
export type ResolvedImage = { src: string; alt: string };
export type ResolvedLink = { label: string; href: string; style?: string; external: boolean; newTab?: boolean };
export type ResolvedFormField = { key: string; type: string; required: boolean; label: string; placeholder: string; options: { value: string; label: string }[] };
export type ResolvedForm = { key: string; title: string; submitLabel: string; successMessage: string; fields: ResolvedFormField[] };

export type Ctx = { site: SiteData; locale: Locale };

export function resolveImage(ctx: Ctx, v: unknown): ResolvedImage | undefined {
  const ref = (v as { media?: string } | undefined)?.media;
  if (!ref) return undefined;
  const m = ctx.site.media.find((x) => x.ref === ref);
  if (!m) return undefined;
  return { src: `${BASE_PATH}/${m.file}`, alt: L(m.alt, ctx.locale) };
}

export function resolveForm(ctx: Ctx, key: string): ResolvedForm | undefined {
  const f = ctx.site.forms.find((x) => x.key === key);
  if (!f) return undefined;
  const texts = f.texts[ctx.locale] ?? f.texts[DEFAULT_LOCALE]!;
  return {
    key: f.key,
    title: texts.title ?? "",
    submitLabel: texts.submit_label,
    successMessage: texts.success_message,
    fields: f.fields.map((x) => ({
      key: x.key, type: x.type, required: !!x.required,
      label: L(x.labels, ctx.locale),
      placeholder: x.placeholders?.[ctx.locale] ?? x.placeholders?.[DEFAULT_LOCALE] ?? "",
      options: (x.options ?? []).map((o) => ({ value: o.value, label: L(o.labels, ctx.locale) })),
    })),
  };
}

export function resolveValue(ctx: Ctx, field: FieldDef, v: unknown): unknown {
  if (v === undefined || v === null) {
    if (field.type === "repeater") return [];
    if (field.type === "group") return resolveObject(ctx, field.children ?? [], {});
    return field.translatable ? "" : v;
  }
  switch (field.type) {
    case "text": case "textarea": case "richtext":
      return field.translatable ? L(v as never, ctx.locale) : v;
    case "image": return resolveImage(ctx, v);
    case "images": return (v as unknown[]).map((x) => resolveImage(ctx, x)).filter(Boolean);
    case "page_reference": {
      const key = (v as { page?: string }).page;
      return key ? { key, href: pageHref(ctx.site, key, ctx.locale), title: pageTitle(ctx.site, key, ctx.locale) } : undefined;
    }
    case "post_reference": {
      const slug = (v as { post?: string }).post;
      return slug ? { slug, href: postHref(ctx.site, slug, ctx.locale) } : undefined;
    }
    case "form_reference": return resolveForm(ctx, (v as { form?: string }).form ?? "");
    case "repeater": return (v as Record<string, unknown>[]).map((row) => resolveObject(ctx, field.children ?? [], row));
    case "group": return resolveObject(ctx, field.children ?? [], v as Record<string, unknown>);
    default: return v;
  }
}

export function resolveObject(ctx: Ctx, fields: FieldDef[], obj: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const f of fields) out[f.key] = resolveValue(ctx, f, obj[f.key]);
  // پیوند: اگر شیء ساختار دکمه/لینک دارد، href نهایی را بساز
  if ("label" in out && ("page" in out || "url" in out || "anchor" in out)) Object.assign(out, linkOf(out));
  return out;
}

function linkOf(o: Record<string, unknown>): { href: string; external: boolean } {
  const page = o.page as { href: string } | undefined;
  const anchor = (o.anchor as string | undefined)?.replace(/^#/, "");
  const ext = o.url as string | undefined;
  if (page) return { href: page.href + (anchor ? `#${anchor}` : ""), external: false };
  if (anchor) return { href: `#${anchor}`, external: false };
  if (ext) return { href: ext, external: /^https?:\/\//.test(ext) };
  return { href: "", external: false };
}

/** همهٔ گروه‌های سراسری در زبان جاری */
export function resolveGlobals(ctx: Ctx) {
  const out: Record<string, Record<string, unknown>> = {};
  for (const [key, g] of Object.entries(ctx.site.globalGroups)) out[key] = resolveObject(ctx, g.fields, g.content);
  return out;
}

export type ResolvedMenuItem = { label: string; href: string; external: boolean; newTab: boolean; pageKey?: string; children: ResolvedMenuItem[] };
export function resolveMenu(ctx: Ctx, key: string): ResolvedMenuItem[] {
  const m = ctx.site.menus.find((x) => x.key === key);
  const walk = (items: SiteData["menus"][number]["items"]): ResolvedMenuItem[] =>
    items.map((it) => ({
      label: L(it.label, ctx.locale),
      href: it.page ? pageHref(ctx.site, it.page, ctx.locale) : it.url ?? "",
      external: !!it.url && /^https?:/.test(it.url),
      newTab: !!it.new_tab,
      pageKey: it.page,
      children: walk(it.children ?? []),
    }));
  return m ? walk(m.items) : [];
}

/* ------------------------------------------------------------------ */
/* نوشته‌های بلاگ                                                       */
/* ------------------------------------------------------------------ */
export type PostSummary = { slug: string; href: string; title: string; excerpt: string; category: string; minutes: number; date?: string; content: string; image?: ResolvedImage };

export function publishedPosts(site: SiteData, locale: Locale): PostSummary[] {
  return site.blog.posts
    .filter((p) => p.status === "published" && (p.translations[locale] ?? p.translations[DEFAULT_LOCALE]))
    .sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""))
    .map((p) => {
      const tr = p.translations[locale] ?? p.translations[DEFAULT_LOCALE]!;
      const cat = site.blog.categories.find((c) => c.key === p.categories?.[0]);
      const words = tr.content.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
      return {
        slug: p.slug,
        href: postHref(site, p.slug, locale),
        title: tr.title,
        excerpt: tr.excerpt ?? "",
        category: (cat?.translations[locale] ?? cat?.translations[DEFAULT_LOCALE])?.name ?? "",
        minutes: Math.max(1, Math.round(words / 200)),
        date: p.published_at,
        content: tr.content,
        image: p.featured_image ? resolveImage({ site, locale }, p.featured_image) : undefined,
      };
    });
}
