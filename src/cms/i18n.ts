import { DEFAULT_LOCALE, LOCALES, type Locale, type Localized } from "./types";

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const localeMeta: Record<Locale, { name: string; dir: "rtl" | "ltr"; htmlLang: string; og: string; numbering: string }> = {
  fa: { name: "فارسی", dir: "rtl", htmlLang: "fa", og: "fa_IR", numbering: "fa-IR" },
  en: { name: "English", dir: "ltr", htmlLang: "en", og: "en_US", numbering: "en-US" },
  ar: { name: "العربية", dir: "rtl", htmlLang: "ar", og: "ar_AR", numbering: "ar-u-nu-latn" },
};

export const isLocale = (v: unknown): v is Locale => LOCALES.includes(v as Locale);

/** مقدار ترجمه‌پذیر در زبان جاری؛ اگر ترجمه نباشد، زبان پیش‌فرض */
export function L(v: Localized | string | undefined | null, locale: Locale): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  return v[locale] || v[DEFAULT_LOCALE] || "";
}

export const num = (n: number, locale: Locale) => n.toLocaleString(localeMeta[locale].numbering);

/** پیشوند مسیر زبان: فارسی بدون پیشوند */
export const localePrefix = (locale: Locale) => (locale === DEFAULT_LOCALE ? "" : `/${locale}`);
export const pathFor = (locale: Locale, ...segments: string[]) => {
  const rest = segments.filter(Boolean).join("/");
  return `${localePrefix(locale)}/${rest ? rest + "/" : ""}`;
};

/** متن‌های ثابت رابط کاربری (غیرمحتوایی) */
const dict = {
  skip: { fa: "رفتن به محتوا", en: "Skip to content", ar: "انتقل إلى المحتوى" },
  home: { fa: "خانه", en: "Home", ar: "الرئيسية" },
  mainNav: { fa: "منوی اصلی", en: "Main navigation", ar: "القائمة الرئيسية" },
  openMenu: { fa: "باز کردن منو", en: "Open menu", ar: "فتح القائمة" },
  closeMenu: { fa: "بستن منو", en: "Close menu", ar: "إغلاق القائمة" },
  siteNav: { fa: "منوی پیمایش سایت", en: "Site navigation", ar: "التنقل في الموقع" },
  breadcrumb: { fa: "مسیر صفحه", en: "Breadcrumb", ar: "مسار الصفحة" },
  language: { fa: "زبان", en: "Language", ar: "اللغة" },
  minutesRead: { fa: "دقیقه مطالعه", en: "min read", ar: "دقائق قراءة" },
  otherPosts: { fa: "مقالات دیگر", en: "More articles", ar: "مقالات أخرى" },
  view: { fa: "مشاهده", en: "View", ar: "عرض" },
  details: { fa: "مشاهدهٔ جزئیات", en: "View details", ar: "عرض التفاصيل" },
  suitableFor: { fa: "مناسب برای", en: "Built for", ar: "مناسب لـ" },
  problem: { fa: "مسئله", en: "Challenge", ar: "التحدي" },
  solution: { fa: "راهکار", en: "Solution", ar: "الحل" },
  result: { fa: "نتیجه", en: "Outcome", ar: "النتيجة" },
  rights: { fa: "همهٔ حقوق محفوظ است.", en: "All rights reserved.", ar: "جميع الحقوق محفوظة." },
  contactUs: { fa: "ارتباط با ما", en: "Get in touch", ar: "تواصل معنا" },
  notFoundTitle: { fa: "صفحه‌ای که دنبالش هستید پیدا نشد", en: "We couldn’t find that page", ar: "لم نعثر على الصفحة المطلوبة" },
  notFoundCode: { fa: "خطای ۴۰۴", en: "Error 404", ar: "خطأ 404" },
  choose: { fa: "انتخاب کنید", en: "Select…", ar: "اختر…" },
  required: { fa: "این فیلد الزامی است.", en: "This field is required.", ar: "هذا الحقل مطلوب." },
  invalidPhone: { fa: "شمارهٔ تماس معتبر وارد کنید.", en: "Enter a valid phone number.", ar: "أدخل رقم هاتف صالحاً." },
  invalidEmail: { fa: "ایمیل معتبر وارد کنید.", en: "Enter a valid email address.", ar: "أدخل بريداً إلكترونياً صالحاً." },
  sendError: { fa: "ارسال با خطا مواجه شد. لطفاً دوباره تلاش کنید.", en: "Something went wrong. Please try again.", ar: "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى." },
  unconfigured: {
    fa: "اطلاعات فرم معتبر است، اما ارسال آنلاین هنوز به سرور متصل نشده و پیامی ارسال نشد.",
    en: "Your details are valid, but online submission isn’t connected yet, so nothing was sent.",
    ar: "بياناتك صحيحة، لكن الإرسال عبر الإنترنت غير مفعّل بعد، لذا لم يُرسل شيء.",
  },
  orReach: { fa: "لطفاً از این راه با ما تماس بگیرید:", en: "Please reach us at:", ar: "يرجى التواصل معنا عبر:" },
  liveDemo: { fa: "نمونهٔ نمایشی", en: "Illustrative example", ar: "مثال توضيحي" },
} satisfies Record<string, Record<Locale, string>>;

export type UiKey = keyof typeof dict;
export const ui = (key: UiKey, locale: Locale) => dict[key][locale];
