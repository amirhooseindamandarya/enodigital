import settings from "@/content/settings.json";

/**
 * تنظیمات شرکت مادر.
 * متن‌ها و راه‌های ارتباطی در src/content/settings.json هستند و از پنل مدیریت (/admin) قابل ویرایش‌اند.
 */
export const site = {
  name: "اِنو دیجیتال",
  nameEn: "ENODIGITAL",
  /** عبارت زیر لوگو */
  legalTagline: settings.legalTagline,
  tagline: settings.tagline,
  description: settings.description,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://amirhooseindamandarya.github.io/enodigital",
  /** مقادیر خالی در سایت نمایش داده نمی‌شوند */
  contact: settings.contact,
  social: settings.social,
  formEndpoint: process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "",
} as const;

/** پیوند کامل شبکه‌های اجتماعی از نام کاربری یا آدرس */
export function socialLinks() {
  const s = site.social;
  const url = (v: string, base: string) => (/^https?:\/\//.test(v) ? v : base + v.replace(/^@/, ""));
  return [
    s.instagram && { key: "instagram", label: "اینستاگرام", href: url(s.instagram, "https://instagram.com/") },
    s.linkedin && { key: "linkedin", label: "لینکدین", href: url(s.linkedin, "https://www.linkedin.com/company/") },
    s.telegram && { key: "telegram", label: "تلگرام", href: url(s.telegram, "https://t.me/") },
    s.whatsapp && { key: "whatsapp", label: "واتساپ", href: url(s.whatsapp.replace(/[^\d]/g, ""), "https://wa.me/") },
  ].filter(Boolean) as { key: string; label: string; href: string }[];
}

export const mainNav = [
  { href: "/services/custom-software/", label: "نرم‌افزار سفارشی" },
  { href: "/projects/", label: "پروژه‌ها" },
  { href: "/blog/", label: "مقالات" },
  { href: "/about/", label: "درباره ما" },
  { href: "/contact/", label: "تماس" },
] as const;
