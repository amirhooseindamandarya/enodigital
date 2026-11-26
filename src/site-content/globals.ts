import type { GlobalGroupDef } from "@/cms/types";
import { t } from "@/cms/fields";
import { globalFields, globalNames } from "@/sections/schemas";

const L = (fa: string, en: string, ar: string) => ({ text: t(fa, en, ar) });

const content: Record<keyof typeof globalFields, Record<string, unknown>> = {
  brand: {
    name: t("اِنو دیجیتال", "ENODIGITAL", "إنو ديجيتال"),
    legal_tagline: t(
      "مجموعه بازرگانی سامانه‌های پیشرو اقتصاد نوین دیجیتال",
      "Pioneering systems for the new digital economy",
      "منظومة أنظمة رائدة للاقتصاد الرقمي الجديد",
    ),
    tagline: t("نرم‌افزارهایی برای کسب‌وکارهای رو به رشد", "Software for growing businesses", "برمجيات للأعمال النامية"),
    description: t(
      "شرکت توسعهٔ نرم‌افزار؛ سازندهٔ لیموسی (مدیریت مشتری و فروش)، لیموفود (سفارش‌گیری آنلاین غذا) و سامانهٔ بن الکترونیکی رفاهیات، و مجری پروژه‌های نرم‌افزاری سفارشی.",
      "A software company building Limoc (customer and sales management), LimoFood (online food ordering) and an electronic employee-benefits voucher platform, and delivering custom software projects.",
      "شركة تطوير برمجيات تصنع ليموسي (إدارة العملاء والمبيعات) وليموفود (الطلب الإلكتروني للطعام) ومنصة القسائم الإلكترونية لمزايا الموظفين، وتنفّذ مشاريع برمجية مخصصة.",
    ),
    footer_note: t(
      "نرم‌افزارهایی برای کسب‌وکارهای رو به رشد؛ از محصولات آماده تا راهکارهای اختصاصی.",
      "Software for growing businesses — from ready-made products to tailored solutions.",
      "برمجيات للأعمال النامية؛ من المنتجات الجاهزة إلى الحلول المخصصة.",
    ),
    logo_mark: { media: "logo-mark" },
    logo_mark_white: { media: "logo-mark-white" },
    wordmark: { media: "logo-wordmark" },
    wordmark_white: { media: "logo-wordmark-white" },
    og_image: { media: "og-cover" },
  },

  header: {
    cta: { label: t("درخواست مشاوره", "Book a consultation", "اطلب استشارة"), page: { page: "contact" } },
    mega_eyebrow: t("راهکار اختصاصی", "Tailored solution", "حل مخصص"),
    mega_title: t("نیاز شما خارج از محصولات آماده است؟", "Need something beyond our products?", "هل تحتاج إلى ما يتجاوز منتجاتنا الجاهزة؟"),
    mega_desc: t(
      "سامانهٔ متناسب با فرایند شما را طراحی و توسعه می‌دهیم.",
      "We design and build software around your own process.",
      "نصمم ونطوّر نظاماً يناسب إجراءات عملك.",
    ),
    mega_buttons: [
      { label: t("نرم‌افزار سفارشی", "Custom software", "برمجيات مخصصة"), page: { page: "custom-software" }, style: "secondary" },
      { label: t("همهٔ محصولات", "All products", "جميع المنتجات"), page: { page: "products" }, style: "ghost" },
    ],
  },

  contact_info: {
    // تلفن، ایمیل، نشانی و ساعات کاری را در پنل وارد کنید؛ فیلدهای خالی در سایت نمایش داده نمی‌شوند
    socials: [],
    form_link_label: t("فرم تماس و درخواست مشاوره", "Contact form & consultation", "نموذج التواصل وطلب الاستشارة"),
  },

  products: {
    items: [
      {
        key: "limoc",
        name: t("لیموسی", "Limoc", "ليموسي"),
        category: t("نرم‌افزار ابری فروش، مشتری، پروژه و پشتیبانی", "Cloud software for sales, customers, projects and support", "برنامج سحابي للمبيعات والعملاء والمشاريع والدعم"),
        audience: t("تیم‌های خدماتی ۲ تا ۱۰ نفره", "Service teams of 2–10 people", "فرق الخدمات من 2 إلى 10 أشخاص"),
        tagline: t(
          "از اولین ارتباط با مشتری تا فروش، اجرای پروژه و پشتیبانی؛ همه‌چیز در یک محیط منظم.",
          "From the first customer conversation to the sale, project delivery and support — all in one organised place.",
          "من أول تواصل مع العميل حتى البيع وتنفيذ المشروع والدعم؛ كل شيء في مكان واحد منظّم.",
        ),
        value: t(
          "فروش، مشتری، پروژه و پشتیبانی را یکجا مدیریت کنید؛ از اولین تماس تا پیش‌فاکتور، قرارداد، پروژه، دریافت وجه و پشتیبانی.",
          "Manage sales, customers, projects and support together — from first contact to quote, contract, project, payment and support.",
          "أدر المبيعات والعملاء والمشاريع والدعم في مكان واحد؛ من أول اتصال إلى عرض السعر والعقد والمشروع والتحصيل والدعم.",
        ),
        highlights: [
          L("قیف فروش Kanban و پیگیری مشتری", "Kanban sales pipeline and follow-ups", "مسار مبيعات Kanban ومتابعة العملاء"),
          L("پیش‌فاکتور آنلاین با تأیید مشتری", "Online quotes the customer can approve", "عروض أسعار إلكترونية يوافق عليها العميل"),
          L("پشتیبانی با SLA و پرتال مشتریان", "SLA-based support and a customer portal", "دعم وفق SLA وبوابة للعملاء"),
        ],
        icon: "users",
        theme: "limoc",
        page: { page: "limoc" },
        cta_label: t("مشاهدهٔ جزئیات", "Explore Limoc", "تعرّف على ليموسي"),
        image: { media: "limoc-quote" },
        image_title: t("لیموسی · پیش‌فاکتور", "Limoc · Quote", "ليموسي · عرض سعر"),
        dark_card: false,
      },
      {
        key: "limofood",
        name: t("لیموفود", "LimoFood", "ليموفود"),
        category: t("سامانهٔ سفارش‌گیری آنلاین رستوران و کافه", "Online ordering for restaurants and cafés", "نظام الطلب الإلكتروني للمطاعم والمقاهي"),
        audience: t("رستوران‌ها، کافه‌ها و کسب‌وکارهای غذایی", "Restaurants, cafés and food businesses", "المطاعم والمقاهي وأعمال الأغذية"),
        tagline: t(
          "فروش آنلاین اختصاصی، بدون وابستگی به پلتفرم‌های واسطه.",
          "Your own online sales channel, without depending on delivery marketplaces.",
          "قناة بيع إلكترونية خاصة بك، دون الاعتماد على المنصات الوسيطة.",
        ),
        value: t(
          "کانال فروش آنلاین خودتان را راه بیندازید و سفارش را مستقیم از مشتری بگیرید.",
          "Launch your own online sales channel and take orders directly from your customers.",
          "أطلق قناة البيع الإلكترونية الخاصة بك واستقبل الطلبات مباشرة من عملائك.",
        ),
        highlights: [
          L("منوی آنلاین و سفارش مستقیم", "Online menu and direct ordering", "قائمة إلكترونية وطلب مباشر"),
          L("درگاه پرداخت، بدون کارمزد سفارش", "Online payment, no per-order commission", "دفع إلكتروني دون عمولة على الطلب"),
          L("مدیریت سفارش، پیک و گزارش‌ها", "Orders, couriers and reports in one place", "إدارة الطلبات والتوصيل والتقارير"),
        ],
        icon: "utensils",
        theme: "limofood",
        page: { page: "limofood" },
        cta_label: t("مشاهدهٔ جزئیات", "Explore LimoFood", "تعرّف على ليموفود"),
        image: { media: "limofood-store" },
        image_title: t("لیموفود · صفحهٔ فروشگاه", "LimoFood · Store page", "ليموفود · صفحة المتجر"),
        dark_card: false,
      },
      {
        key: "benefits",
        name: t("سامانهٔ رفاهیات", "Benefits Platform", "منصة المزايا"),
        category: t("سامانهٔ بن الکترونیکی رفاهیات کارکنان", "Electronic employee-benefits vouchers", "منصة القسائم الإلكترونية لمزايا الموظفين"),
        audience: t("سازمان‌ها، واحدهای منابع انسانی و مالی", "Organisations, HR and finance teams", "المؤسسات وإدارات الموارد البشرية والمالية"),
        tagline: t(
          "مدیریت هوشمند رفاهیات کارکنان؛ از تخصیص اعتبار تا مصرف و تسویه.",
          "Smarter employee benefits — from allocating credit to spending and settlement.",
          "إدارة ذكية لمزايا الموظفين؛ من تخصيص الرصيد إلى الاستهلاك والتسوية.",
        ),
        value: t(
          "اعتبار رفاهی کارکنان را دیجیتال تخصیص دهید، مصرف را ببینید و با فروشگاه‌ها شفاف تسویه کنید.",
          "Allocate employee benefit credit digitally, see how it’s spent and settle transparently with merchants.",
          "خصّص رصيد المزايا للموظفين رقمياً، وتابع الاستهلاك، وسوِّ الحسابات مع المتاجر بشفافية.",
        ),
        highlights: [
          L("صدور بن و تخصیص اعتبار شخصی", "Vouchers with personal credit per employee", "إصدار القسائم وتخصيص رصيد لكل موظف"),
          L("تأیید خرید با کد ۵ رقمی کارمند", "Purchases confirmed with a 5-digit employee code", "تأكيد الشراء برمز من 5 أرقام"),
          L("تسویه با فروشندگان و ۲۸ گزارش Excel", "Merchant settlement and 28 Excel reports", "التسوية مع التجار و28 تقريراً بصيغة Excel"),
        ],
        icon: "building",
        theme: "benefits",
        page: { page: "benefits" },
        cta_label: t("مشاهدهٔ جزئیات", "Explore the platform", "تعرّف على المنصة"),
        image: { media: "refah-voucher-wizard" },
        image_title: t("پنل مدیریت · صدور بن", "Admin panel · Issue voucher", "لوحة الإدارة · إصدار قسيمة"),
        dark_card: true,
      },
    ],
  },

  projects: {
    items: [
      {
        key: "benefits-platform",
        published: true,
        name: t("سامانهٔ بن الکترونیکی رفاهیات", "Electronic employee-benefits platform", "منصة القسائم الإلكترونية لمزايا الموظفين"),
        problem: t(
          "مدیریت رفاهیات کارکنان با کوپن کاغذی، تأیید حضوری و جمع‌زنی دستی فاکتورهای فروشگاه‌ها.",
          "Employee benefits were run with paper coupons, in-person approval and manual tallying of merchant invoices.",
          "كانت مزايا الموظفين تُدار بقسائم ورقية وموافقة حضورية وجمع يدوي لفواتير المتاجر.",
        ),
        solution: t(
          "سامانه‌ای با سه پنل مدیریت، فروشندگان و کارکنان؛ صدور بن، تأیید خرید با کد ۵ رقمی، تسویه و ۲۸ گزارش Excel.",
          "A platform with admin, merchant and employee panels: voucher issuing, purchase confirmation with a 5-digit code, settlement and 28 Excel reports.",
          "منصة بثلاث لوحات للإدارة والتجار والموظفين: إصدار القسائم وتأكيد الشراء برمز من 5 أرقام والتسوية و28 تقريراً بصيغة Excel.",
        ),
        result: t(
          "نتیجهٔ کمّی هنوز اندازه‌گیری و منتشر نشده است.",
          "Quantitative results have not been measured and published yet.",
          "لم تُقَس النتائج الكمية ولم تُنشر بعد.",
        ),
        tags: [L("Laravel", "Laravel", "Laravel"), L("React", "React", "React"), L("سازمانی", "Enterprise", "مؤسسي")],
        image: { media: "refah-admin-dashboard" },
        frame: "dark",
        page: { page: "benefits" },
      },
    ],
  },

  footer: {
    contact_title: t("ارتباط با ما", "Get in touch", "تواصل معنا"),
  },
};

export const globalGroups: Record<string, GlobalGroupDef> = Object.fromEntries(
  (Object.keys(globalFields) as (keyof typeof globalFields)[]).map((k) => [k, { name: globalNames[k], fields: globalFields[k], content: content[k] }]),
);
