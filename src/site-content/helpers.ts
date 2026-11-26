import type { PageDef, SectionInstance } from "@/cms/types";
import { t } from "@/cms/fields";

export { t };
export const s = (type: string, name: string, content: Record<string, unknown>): SectionInstance => ({ type, name, active: true, content });
export const P = (page: string) => ({ page });
export const M = (media: string) => ({ media });
export const F = (form: string) => ({ form });
/** فهرست ساده: هر آیتم سه‌زبانه */
export const items = (...rows: [string, string, string][]) => rows.map(([fa, en, ar]) => ({ text: t(fa, en, ar) }));

export function page(
  key: string, internal_name: string, slug: string,
  titles: [string, string, string],
  seo: { fa: [string, string]; en: [string, string]; ar: [string, string] },
  sections: SectionInstance[],
): PageDef {
  return {
    key, internal_name, status: "published",
    translations: { fa: { title: titles[0], slug }, en: { title: titles[1], slug }, ar: { title: titles[2], slug } },
    seo: {
      fa: { seo_title: seo.fa[0], meta_description: seo.fa[1] },
      en: { seo_title: seo.en[0], meta_description: seo.en[1] },
      ar: { seo_title: seo.ar[0], meta_description: seo.ar[1] },
    },
    sections,
  };
}
