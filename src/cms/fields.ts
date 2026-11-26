import type { FieldDef, FieldOption, Localized } from "./types";

/** سازنده‌های کوتاه برای تعریف فیلدهای نوع سکشن (label برای مدیر سایت در پنل است) */
type O = { req?: boolean; desc?: string };
const base = (key: string, label: string, type: FieldDef["type"], o: O = {}, extra: Partial<FieldDef> = {}): FieldDef => ({
  key, label, type, ...(o.req ? { required: true } : {}), ...(o.desc ? { description: o.desc } : {}), ...extra,
});

/** متن یک‌خطی ترجمه‌پذیر */
export const T = (key: string, label: string, o?: O) => base(key, label, "text", o, { translatable: true });
/** متن چندخطی ترجمه‌پذیر */
export const TA = (key: string, label: string, o?: O) => base(key, label, "textarea", o, { translatable: true });
/** متن قالب‌دار ترجمه‌پذیر */
export const RT = (key: string, label: string, o?: O) => base(key, label, "richtext", o, { translatable: true });
/** متن یک‌خطی غیرترجمه‌پذیر (شناسه، لنگر و…) */
export const plain = (key: string, label: string, o?: O) => base(key, label, "text", o);
export const url = (key: string, label: string, o?: O) => base(key, label, "url", o);
export const bool = (key: string, label: string, o?: O) => base(key, label, "boolean", o);
export const int = (key: string, label: string, o?: O) => base(key, label, "integer", o);
export const img = (key: string, label: string, o?: O) => base(key, label, "image", o);
export const pageRef = (key: string, label: string, o?: O) => base(key, label, "page_reference", o);
export const formRef = (key: string, label: string, o?: O) => base(key, label, "form_reference", o);
export const sel = (key: string, label: string, options: FieldOption[], o?: O) => base(key, label, "select", o, { options });
export const rep = (key: string, label: string, children: FieldDef[], o?: O) => base(key, label, "repeater", o, { children });
export const grp = (key: string, label: string, children: FieldDef[], o?: O) => base(key, label, "group", o, { children });

/** فهرست سادهٔ متنی (هر ردیف یک متن ترجمه‌پذیر) */
export const list = (key: string, label: string, o?: O) => rep(key, label, [T("text", "متن", { req: true })], o);

/* ---------------- گزینه‌های مشترک ---------------- */
export const THEMES: FieldOption[] = [
  { value: "brand", label: "برند اِنو (کهربایی)" },
  { value: "limoc", label: "لیموسی (سبز)" },
  { value: "limofood", label: "لیموفود (قرمز)" },
  { value: "benefits", label: "رفاهیات (فیروزه‌ای)" },
  { value: "custom", label: "نرم‌افزار سفارشی (طلایی)" },
];
export const SURFACES: FieldOption[] = [
  { value: "white", label: "سفید" },
  { value: "paper", label: "خاکستری روشن" },
  { value: "cream", label: "کرم (لیموسی)" },
  { value: "rose", label: "صورتی روشن (لیموفود)" },
  { value: "dark", label: "سرمه‌ای تیره" },
  { value: "limoc_dark", label: "سبز تیره (لیموسی)" },
];
export const BUTTON_STYLES: FieldOption[] = [
  { value: "primary", label: "اصلی" },
  { value: "secondary", label: "ثانویه" },
  { value: "ghost", label: "ساده" },
];
export const ICONS: FieldOption[] = (
  [
    ["arrow", "فلش"], ["bell", "زنگ"], ["bike", "پیک"], ["menu", "منو/کتاب"], ["briefcase", "کیف"], ["building", "ساختمان"],
    ["cake", "کیک"], ["chart", "نمودار"], ["check", "تیک"], ["clock", "ساعت"], ["code", "کد"], ["coffee", "قهوه"],
    ["contact", "کارت تماس"], ["card", "کارت بانکی"], ["door", "در/پرتال"], ["external", "پیوند بیرونی"], ["sheet", "اکسل"],
    ["file", "سند"], ["funnel", "قیف"], ["layers", "لایه‌ها"], ["lifebuoy", "پشتیبانی"], ["status", "وضعیت"], ["lock", "قفل"],
    ["mail", "ایمیل"], ["map", "نقشه"], ["message", "پیام"], ["pen", "طراحی"], ["percent", "درصد"], ["phone", "تلفن"],
    ["plug", "اتصال"], ["puzzle", "ماژول"], ["qr", "QR"], ["receipt", "رسید"], ["search", "جست‌وجو"], ["shield", "سپر"],
    ["mobile", "موبایل"], ["sparkles", "درخشش"], ["store", "فروشگاه"], ["tag", "برچسب"], ["target", "هدف"], ["user", "کاربر"],
    ["users", "کاربران"], ["utensils", "غذا"], ["wallet", "کیف پول"], ["workflow", "گردش‌کار"], ["wrench", "آچار"],
  ] as const
).map(([value, label]) => ({ value, label }));

export const icon = (key = "icon", label = "آیکون", o?: O) => sel(key, label, ICONS, o);

/* ---------------- مجموعه فیلدهای پرتکرار ---------------- */
export const heading = (o: { lead?: boolean; reqTitle?: boolean } = {}): FieldDef[] => [
  T("eyebrow", "روتیتر"),
  T("title", "عنوان", { req: o.reqTitle ?? true }),
  ...(o.lead === false ? [] : [TA("lead", "توضیح زیر عنوان")]),
];
export const theme = () => sel("theme", "رنگ‌بندی", THEMES);
export const surface = () => sel("surface", "پس‌زمینه", SURFACES);
export const anchor = () => plain("anchor", "شناسهٔ لنگر (برای پیوند #)", { desc: "حروف کوچک انگلیسی؛ مثل demo یا features" });

/** دکمه/پیوند: صفحهٔ داخلی (با لنگر اختیاری)، یا فقط لنگر، یا آدرس بیرونی */
export const linkChildren = (reqLabel = true): FieldDef[] => [
  T("label", "متن", { req: reqLabel }),
  pageRef("page", "صفحهٔ داخلی"),
  plain("anchor", "لنگر (#)", { desc: "مثلاً demo؛ با صفحهٔ داخلی یا به‌تنهایی" }),
  url("url", "آدرس بیرونی"),
];
export const buttons = (key = "buttons", label = "دکمه‌ها") =>
  rep(key, label, [...linkChildren(), sel("style", "نوع", BUTTON_STYLES), bool("new_tab", "باز شدن در زبانهٔ جدید")]);
/** پیوند اختیاری (group): خالی ماندنش مجاز است، پس متنش الزامی نیست */
export const link = (key: string, label: string) => grp(key, label, linkChildren(false));

/** ساخت مقدار ترجمه‌پذیر در دادهٔ محتوا */
export const t = (fa: string, en: string, ar: string): Localized => ({ fa, en, ar });
