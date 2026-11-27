import { P, page, s, t } from "../helpers";
import { CTA } from "./home";

/** بخش پلن‌ها برای صفحهٔ قیمت‌ها و صفحهٔ هر محصول */
export function PRICING(product = "", theme = "brand", surface = "white") {
  return s("pricing_plans", product ? `پلن‌های ${product}` : "همهٔ پلن‌ها", {
    eyebrow: t("خرید اشتراک", "Plans & pricing", "الخطط والأسعار"),
    title: product
      ? t("پلن مناسب خود را انتخاب کنید", "Choose the plan that fits", "اختر الخطة المناسبة")
      : t("قیمت‌ها و پلن‌ها", "Plans and pricing", "الخطط والأسعار"),
    lead: t(
      "آنلاین خرید کنید، با درگاه امن پرداخت کنید و اشتراک را از پروفایل خود مدیریت و تمدید کنید.",
      "Buy online, pay through a secure gateway, and manage or renew your subscription from your account.",
      "اشترِ عبر الإنترنت، وادفع عبر بوابة آمنة، وأدر اشتراكك وجدّده من حسابك.",
    ),
    product_key: product,
    buy_label: t("خرید اشتراک", "Buy now", "اشترِ الآن"),
    badge: t("پیشنهاد ما", "Recommended", "الأكثر طلباً"),
    tax_note: t("مالیات بر ارزش افزوده هنگام پرداخت اضافه می‌شود.", "VAT is added at checkout.", "تُضاف ضريبة القيمة المضافة عند الدفع."),
    theme, surface, anchor: "pricing",
  });
}

export const pricing = page("pricing", "قیمت‌ها", "pricing", ["قیمت‌ها و خرید اشتراک", "Pricing", "الأسعار"], {
  fa: ["قیمت‌ها و خرید اشتراک", "پلن‌ها و قیمت اشتراک لیموسی، لیموفود و سامانهٔ رفاهیات؛ خرید آنلاین، پرداخت امن و مدیریت اشتراک در پروفایل کاربری."],
  en: ["Pricing and plans", "Plans and pricing for Limoc, LimoFood and the Benefits Platform — buy online, pay securely and manage your subscription from your account."],
  ar: ["الأسعار والخطط", "خطط وأسعار ليموسي وليموفود ومنصة المزايا؛ شراء إلكتروني ودفع آمن وإدارة الاشتراك من حسابك."],
}, [
  s("page_header", "سربرگ", {
    title: t("قیمت‌ها و خرید اشتراک", "Plans and pricing", "الأسعار والاشتراكات"),
    lead: t(
      "پلن هر محصول را انتخاب کنید و آنلاین بخرید؛ اشتراک بلافاصله پس از پرداخت در پروفایل شما فعال می‌شود.",
      "Pick a plan and buy online — your subscription is activated in your account as soon as you pay.",
      "اختر خطة واشترِ عبر الإنترنت؛ يتفعّل اشتراكك في حسابك فور الدفع.",
    ),
    surface: "paper",
  }),
  PRICING(),
  s("cta_banner", "دعوت پایانی", CTA(
    ["پلن مناسب را پیدا نکردید؟", "Not sure which plan fits?", "لم تجد الخطة المناسبة؟"],
    ["با ما تماس بگیرید تا بر اساس اندازهٔ تیم و نیازتان پیشنهاد بدهیم.", "Get in touch and we’ll recommend one based on your team and needs.", "تواصل معنا وسنقترح ما يناسب فريقك واحتياجك."],
  )),
]);

export { P };
