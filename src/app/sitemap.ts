import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { productList } from "@/lib/products";
import { articles } from "@/lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/products/", ...productList.map((p) => p.href), "/services/custom-software/", "/projects/", "/about/", "/blog/", ...articles.map((a) => `/blog/${a.slug}/`), "/contact/"];
  return paths.map((p) => ({ url: `${site.url}${p}`, lastModified: new Date(), priority: p === "/" ? 1 : p.startsWith("/products") ? 0.9 : 0.7 }));
}
