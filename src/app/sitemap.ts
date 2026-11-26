import type { MetadataRoute } from "next";
import { getSite, SITE_URL } from "@/cms/site";
import { allPaths, alternatesFor, matchPath } from "@/cms/routes";
import { localeMeta } from "@/cms/i18n";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getSite();
  return allPaths(site)
    .map((p) => ({ p, m: matchPath(site, p) }))
    .filter(({ m }) => m.kind === "page" || m.kind === "post")
    .map(({ p, m }) => ({
      url: `${SITE_URL}/${p.length ? p.join("/") + "/" : ""}`,
      lastModified: new Date(),
      priority: p.length === 0 ? 1 : m.kind === "post" ? 0.6 : 0.8,
      alternates: { languages: Object.fromEntries(alternatesFor(site, m).map((a) => [localeMeta[a.locale].htmlLang, `${SITE_URL}${a.href}`])) },
    }));
}
