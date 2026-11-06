import type { Metadata } from "next";
import { site } from "./site";

/** متادیتای استاندارد هر صفحه (canonical، Open Graph، Twitter) */
export function pageMeta({ title, description, path, keywords, absolute }: { title: string; description: string; path: string; keywords?: string[]; absolute?: boolean }): Metadata {
  const url = `${site.url}${path}`;
  return {
    title: absolute ? { absolute: title } : title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: { type: "website", locale: "fa_IR", siteName: site.name, title, description, url, images: [{ url: `${site.url}/og-cover.png`, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
