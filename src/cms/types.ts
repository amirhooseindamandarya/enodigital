/**
 * ساختار دادهٔ «بستهٔ سایت لیموسی» (format: limoc-site، نسخهٔ ۱).
 * سایت مستقیماً از همین ساختار رندر می‌شود و همین داده به site.json بسته تبدیل می‌شود.
 */

export const LOCALES = ["fa", "en", "ar"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE = "fa" as const satisfies Locale;

/** مقدار ترجمه‌پذیر: به‌ازای هر زبان یک مقدار */
export type Localized = Partial<Record<Locale, string>> & { fa: string };

export type FieldType =
  | "text" | "textarea" | "richtext" | "number" | "integer" | "decimal" | "boolean"
  | "select" | "multiselect" | "image" | "images" | "file" | "files" | "url" | "email" | "phone"
  | "date" | "datetime" | "color" | "json" | "repeater" | "group"
  | "page_reference" | "post_reference" | "category_reference" | "form_reference";

export type FieldOption = { value: string; label: string };

export type FieldDef = {
  key: string;
  label: string;
  type: FieldType;
  translatable?: boolean;
  required?: boolean;
  description?: string;
  options?: FieldOption[];
  children?: FieldDef[];
};

export type SectionTypeDef = { name: string; description?: string; fields: FieldDef[] };
export type GlobalGroupDef = { name: string; fields: FieldDef[]; content: Record<string, unknown> };

export type MediaItem = { ref: string; file: string; alt?: Localized };

export type FormFieldType = "text" | "textarea" | "email" | "phone" | "number" | "select" | "checkbox";
export type FormDef = {
  key: string;
  name: string;
  fields: {
    key: string;
    type: FormFieldType;
    required?: boolean;
    labels: Localized;
    placeholders?: Partial<Record<Locale, string>>;
    options?: { value: string; labels: Localized }[];
  }[];
  texts: Partial<Record<Locale, { title?: string; submit_label: string; success_message: string }>>;
};

export type SectionInstance = { type: string; name: string; active?: boolean; content: Record<string, unknown> };

export type PageDef = {
  key: string;
  internal_name: string;
  status: "published" | "draft";
  translations: Partial<Record<Locale, { title: string; slug: string }>> & { fa: { title: string; slug: string } };
  seo?: Partial<Record<Locale, { seo_title?: string; meta_description?: string }>>;
  sections: SectionInstance[];
};

export type MenuItem = {
  label: Localized;
  page?: string;
  url?: string;
  new_tab?: boolean;
  children?: MenuItem[];
};
export type MenuDef = { key: string; name: string; items: MenuItem[] };

export type BlogCategory = { key: string; translations: Partial<Record<Locale, { name: string; slug: string }>> };
export type BlogPost = {
  slug: string;
  status: "published" | "draft";
  published_at?: string;
  categories?: string[];
  featured_image?: { media: string };
  translations: Partial<Record<Locale, { title: string; excerpt?: string; content: string }>>;
};

export type Redirect = { from: string; to: string; code: 301 | 302 };

export type SiteData = {
  format: "limoc-site";
  version: 1;
  website: { key: string; name: string; timezone: string };
  languages: Record<string, { name: string; direction: "rtl" | "ltr"; default?: boolean }>;
  media: MediaItem[];
  sectionTypes: Record<string, SectionTypeDef>;
  globalGroups: Record<string, GlobalGroupDef>;
  forms: FormDef[];
  pages: PageDef[];
  menus: MenuDef[];
  blog: { categories: BlogCategory[]; posts: BlogPost[] };
  redirects: Redirect[];
};
