import { P, page, s, t } from "../helpers";
import { CTA } from "./home";

/** صفحهٔ خدمات دیجیتال: کاتالوگ زنده از پنل مدیریت */
export const services = page("services", "خدمات دیجیتال", "services", ["خدمات دیجیتال", "Digital services", "الخدمات الرقمية"], {
  fa: ["خدمات دیجیتال", "طراحی سایت، توسعهٔ نرم‌افزار، سئو و سایر خدمات دیجیتال اِنو دیجیتال با قیمت شفاف و سفارش آنلاین."],
  en: ["Digital services", "Website design, software development, SEO and other digital services from ENO Digital, with clear pricing and online ordering."],
  ar: ["الخدمات الرقمية", "تصميم المواقع وتطوير البرمجيات وتحسين محركات البحث وخدمات رقمية أخرى من إينو ديجيتال بأسعار واضحة وطلب إلكتروني."],
}, [
  s("page_header", "سربرگ", {
    title: t("خدمات دیجیتال", "Digital services", "الخدمات الرقمية"),
    lead: t(
      "خدمت مورد نیاز خود را انتخاب کنید، آنلاین سفارش دهید و روند کار را از پروفایل خود دنبال کنید.",
      "Pick the service you need, order online and follow the work from your account.",
      "اختر الخدمة التي تحتاجها واطلبها إلكترونياً وتابع العمل من حسابك.",
    ),
    surface: "paper",
  }),
  s("services_catalog", "کاتالوگ خدمات", {
    eyebrow: t("خدمات ما", "What we do", "خدماتنا"),
    title: t("خدمات و قیمت‌ها", "Services and pricing", "الخدمات والأسعار"),
    lead: t(
      "قیمت‌ها بدون مالیات بر ارزش افزوده است. برای خدمات با قیمت توافقی، درخواست مشاوره ثبت کنید.",
      "Prices exclude VAT. For custom-quote services, send us a request.",
      "الأسعار لا تشمل ضريبة القيمة المضافة. للخدمات ذات السعر حسب الطلب، أرسل طلب استشارة.",
    ),
    buy_label: t("سفارش آنلاین", "Order online", "اطلب الآن"),
    quote_label: t("درخواست مشاوره", "Request a quote", "اطلب عرض سعر"),
    quote_link: { label: t("تماس", "Contact", "اتصل بنا"), page: P("contact") },
    badge: t("پرطرفدار", "Popular", "الأكثر طلباً"),
    theme: "brand", surface: "white", anchor: "services",
  }),
  s("cta_banner", "دعوت پایانی", CTA(
    ["خدمت مورد نظرتان را پیدا نکردید؟", "Can’t find what you need?", "لم تجد ما تحتاجه؟"],
    ["نیازتان را بگویید تا پیشنهاد و برآورد هزینه بدهیم.", "Tell us what you need and we’ll send a proposal and estimate.", "أخبرنا باحتياجك وسنرسل لك عرضاً وتقديراً للتكلفة."],
  )),
]);
