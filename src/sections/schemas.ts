/**
 * تعریف همهٔ «انواع سکشن» سایت (sectionTypes در بستهٔ لیموسی).
 * کلید هر نوع = همان نامی که فرانت با آن کامپوننت را انتخاب می‌کند (src/sections/render.tsx).
 * برچسب‌ها فارسی‌اند چون برای مدیر سایت در پنل نمایش داده می‌شوند.
 */
import type { SectionTypeDef } from "@/cms/types";
import {
  T, TA, RT, anchor, bool, buttons, formRef, heading, icon, img, int, link, list, pageRef, plain, rep, sel, surface, theme, url,
} from "@/cms/fields";

const card = () => [icon(), T("title", "عنوان", { req: true }), TA("desc", "توضیح")];
const step = () => [T("title", "عنوان", { req: true }), TA("desc", "توضیح")];
const FRAMES = [
  { value: "browser", label: "قاب مرورگر (روشن)" },
  { value: "browser_dark", label: "قاب مرورگر (تیره)" },
  { value: "phone", label: "قاب موبایل" },
  { value: "tall", label: "اسکرین‌شات بلند (برش‌خورده)" },
  { value: "board", label: "تابلوی سفارش‌های لیموفود (طرح آماده)" },
];

export const sectionTypes: Record<string, SectionTypeDef> = {
  /* ---------------- عمومی ---------------- */
  page_header: {
    name: "سربرگ صفحه",
    description: "عنوان اصلی صفحه با مسیر صفحه (breadcrumb)، توضیح، دکمه‌ها و کاشی‌های اختیاری",
    fields: [
      ...heading(),
      sel("surface", "پس‌زمینه", [{ value: "paper", label: "روشن" }, { value: "dark", label: "تیره" }]),
      buttons(),
      rep("tiles", "کاشی‌های کنار عنوان", [icon(), T("title", "عنوان", { req: true })]),
    ],
  },
  rich_text: {
    name: "متن آزاد",
    description: "عنوان و متن قالب‌دار؛ برای صفحات ساده",
    fields: [...heading(), RT("body", "متن", { req: true }), surface()],
  },
  cta_banner: {
    name: "بنر دعوت به اقدام",
    description: "کادر تیره با عنوان، توضیح و دکمه‌ها",
    fields: [T("title", "عنوان", { req: true }), TA("lead", "توضیح"), buttons()],
  },
  feature_grid: {
    name: "شبکهٔ کارت‌ها",
    description: "کارت‌های آیکون‌دار (امکانات، خدمات، اصول کاری، مدل‌های همکاری و…)",
    fields: [
      ...heading(),
      rep("items", "کارت‌ها", card(), { req: true }),
      sel("columns", "تعداد ستون", [{ value: "2", label: "۲" }, { value: "3", label: "۳" }, { value: "4", label: "۴" }]),
      sel("align", "چینش عنوان", [{ value: "start", label: "راست‌چین" }, { value: "center", label: "وسط‌چین" }]),
      T("number_prefix", "پیشوند شماره‌گذاری", { desc: "مثلاً «مدل»؛ اگر پر شود، به‌جای آیکون «مدل ۱، مدل ۲…» نمایش داده می‌شود" }),
      theme(), surface(), anchor(),
    ],
  },
  process_steps: {
    name: "مراحل فرایند",
    description: "مراحل شماره‌دار با خط پیشرفت",
    fields: [...heading(), rep("steps", "مراحل", step(), { req: true }), surface(), anchor()],
  },
  steps_row: {
    name: "مراحل (ردیفی)",
    description: "مراحل شماره‌دار به‌صورت کارت یا خط زمانی",
    fields: [
      ...heading(),
      rep("steps", "مراحل", step(), { req: true }),
      sel("style", "نمایش", [{ value: "cards", label: "کارت‌های پیوسته" }, { value: "timeline", label: "خط زمانی" }]),
      theme(), surface(),
    ],
  },
  numbered_list: {
    name: "فهرست شماره‌دار",
    description: "عنوان در یک ستون، فهرست شماره‌دار در ستون دیگر",
    fields: [...heading(), list("items", "موارد"), theme(), surface()],
  },
  faq: {
    name: "پرسش‌های متداول",
    description: "آکاردئون پرسش و پاسخ (با دادهٔ ساخت‌یافتهٔ FAQ برای گوگل)",
    fields: [
      ...heading({ lead: false }),
      rep("items", "پرسش‌ها", [T("q", "پرسش", { req: true }), TA("a", "پاسخ", { req: true })], { req: true }),
      T("aside_title", "عنوان کادر کناری"), TA("aside_desc", "توضیح کادر کناری"), link("aside_link", "دکمهٔ کادر کناری"),
      theme(), surface(),
    ],
  },
  lead_form: {
    name: "فرم درخواست",
    description: "فرم تماس/دمو/پروژه با متن معرفی",
    fields: [
      sel("layout", "چیدمان", [{ value: "banner", label: "کادر تیره (دمو)" }, { value: "split", label: "دوستونه روی زمینهٔ سفید" }]),
      T("badge", "برچسب بالای عنوان"),
      ...heading(),
      list("bullets", "نکات کنار فرم"),
      formRef("form", "فرم", { req: true }),
      T("submit_label", "متن دکمهٔ ارسال", { desc: "خالی = متن پیش‌فرض فرم" }),
      plain("context", "زمینهٔ درخواست", { desc: "همراه فرم ارسال می‌شود؛ مثلاً limoc" }),
      link("secondary_link", "پیوند کنار فرم"),
      theme(),
      sel("banner_surface", "رنگ کادر", [{ value: "dark", label: "سرمه‌ای" }, { value: "limoc_dark", label: "سبز تیره" }]),
      anchor(),
    ],
  },

  /* ---------------- صفحهٔ اصلی ---------------- */
  home_hero: {
    name: "هیروی صفحهٔ اصلی",
    description: "سربرگ تیره با عنوان، دکمه‌ها، فهرست محصولات و ترکیب تصویر سه محصول",
    fields: [
      T("badge", "برچسب بالای عنوان"),
      T("title", "عنوان", { req: true }),
      T("title_highlight", "بخش رنگی عنوان"),
      TA("subtitle", "زیرعنوان"),
      buttons(),
      img("image_main", "تصویر اصلی (مرورگر)"), T("image_main_title", "عنوان قاب تصویر اصلی"),
      img("image_secondary", "تصویر دوم (مرورگر تیره)"), T("image_secondary_title", "عنوان قاب تصویر دوم"),
    ],
  },
  intro_cards: {
    name: "معرفی با کارت‌ها",
    description: "متن معرفی در یک ستون و کارت‌های ۲×۲ در ستون دیگر",
    fields: [...heading(), buttons(), rep("cards", "کارت‌ها", card(), { req: true })],
  },
  products_showcase: {
    name: "ویترین محصولات",
    description: "کارت بزرگ محصولات (داده از گروه سراسری «محصولات»)",
    fields: [...heading(), buttons()],
  },
  solution_finder: {
    name: "انتخاب راهکار",
    description: "زبانه‌هایی که بر اساس نیاز، محصول یا خدمت مرتبط را نشان می‌دهند",
    fields: [
      ...heading(),
      rep("tabs", "زبانه‌ها", [
        icon(), T("label", "عنوان زبانه", { req: true }), T("badge", "برچسب"), T("title", "عنوان", { req: true }), TA("desc", "توضیح"),
        RT("points", "نکات", { desc: "فهرست نقطه‌دار؛ هر مورد یک آیتم" }),
        T("cta_label", "متن دکمه"), pageRef("cta_page", "صفحهٔ دکمه"), plain("cta_anchor", "لنگر دکمه (#)"), url("cta_url", "آدرس بیرونی دکمه"),
        theme(),
        sel("visual", "تصویر", [{ value: "browser", label: "قاب مرورگر" }, { value: "phone", label: "قاب موبایل" }, { value: "steps", label: "فهرست مراحل" }]),
        img("image", "تصویر"), T("frame_title", "عنوان قاب"), RT("steps", "مراحل (برای حالت فهرست مراحل)", { desc: "فهرست نقطه‌دار؛ هر مورد یک آیتم" }),
      ], { req: true }),
    ],
  },
  services_split: {
    name: "خدمات (دوستونه تیره)",
    description: "متن و دکمه‌ها در یک ستون ثابت، کارت خدمات در ستون دیگر",
    fields: [...heading(), buttons(), rep("items", "خدمات", card(), { req: true })],
  },
  projects_showcase: {
    name: "نمونه‌کارها",
    description: "نمونه‌کارها از گروه سراسری «پروژه‌ها»؛ در حالت خلاصه، اولین پروژه + کارت دعوت",
    fields: [
      ...heading({ reqTitle: false }), buttons(),
      sel("mode", "حالت نمایش", [{ value: "teaser", label: "خلاصه (صفحهٔ اصلی)" }, { value: "full", label: "همهٔ پروژه‌ها" }]),
      T("cta_title", "عنوان کارت دعوت"), TA("cta_desc", "توضیح کارت دعوت"), link("cta_link", "پیوند کارت دعوت"),
    ],
  },
  blog_teaser: {
    name: "آخرین مقالات",
    description: "کارت آخرین نوشته‌های بلاگ",
    fields: [...heading({ lead: false }), buttons(), int("count", "تعداد نوشته")],
  },
  blog_list: {
    name: "فهرست مقالات",
    description: "همهٔ نوشته‌های منتشرشدهٔ بلاگ",
    fields: [T("empty_text", "متن نبودِ نوشته")],
  },

  /* ---------------- محصولات ---------------- */
  product_list: {
    name: "فهرست محصولات",
    description: "کارت افقی هر محصول (داده از گروه سراسری «محصولات»)",
    fields: [T("link_label", "متن پیوند", { req: true })],
  },
  comparison_table: {
    name: "جدول مقایسه",
    description: "جدول ستونی برای مقایسه",
    fields: [
      T("title", "عنوان", { req: true }),
      rep("columns", "ستون‌ها (حداکثر ۴)", [T("label", "عنوان ستون", { req: true }), theme()], { req: true }),
      rep("rows", "ردیف‌ها", [T("label", "عنوان ردیف", { req: true }), T("cell_1", "خانهٔ ستون ۱"), T("cell_2", "خانهٔ ستون ۲"), T("cell_3", "خانهٔ ستون ۳"), T("cell_4", "خانهٔ ستون ۴")], { req: true }),
      T("footer_text", "متن پایین جدول"), link("footer_link", "دکمهٔ پایین جدول"),
    ],
  },
  product_hero: {
    name: "هیروی محصول",
    description: "سربرگ اختصاصی هر محصول با تصاویر و کارت‌های شناور",
    fields: [
      sel("variant", "طرح", [{ value: "limoc", label: "لیموسی (کرم و سبز)" }, { value: "limofood", label: "لیموفود (گرم)" }, { value: "benefits", label: "رفاهیات (تیره و وسط‌چین)" }], { req: true }),
      T("badge", "برچسب"),
      T("title", "عنوان", { req: true }),
      T("title_highlight", "بخش رنگی عنوان", { desc: "باید عیناً بخشی از عنوان باشد" }),
      T("subtitle", "شعار درشت زیر عنوان"),
      TA("lead", "توضیح"),
      buttons(),
      list("chips", "ویژگی‌های کوتاه"),
      img("image_main", "تصویر اصلی"), T("image_main_title", "عنوان قاب تصویر اصلی"),
      img("image_secondary", "تصویر دوم"), T("image_secondary_title", "عنوان قاب تصویر دوم"),
      img("image_tertiary", "تصویر سوم (موبایل)"),
      rep("float_cards", "کارت‌های شناور", [icon(), T("title", "عنوان", { req: true }), T("desc", "توضیح")]),
    ],
  },
  journey: {
    name: "مسیر مشتری",
    description: "مراحل پشت‌سرهم با خط پیشرفت",
    fields: [...heading(), list("steps", "مراحل"), T("note", "یادداشت پایین"), theme()],
  },
  problem_list: {
    name: "مسئله",
    description: "فهرست مشکلات مخاطب و جمع‌بندی (با کادر دعوت اختیاری)",
    fields: [
      ...heading(),
      list("points", "مشکلات"),
      T("conclusion", "جمع‌بندی (کادر تیک‌دار)"),
      sel("layout", "چیدمان", [{ value: "split", label: "دوستونه" }, { value: "grid", label: "شبکه‌ای وسط‌چین" }]),
      T("callout_title", "عنوان کادر دعوت"), TA("callout_desc", "توضیح کادر دعوت"), buttons("callout_buttons", "دکمه‌های کادر دعوت"),
      theme(), surface(),
    ],
  },
  media_split: {
    name: "متن و تصویر",
    description: "توضیح یک قابلیت با تصویر؛ با فهرست، مراحل یا کارت‌های کوچک",
    fields: [
      ...heading(),
      list("bullets", "فهرست تیک‌دار"),
      rep("steps", "مراحل شماره‌دار", step()),
      rep("cards", "کارت‌های کوچک", card()),
      TA("note", "یادداشت پایین"),
      img("image", "تصویر"), T("frame_title", "عنوان قاب"),
      sel("frame", "قاب تصویر", FRAMES),
      sel("layout", "چیدمان", [{ value: "split", label: "دوستونه" }, { value: "stacked", label: "تصویر عریض زیر متن" }]),
      sel("image_side", "سمت تصویر", [{ value: "end", label: "انتها" }, { value: "start", label: "ابتدا" }]),
      theme(), surface(), anchor(),
    ],
  },
  sla_panel: {
    name: "پشتیبانی و SLA",
    description: "بخش تیره با نمونهٔ مهلت پاسخ، تصویر تیکت، کارت‌ها و رویدادهای پیامکی",
    fields: [
      ...heading(),
      T("meter_label", "عنوان نمونهٔ مهلت"), T("meter_value", "مقدار نمونهٔ مهلت"), T("meter_note", "توضیح نمونه"),
      img("image", "تصویر"), T("frame_title", "عنوان قاب"),
      rep("items", "کارت‌ها", step(), { req: true }),
      T("extra_title", "عنوان کادر پایین"), TA("extra_desc", "توضیح کادر پایین"), list("chips", "برچسب‌ها"),
    ],
  },
  feature_groups: {
    name: "امکانات دسته‌بندی‌شده",
    description: "گروه‌های امکانات با فهرست زیرمجموعه و کادر تصویر",
    fields: [
      ...heading(),
      rep("groups", "گروه‌ها", [icon(), T("title", "عنوان", { req: true }), TA("desc", "توضیح"), RT("items", "موارد", { desc: "فهرست نقطه‌دار؛ هر مورد یک آیتم" })], { req: true }),
      T("highlight_title", "عنوان کادر تصویر"), TA("highlight_desc", "توضیح کادر تصویر"),
      img("highlight_image", "تصویر کادر"), T("highlight_frame_title", "عنوان قاب"),
      theme(),
    ],
  },
  audience: {
    name: "مخاطبان",
    description: "کارت صنایع و کاربران هدف",
    fields: [...heading(), rep("items", "مخاطبان", card(), { req: true }), T("note", "یادداشت پایین"), sel("align", "چینش عنوان", [{ value: "start", label: "راست‌چین" }, { value: "center", label: "وسط‌چین" }]), theme(), surface()],
  },
  cycle_diagram: {
    name: "چرخهٔ سه‌مرحله‌ای",
    description: "سه گره با جریان بین آن‌ها و جمع‌بندی",
    fields: [
      ...heading(),
      rep("nodes", "گره‌ها", card(), { req: true }),
      list("flows", "برچسب جریان‌ها (بین گره‌ها)"),
      T("closing", "جمع‌بندی پایین"),
      theme(), surface(), anchor(),
    ],
  },
  panels_showcase: {
    name: "پنل‌های سامانه",
    description: "کارت هر پنل با تصویر و فهرست امکانات",
    fields: [
      ...heading(),
      rep("panels", "پنل‌ها", [
        T("name", "نام پنل", { req: true }), T("audience", "کاربران"), img("image", "تصویر"),
        sel("device", "قاب", [{ value: "browser", label: "مرورگر" }, { value: "phone", label: "موبایل" }]),
        RT("items", "امکانات", { desc: "فهرست نقطه‌دار؛ هر مورد یک آیتم" }),
      ], { req: true }),
      theme(),
    ],
  },
  other_products: {
    name: "سایر محصولات",
    description: "پیوند به محصولات دیگر (محصول همین صفحه خودکار حذف می‌شود)",
    fields: [T("title", "عنوان", { req: true }), T("extra_title", "عنوان کارت اضافه"), T("extra_desc", "توضیح کارت اضافه"), link("extra_link", "پیوند کارت اضافه")],
  },

  pricing_plans: {
    name: "پلن‌های قیمت‌گذاری",
    description: "پلن‌ها و قیمت‌ها به‌صورت زنده از پنل مدیریت فروش خوانده می‌شوند؛ دکمهٔ خرید به صفحهٔ پرداخت می‌رود",
    fields: [
      ...heading(),
      plain("product_key", "شناسهٔ محصول", { desc: "مثل limoc؛ خالی = همهٔ محصولات" }),
      T("buy_label", "متن دکمهٔ خرید"),
      T("badge", "برچسب پلن پیشنهادی"),
      T("tax_note", "یادداشت زیر قیمت", { desc: "مثلاً «۱۰٪ مالیات بر ارزش افزوده اضافه می‌شود»" }),
      TA("note", "یادداشت پایین بخش"),
      theme(), surface(), anchor(),
    ],
  },

  /* ---------------- درباره و تماس ---------------- */
  identity_card: {
    name: "هویت برند",
    description: "لوگو در کنار عنوان و متن",
    fields: [img("image", "تصویر", { req: true }), ...heading({ lead: false }), TA("text", "متن")],
  },
  pillars: {
    name: "حوزه‌های فعالیت",
    description: "کارت‌های بزرگ دوستونه",
    fields: [rep("items", "کارت‌ها", [icon(), theme(), T("title", "عنوان", { req: true }), TA("desc", "توضیح"), bool("list_products", "نمایش فهرست محصولات")], { req: true })],
  },
  contact_panel: {
    name: "صفحهٔ تماس",
    description: "عنوان، راه‌های ارتباطی (از گروه سراسری)، پیوندهای سریع و فرم",
    fields: [
      ...heading(),
      T("quick_title", "عنوان پیوندهای سریع"),
      rep("quick_links", "پیوندهای سریع", [icon(), theme(), T("label", "عنوان", { req: true }), T("subtitle", "زیرعنوان"), plain("anchor", "لنگر"), { key: "page", label: "صفحه", type: "page_reference" }, url("url", "آدرس بیرونی")]),
      T("form_title", "عنوان فرم"),
      formRef("form", "فرم", { req: true }),
    ],
  },
};

/** گروه‌های سراسری: تعریف فیلدها (محتوا در src/site-content/globals.ts) */
export const globalFields = {
  brand: [
    T("name", "نام شرکت", { req: true }),
    T("legal_tagline", "عنوان حقوقی (زیر لوگو)"),
    T("tagline", "شعار"),
    TA("description", "توضیح کوتاه (فوتر و موتورهای جست‌وجو)"),
    T("footer_note", "متن فوتر"),
    img("logo_mark", "نشانه"), img("logo_mark_white", "نشانه (روی زمینهٔ تیره)"),
    img("wordmark", "نوشتار لوگو"), img("wordmark_white", "نوشتار لوگو (روی زمینهٔ تیره)"),
    img("og_image", "تصویر اشتراک‌گذاری"),
  ],
  header: [
    link("cta", "دکمهٔ سربرگ"),
    T("mega_eyebrow", "روتیتر ستون کناری منوی محصولات"),
    T("mega_title", "عنوان ستون کناری"),
    TA("mega_desc", "توضیح ستون کناری"),
    buttons("mega_buttons", "دکمه‌های ستون کناری"),
  ],
  contact_info: [
    plain("phone", "تلفن"),
    plain("email", "ایمیل"),
    T("address", "نشانی"),
    T("hours", "ساعات پاسخ‌گویی"),
    rep("socials", "شبکه‌های اجتماعی", [
      sel("name", "نام", [
        { value: "instagram", label: "اینستاگرام" }, { value: "linkedin", label: "لینکدین" },
        { value: "telegram", label: "تلگرام" }, { value: "whatsapp", label: "واتساپ" }, { value: "x", label: "ایکس" },
      ], { req: true }),
      url("url", "آدرس", { req: true }),
    ]),
    T("form_link_label", "متن پیوند فرم تماس در فوتر"),
  ],
  products: [
    rep("items", "محصولات", [
      plain("key", "شناسه", { req: true }),
      T("name", "نام", { req: true }),
      T("category", "دسته"),
      T("audience", "مخاطب"),
      TA("tagline", "شعار"),
      TA("value", "ارزش پیشنهادی"),
      RT("highlights", "ویژگی‌های شاخص", { desc: "فهرست نقطه‌دار؛ هر مورد یک آیتم" }),
      icon(), theme(),
      { key: "page", label: "صفحهٔ محصول", type: "page_reference" as const },
      T("cta_label", "متن دکمهٔ اصلی"),
      img("image", "تصویر کارت"), T("image_title", "عنوان قاب تصویر"),
      bool("dark_card", "کارت تیره"),
    ], { req: true }),
  ],
  projects: [
    rep("items", "پروژه‌ها", [
      plain("key", "شناسه", { req: true }),
      bool("published", "منتشرشده"),
      T("name", "عنوان", { req: true }),
      TA("problem", "مسئله"), TA("solution", "راهکار"), TA("result", "نتیجه"),
      RT("tags", "برچسب‌ها", { desc: "فهرست نقطه‌دار؛ هر مورد یک آیتم" }),
      img("image", "تصویر"),
      sel("frame", "قاب تصویر", [{ value: "dark", label: "تیره" }, { value: "light", label: "روشن" }]),
      { key: "page", label: "صفحهٔ مرتبط", type: "page_reference" as const },
      url("url", "پیوند بیرونی"),
    ]),
  ],
  footer: [
    T("contact_title", "عنوان ستون تماس"),
  ],
};

/** فهرست نهایی گروه‌های سراسری (نام نمایشی برای پنل) */
export const globalNames: Record<keyof typeof globalFields, string> = {
  brand: "برند و هویت",
  header: "سربرگ سایت",
  contact_info: "اطلاعات تماس",
  products: "محصولات",
  projects: "پروژه‌ها و نمونه‌کارها",
  footer: "فوتر",
};

