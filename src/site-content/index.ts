/**
 * دادهٔ کامل سایت در قالب بستهٔ لیموسی (limoc-site v1).
 * تا اتصال به API، سایت از همین داده ساخته می‌شود و `npm run package` همین را به site.zip تبدیل می‌کند.
 */
import type { SiteData } from "@/cms/types";
import { sectionTypes } from "@/sections/schemas";
import { media } from "./media";
import { globalGroups } from "./globals";
import { forms } from "./forms";
import { menus } from "./menus";
import { categories, posts } from "./blog";
import { home } from "./pages/home";
import { productsPage } from "./pages/products";
import { limoc } from "./pages/limoc";
import { limofood } from "./pages/limofood";
import { benefits } from "./pages/benefits";
import { about, blog, contact, customSoftware, projects } from "./pages/rest";

export const localSite: SiteData = {
  format: "limoc-site",
  version: 1,
  website: { key: "enodigital", name: "اِنو دیجیتال", timezone: "Asia/Tehran" },
  languages: {
    fa: { name: "فارسی", direction: "rtl", default: true },
    en: { name: "English", direction: "ltr" },
    ar: { name: "العربية", direction: "rtl" },
  },
  media,
  sectionTypes,
  globalGroups,
  forms,
  pages: [home, productsPage, limoc, limofood, benefits, customSoftware, projects, about, blog, contact],
  menus,
  blog: { categories, posts },
  redirects: [
    { from: "/products/limoc", to: "/limoc", code: 301 },
    { from: "/products/limofood", to: "/limofood", code: 301 },
    { from: "/products/benefits", to: "/benefits", code: 301 },
    { from: "/services/custom-software", to: "/custom-software", code: 301 },
    { from: "/admin", to: "/", code: 301 },
  ],
};
