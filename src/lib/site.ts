/**
 * تنظیمات شرکت مادر — نام، لوگو و راه‌های ارتباطی از اینجا قابل تغییرند.
 * TODO: نام نهایی شرکت، لوگو و اطلاعات تماس واقعی را جایگزین کنید.
 */
export const site = {
  name: "اِنو دیجیتال",
  nameEn: "Eno Digital",
  /** حرف/نشانهٔ لوگوی موقت؛ با فایل SVG لوگوی واقعی جایگزین شود */
  logoMark: "e",
  tagline: "نرم‌افزارهایی برای کسب‌وکارهای رو به رشد",
  description:
    "شرکت توسعهٔ نرم‌افزار؛ سازندهٔ لیموسی (مدیریت مشتری و فروش)، لیموفود (سفارش‌گیری آنلاین غذا) و سامانهٔ بن الکترونیکی رفاهیات، و مجری پروژه‌های نرم‌افزاری سفارشی.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://amirhooseindamandarya.github.io/enodigital",
  contact: {
    // TODO: مقادیر واقعی. تا خالی باشند در سایت نمایش داده نمی‌شوند.
    phone: "",
    email: "",
    address: "",
  },
  formEndpoint: process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "",
} as const;

export const mainNav = [
  { href: "/services/custom-software/", label: "نرم‌افزار سفارشی" },
  { href: "/projects/", label: "پروژه‌ها" },
  { href: "/blog/", label: "مقالات" },
  { href: "/about/", label: "درباره ما" },
  { href: "/contact/", label: "تماس" },
] as const;
