import type { MenuDef } from "@/cms/types";
import { t } from "@/cms/fields";

/** header: منوی اصلی (آیتم اول با زیرمنو = منوی بزرگ محصولات) · footer: ستون‌های فوتر */
export const menus: MenuDef[] = [
  {
    key: "header",
    name: "منوی اصلی",
    items: [
      {
        label: t("محصولات", "Products", "المنتجات"),
        children: [
          { page: "limoc", label: t("لیموسی", "Limoc", "ليموسي") },
          { page: "limofood", label: t("لیموفود", "LimoFood", "ليموفود") },
          { page: "benefits", label: t("سامانهٔ رفاهیات", "Benefits Platform", "منصة المزايا") },
        ],
      },
      { page: "custom-software", label: t("نرم‌افزار سفارشی", "Custom software", "برمجيات مخصصة") },
      { page: "projects", label: t("پروژه‌ها", "Projects", "المشاريع") },
      { page: "blog", label: t("مقالات", "Articles", "المقالات") },
      { page: "about", label: t("درباره ما", "About", "من نحن") },
      { page: "contact", label: t("تماس", "Contact", "اتصل بنا") },
    ],
  },
  {
    key: "footer",
    name: "منوی فوتر",
    items: [
      {
        label: t("محصولات", "Products", "المنتجات"),
        children: [
          { page: "limoc", label: t("لیموسی", "Limoc", "ليموسي") },
          { page: "limofood", label: t("لیموفود", "LimoFood", "ليموفود") },
          { page: "benefits", label: t("سامانهٔ رفاهیات", "Benefits Platform", "منصة المزايا") },
          { page: "products", label: t("همهٔ محصولات", "All products", "جميع المنتجات") },
        ],
      },
      {
        label: t("خدمات", "Services", "الخدمات"),
        children: [
          { page: "custom-software", label: t("توسعهٔ نرم‌افزار سفارشی", "Custom software development", "تطوير البرمجيات المخصصة") },
          { page: "projects", label: t("نمونه‌کارها", "Case studies", "أعمالنا") },
        ],
      },
      {
        label: t("شرکت", "Company", "الشركة"),
        children: [
          { page: "about", label: t("درباره ما", "About us", "من نحن") },
          { page: "blog", label: t("مقالات", "Articles", "المقالات") },
          { page: "contact", label: t("تماس با ما", "Contact us", "اتصل بنا") },
        ],
      },
    ],
  },
];
