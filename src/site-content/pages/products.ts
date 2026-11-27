import { CTA } from "./home";
import { P, items, page, s, t } from "../helpers";

export const productsPage = page("products", "محصولات", "products", ["محصولات", "Products", "المنتجات"], {
  fa: ["محصولات نرم‌افزاری", "لیموسی برای مدیریت مشتری و فروش، لیموفود برای سفارش‌گیری آنلاین غذا و سامانهٔ بن الکترونیکی رفاهیات کارکنان."],
  en: ["Software products", "Limoc for customer and sales management, LimoFood for online food ordering, and an electronic employee-benefits voucher platform."],
  ar: ["المنتجات البرمجية", "ليموسي لإدارة العملاء والمبيعات، وليموفود للطلب الإلكتروني للطعام، ومنصة القسائم الإلكترونية لمزايا الموظفين."],
}, [
  s("page_header", "سربرگ محصولات", {
    title: t("محصولات نرم‌افزاری", "Software products", "المنتجات البرمجية"),
    lead: t(
      "سه محصول مستقل، هرکدام برای یک بازار مشخص. اگر هیچ‌کدام دقیقاً نیازتان را پوشش نمی‌دهد، راهکار اختصاصی می‌سازیم.",
      "Three independent products, each for a specific market. If none of them quite fits, we’ll build a tailored solution.",
      "ثلاثة منتجات مستقلة، لكلٍّ منها سوق محدد. وإن لم يناسبك أيٌّ منها تماماً، نبني لك حلاً مخصصاً.",
    ),
    surface: "paper",
  }),
  s("product_list", "فهرست محصولات", { link_label: t("مشاهده", "View", "عرض") }),
  s("comparison_table", "مقایسهٔ سریع", {
    title: t("مقایسهٔ سریع", "Quick comparison", "مقارنة سريعة"),
    columns: [
      { label: t("لیموسی", "Limoc", "ليموسي"), theme: "limoc" },
      { label: t("لیموفود", "LimoFood", "ليموفود"), theme: "limofood" },
      { label: t("سامانهٔ رفاهیات", "Benefits Platform", "منصة المزايا"), theme: "benefits" },
    ],
    rows: [
      { label: t("مخاطب", "Audience", "الجمهور"), cell_1: t("تیم‌های خدماتی ۲ تا ۱۰ نفره", "Service teams of 2–10 people", "فرق الخدمات من 2 إلى 10 أشخاص"), cell_2: t("رستوران‌ها، کافه‌ها و کسب‌وکارهای غذایی", "Restaurants, cafés and food businesses", "المطاعم والمقاهي وأعمال الأغذية"), cell_3: t("سازمان‌ها، واحدهای منابع انسانی و مالی", "Organisations, HR and finance teams", "المؤسسات وإدارات الموارد البشرية والمالية") },
      { label: t("مسئله‌ای که حل می‌کند", "Problem it solves", "المشكلة التي يحلها"), cell_1: t("پراکندگی اطلاعات مشتری، فروش و پشتیبانی", "Customer, sales and support information scattered everywhere", "تشتت معلومات العملاء والمبيعات والدعم"), cell_2: t("وابستگی فروش آنلاین به پلتفرم‌های واسطه", "Online sales that depend on delivery marketplaces", "اعتماد البيع الإلكتروني على المنصات الوسيطة"), cell_3: t("مدیریت کاغذی بن و تسویهٔ دستی با فروشگاه‌ها", "Paper vouchers and manual settlement with stores", "قسائم ورقية وتسوية يدوية مع المتاجر") },
      { label: t("قابلیت‌های شاخص", "Key capabilities", "أبرز الإمكانات"), cell_1: t("قیف فروش Kanban، پیش‌فاکتور آنلاین، پشتیبانی با SLA و پرتال مشتریان", "Kanban pipeline, online quotes, SLA support and a customer portal", "مسار Kanban وعروض أسعار إلكترونية ودعم وفق SLA وبوابة للعملاء"), cell_2: t("منوی آنلاین، درگاه پرداخت بدون کارمزد سفارش، مدیریت سفارش و پیک", "Online menu, payments with no per-order commission, order and courier management", "قائمة إلكترونية ودفع دون عمولة على الطلب وإدارة الطلبات والتوصيل"), cell_3: t("صدور بن، تأیید خرید با کد ۵ رقمی، تسویه با فروشندگان و ۲۸ گزارش", "Vouchers, 5-digit purchase confirmation, merchant settlement and 28 reports", "إصدار القسائم وتأكيد الشراء برمز من 5 أرقام والتسوية مع التجار و28 تقريراً") },
      { label: t("اقدام بعدی", "Next step", "الخطوة التالية"), cell_1: t("درخواست دموی لیموسی", "Request a Limoc demo", "اطلب عرضاً تجريبياً لليموسي"), cell_2: t("درخواست مشاورهٔ راه‌اندازی", "Request a setup consultation", "اطلب استشارة الإطلاق"), cell_3: t("درخواست دمو برای سازمان", "Request a demo for your organisation", "اطلب عرضاً تجريبياً لمؤسستك") },
    ],
    footer_text: t("مطمئن نیستید کدام محصول مناسب شماست؟", "Not sure which product is right for you?", "لست متأكداً أي منتج يناسبك؟"),
    footer_link: { label: t("مشاوره بگیرید", "Talk to us", "احصل على استشارة"), page: P("contact") },
  }),
  s("cta_banner", "دعوت پایانی", CTA()),
]);
