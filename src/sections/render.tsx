/**
 * رندر صفحه از روی داده: هر سکشن با کلید نوعش (type) به کامپوننت متناظر می‌رسد.
 * افزودن نوع جدید = تعریف در schemas.ts + افزودن کامپوننت به همین نقشه.
 */
import { resolveObject } from "@/cms/resolve";
import { ui } from "@/cms/i18n";
import type { SectionInstance } from "@/cms/types";
import { sectionTypes } from "./schemas";
import { Breadcrumb, type SectionCtx, type SectionProps } from "./kit";
import * as G from "./general";
import * as K from "./content";
import { HomeHero, ProductHero } from "./heroes";
import { SolutionFinder } from "./solution-finder";
import { ContactPanel, LeadFormSection } from "./forms-sections";
import { PricingPlans } from "./pricing";

type Comp = (p: SectionProps) => React.ReactNode;

const registry: Record<string, { C: Comp; client?: boolean }> = {
  page_header: { C: G.PageHeader },
  rich_text: { C: G.RichText },
  cta_banner: { C: G.CtaBanner },
  feature_grid: { C: G.FeatureGrid },
  process_steps: { C: G.ProcessSteps },
  steps_row: { C: G.StepsRow },
  numbered_list: { C: G.NumberedList },
  faq: { C: G.Faq },
  lead_form: { C: LeadFormSection },
  home_hero: { C: HomeHero, client: true },
  intro_cards: { C: K.IntroCards },
  products_showcase: { C: K.ProductsShowcase },
  solution_finder: { C: SolutionFinder, client: true },
  services_split: { C: K.ServicesSplit },
  projects_showcase: { C: K.ProjectsShowcase },
  blog_teaser: { C: K.BlogTeaser },
  blog_list: { C: K.BlogList },
  product_list: { C: K.ProductList },
  comparison_table: { C: G.ComparisonTable },
  product_hero: { C: ProductHero as Comp, client: true },
  journey: { C: G.Journey },
  problem_list: { C: G.ProblemList },
  media_split: { C: K.MediaSplit },
  sla_panel: { C: K.SlaPanel },
  feature_groups: { C: K.FeatureGroups },
  audience: { C: G.Audience },
  cycle_diagram: { C: G.CycleDiagram },
  panels_showcase: { C: K.PanelsShowcase },
  other_products: { C: K.OtherProducts },
  identity_card: { C: G.IdentityCard },
  pillars: { C: G.Pillars },
  contact_panel: { C: ContactPanel },
  pricing_plans: { C: PricingPlans, client: true },
};

/** کلید همهٔ انواعی که فرانت پیاده‌سازی کرده (برای اعتبارسنجی بسته) */
export const implementedTypes = Object.keys(registry);

export function RenderSections({ sections, ctx }: { sections: SectionInstance[]; ctx: SectionCtx }) {
  // کامپوننت‌های سمت کاربر فقط دادهٔ لازم را می‌گیرند، نه کل سایت
  const clientCtx = { ...ctx, site: undefined, g: { products: ctx.g.products } } as unknown as SectionCtx;
  return (
    <>
      {sections.filter((s) => s.active !== false).map((s, i) => {
        const def = sectionTypes[s.type];
        const entry = registry[s.type];
        if (!def || !entry) {
          if (process.env.NODE_ENV !== "production") console.warn(`نوع سکشن ناشناخته: ${s.type}`);
          return null;
        }
        const c = resolveObject({ site: ctx.site, locale: ctx.locale }, def.fields, s.content);
        if (s.type === "product_hero") {
          const crumb = <Breadcrumb ctx={ctx} dark={c.variant === "benefits"} label={ui("breadcrumb", ctx.locale)} />;
          return <ProductHero key={i} c={c} ctx={clientCtx} crumb={crumb} />;
        }
        return <entry.C key={i} c={c} ctx={entry.client ? clientCtx : ctx} />;
      })}
    </>
  );
}
