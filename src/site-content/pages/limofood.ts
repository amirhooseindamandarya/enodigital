import { OTHER } from "./limoc";
import { F, M, items, page, s, t } from "../helpers";
import { PRICING } from "./pricing";

const PRIMARY = t("درخواست مشاورهٔ راه‌اندازی", "Request a setup consultation", "اطلب استشارة الإطلاق");
const SITE = { label: t("مشاهدهٔ وب‌سایت محصول", "Visit the product website", "زيارة موقع المنتج"), url: "https://limoojet.ir/", new_tab: true };

export const limofood = page("limofood", "لیموفود", "limofood", ["لیموفود", "LimoFood", "ليموفود"], {
  fa: ["لیموفود؛ سامانه سفارش آنلاین غذا برای رستوران", "لیموفود، سامانهٔ سفارش‌گیری آنلاین اختصاصی رستوران و کافه: منوی آنلاین، درگاه پرداخت، مدیریت سفارش و پیک، کد تخفیف و گزارش فروش."],
  en: ["LimoFood — online food ordering for restaurants", "LimoFood is your restaurant’s own online ordering system: online menu, payments, order and courier management, discount codes and sales reports."],
  ar: ["ليموفود — نظام الطلب الإلكتروني للمطاعم", "ليموفود نظام طلب إلكتروني خاص بالمطاعم والمقاهي: قائمة إلكترونية ودفع وإدارة الطلبات والتوصيل ورموز خصم وتقارير مبيعات."],
}, [
  s("product_hero", "هیروی لیموفود", {
    variant: "limofood",
    badge: t("سامانهٔ سفارش‌گیری آنلاین رستوران و کافه", "Online ordering for restaurants and cafés", "نظام الطلب الإلكتروني للمطاعم والمقاهي"),
    title: t("لیموفود", "LimoFood", "ليموفود"),
    subtitle: t("فروش آنلاین اختصاصی، بدون وابستگی به پلتفرم‌های واسطه.", "Your own online sales channel — no marketplace in the middle.", "قناة بيع إلكترونية خاصة بك، دون منصات وسيطة."),
    lead: t("منوی آنلاین، پرداخت اینترنتی، مدیریت سفارش و پیک؛ کانال فروش آنلاین اختصاصی برای رستوران‌ها، کافه‌ها و کسب‌وکارهای غذایی.", "Online menu, online payment, order and courier management — a dedicated online sales channel for restaurants, cafés and food businesses.", "قائمة إلكترونية ودفع عبر الإنترنت وإدارة الطلبات والتوصيل؛ قناة بيع إلكترونية خاصة للمطاعم والمقاهي وأعمال الأغذية."),
    buttons: [{ label: PRIMARY, anchor: "demo", style: "primary" }, { ...SITE, style: "ghost" }],
    chips: items(["منوی آنلاین", "Online menu", "قائمة إلكترونية"], ["درگاه پرداخت", "Online payment", "بوابة دفع"], ["بدون کارمزد سفارش", "No per-order commission", "دون عمولة على الطلب"], ["مدیریت پیک", "Courier management", "إدارة التوصيل"]),
    image_main: M("limofood-store"), image_main_title: t("لیموفود · صفحهٔ فروشگاه", "LimoFood · Store page", "ليموفود · صفحة المتجر"),
  }),
  s("problem_list", "مسئله", {
    eyebrow: t("مسئله", "The problem", "المشكلة"),
    title: t("وقتی فروش آنلاین شما در اختیار پلتفرم‌های واسطه است", "When your online sales are in a marketplace’s hands", "عندما تكون مبيعاتك الإلكترونية بيد المنصات الوسيطة"),
    points: items(
      ["بخشی از مبلغ هر سفارش صرف کارمزد واسطه می‌شود", "A share of every order goes to the intermediary’s commission", "يذهب جزء من قيمة كل طلب عمولةً للوسيط"],
      ["ارتباط مستقیم با مشتری و اطلاعات او در اختیار شما نیست", "You don’t own the customer relationship or their data", "لا تملك علاقة مباشرة مع العميل ولا بياناته"],
      ["سفارش‌ها بین تلفن، پیام‌رسان و پلتفرم‌ها پراکنده‌اند", "Orders are scattered across phone, chat apps and platforms", "تتوزع الطلبات بين الهاتف وتطبيقات المراسلة والمنصات"],
      ["کنترل تخفیف، ارسال و گزارش فروش دست خودتان نیست", "Discounts, delivery and sales reports aren’t in your control", "لا تتحكم في الخصومات والتوصيل وتقارير المبيعات"],
    ),
    conclusion: t("فروش آنلاین اختصاصی، بدون وابستگی به پلتفرم‌های واسطه.", "Your own online sales channel — no marketplace in the middle.", "قناة بيع إلكترونية خاصة بك، دون منصات وسيطة."),
    layout: "split", theme: "limofood", surface: "white",
  }),
  s("media_split", "تجربهٔ سفارش", {
    eyebrow: t("تجربهٔ سفارش", "Ordering experience", "تجربة الطلب"),
    title: t("منوی آنلاین فروشگاه شما، با برند خودتان", "Your online menu, under your own brand", "قائمتك الإلكترونية بعلامتك التجارية"),
    lead: t("محصولات با دسته‌بندی، تصویر، وزن و قیمت؛ مشتری انتخاب می‌کند، به سبد اضافه می‌کند و آنلاین پرداخت می‌کند.", "Products with categories, photos, weights and prices — customers choose, add to cart and pay online.", "منتجات بتصنيفات وصور وأوزان وأسعار؛ يختار العميل ويضيف إلى السلة ويدفع إلكترونياً."),
    bullets: items(["منوی موبایلی با دسته‌بندی و تصویر محصول", "Mobile menu with categories and product photos", "قائمة للجوال بتصنيفات وصور للمنتجات"], ["اعمال کد تخفیف هنگام سفارش", "Discount codes at checkout", "تطبيق رموز الخصم عند الطلب"], ["پرداخت از طریق درگاه آنلاین", "Payment through an online gateway", "الدفع عبر بوابة إلكترونية"], ["اطلاع‌رسانی وضعیت سفارش با پیامک", "SMS order-status updates", "إشعارات حالة الطلب برسائل قصيرة"]),
    image: M("limofood-menu"), frame: "tall", image_side: "end", theme: "limofood", surface: "rose",
  }),
  s("media_split", "کنترل فروش آنلاین", {
    eyebrow: t("کنترل فروش آنلاین", "Run your online sales", "إدارة البيع الإلكتروني"),
    title: t("همهٔ سفارش‌ها، یک تابلوی عملیات", "Every order on one operations board", "كل الطلبات في لوحة تشغيل واحدة"),
    lead: t("سفارش‌های جدید، در حال آماده‌سازی، در حال ارسال و تحویل‌شده را یک‌جا ببینید و پیک را به سفارش اختصاص دهید.", "See new, in-preparation, out-for-delivery and delivered orders at a glance, and assign couriers to orders.", "شاهد الطلبات الجديدة وقيد التحضير وقيد التوصيل والمسلّمة في مكان واحد، وأسند الطلب إلى مندوب التوصيل."),
    frame: "board", frame_title: t("لیموفود · پنل رستوران", "LimoFood · Restaurant panel", "ليموفود · لوحة المطعم"), layout: "stacked", theme: "limofood", surface: "white",
  }),
  s("feature_grid", "امکانات", {
    eyebrow: t("امکانات کلیدی", "Key features", "الإمكانات الرئيسية"),
    title: t("امکانات سفارش‌گیری و مدیریت فروش", "Ordering and sales management features", "إمكانات الطلب وإدارة المبيعات"),
    items: [
      { icon: "menu", title: t("منوی آنلاین", "Online menu", "قائمة إلكترونية"), desc: t("منوی دیجیتال با دسته‌بندی، تصویر و قیمت، روی موبایل مشتری.", "A digital menu with categories, photos and prices on the customer’s phone.", "قائمة رقمية بتصنيفات وصور وأسعار على جوال العميل.") },
      { icon: "receipt", title: t("ثبت و مدیریت سفارش‌ها", "Order management", "تسجيل الطلبات وإدارتها"), desc: t("همهٔ سفارش‌ها در یک پنل، با وضعیت روشن.", "All orders in one panel, with clear statuses.", "كل الطلبات في لوحة واحدة بحالات واضحة.") },
      { icon: "card", title: t("درگاه پرداخت آنلاین", "Online payment gateway", "بوابة دفع إلكتروني"), desc: t("پرداخت آنلاین سفارش توسط مشتری.", "Customers pay for orders online.", "يدفع العميل ثمن الطلب إلكترونياً.") },
      { icon: "percent", title: t("فروش مستقیم بدون کارمزد سفارش", "Direct sales, no order commission", "بيع مباشر دون عمولة على الطلب"), desc: t("سفارش از کانال خودتان، بدون کارمزد واسطه برای هر سفارش.", "Orders through your own channel, with no intermediary fee per order.", "طلبات عبر قناتك دون رسوم وسيط على كل طلب.") },
      { icon: "store", title: t("مدیریت رستوران و فروش", "Restaurant and sales management", "إدارة المطعم والمبيعات"), desc: t("کنترل منو، موجودی و عملیات فروش آنلاین.", "Control your menu, stock and online sales operations.", "التحكم في القائمة والمخزون وعمليات البيع الإلكتروني.") },
      { icon: "user", title: t("پنل کاربری", "Customer accounts", "حسابات العملاء"), desc: t("حساب کاربری مشتری برای سفارش‌ها و پیگیری آن‌ها.", "Customer accounts for ordering and tracking orders.", "حساب للعميل لتقديم الطلبات ومتابعتها.") },
      { icon: "message", title: t("اطلاع‌رسانی و پیامک", "Notifications and SMS", "الإشعارات والرسائل القصيرة"), desc: t("اطلاع‌رسانی وضعیت سفارش و پیام‌های تبلیغاتی.", "Order-status notifications and promotional messages.", "إشعارات حالة الطلب والرسائل الترويجية.") },
      { icon: "tag", title: t("کد تخفیف و تشویق خرید", "Discount codes and incentives", "رموز الخصم وتحفيز الشراء"), desc: t("کمپین تخفیف برای بازگرداندن مشتری.", "Discount campaigns that bring customers back.", "حملات خصم لإعادة العملاء.") },
      { icon: "chart", title: t("گزارش‌ها و تراکنش‌ها", "Reports and transactions", "التقارير والمعاملات"), desc: t("گزارش فروش و تراکنش‌های مالی.", "Sales reports and financial transactions.", "تقارير المبيعات والمعاملات المالية.") },
      { icon: "status", title: t("مدیریت وضعیت سفارش", "Order status tracking", "إدارة حالة الطلب"), desc: t("از ثبت تا آماده‌سازی و تحویل، مرحله‌به‌مرحله.", "From order to preparation and delivery, step by step.", "من التسجيل إلى التحضير والتسليم، خطوة بخطوة.") },
      { icon: "bike", title: t("مدیریت پیک و ارسال", "Courier and delivery management", "إدارة التوصيل والمندوبين"), desc: t("تخصیص پیک و پیگیری فرایند ارسال.", "Assign couriers and track deliveries.", "إسناد المندوبين ومتابعة التوصيل.") },
      { icon: "puzzle", title: t("ماژول‌های توسعه‌ای", "Add-on modules", "وحدات إضافية"), desc: t("امکاناتی مانند چندفروشندگی و اپلیکیشن.", "Options such as multi-vendor and a mobile app.", "إمكانات مثل تعدد البائعين والتطبيق.") },
    ],
    columns: "4", theme: "limofood", surface: "paper",
  }),
  s("steps_row", "راه‌اندازی", {
    eyebrow: t("نحوهٔ کار", "How it works", "كيف يعمل"),
    title: t("راه‌اندازی تا اولین سفارش", "From setup to your first order", "من الإعداد حتى أول طلب"),
    steps: [
      { title: t("راه‌اندازی منو", "Set up your menu", "إعداد القائمة"), desc: t("دسته‌ها، محصولات، قیمت‌ها و تصاویر را وارد کنید.", "Add categories, products, prices and photos.", "أدخل التصنيفات والمنتجات والأسعار والصور.") },
      { title: t("سفارش مشتری", "Customer orders", "طلب العميل"), desc: t("مشتری از منوی آنلاین سفارش می‌دهد و آنلاین پرداخت می‌کند.", "The customer orders from the online menu and pays online.", "يطلب العميل من القائمة الإلكترونية ويدفع إلكترونياً.") },
      { title: t("مدیریت سفارش", "Manage the order", "إدارة الطلب"), desc: t("سفارش در پنل شما ثبت و وضعیت آن به‌روز می‌شود.", "The order appears in your panel and its status is updated.", "يُسجَّل الطلب في لوحتك وتُحدَّث حالته.") },
      { title: t("ارسال", "Delivery", "التوصيل"), desc: t("پیک تخصیص داده می‌شود و مشتری از وضعیت مطلع می‌شود.", "A courier is assigned and the customer is kept informed.", "يُسند المندوب ويُبلَّغ العميل بالحالة.") },
      { title: t("گزارش و بازگشت مشتری", "Reports and repeat customers", "التقارير وعودة العملاء"), desc: t("فروش را تحلیل کنید و با کد تخفیف مشتری را برگردانید.", "Analyse sales and win customers back with discount codes.", "حلّل المبيعات وأعد العملاء برموز الخصم.") },
    ],
    style: "cards", theme: "limofood", surface: "paper",
  }),
  s("audience", "مخاطبان", {
    eyebrow: t("کاربران و صنایع هدف", "Who it’s for", "لمن صُمّم"),
    title: t("لیموفود برای چه کسانی است؟", "Who is LimoFood for?", "لمن ليموفود؟"),
    items: [
      { icon: "utensils", title: t("رستوران و فست‌فود", "Restaurants and fast food", "المطاعم والوجبات السريعة"), desc: t("سفارش بیرون‌بر و ارسال", "Takeaway and delivery orders", "طلبات السفري والتوصيل") },
      { icon: "coffee", title: t("کافه", "Cafés", "المقاهي"), desc: t("منوی آنلاین و سفارش سریع", "Online menu and quick ordering", "قائمة إلكترونية وطلب سريع") },
      { icon: "cake", title: t("شیرینی‌فروشی و نانوایی", "Patisseries and bakeries", "محلات الحلويات والمخابز"), desc: t("سفارش آنلاین محصولات روزانه", "Online orders for daily products", "طلب المنتجات اليومية إلكترونياً") },
    ],
    theme: "limofood", surface: "white",
  }),
  s("faq", "سؤالات متداول", {
    eyebrow: t("سؤالات متداول", "FAQ", "الأسئلة الشائعة"),
    title: t("پرسش‌های رایج دربارهٔ لیموفود", "Common questions about LimoFood", "أسئلة شائعة عن ليموفود"),
    items: [
      { q: t("لیموفود برای چه کسب‌وکارهایی مناسب است؟", "Which businesses is LimoFood for?", "لأي الأعمال يناسب ليموفود؟"), a: t("رستوران‌ها، کافه‌ها، فست‌فودها، شیرینی‌فروشی‌ها، نانوایی‌ها و دیگر کسب‌وکارهای غذایی که می‌خواهند فروش آنلاین اختصاصی داشته باشند.", "Restaurants, cafés, fast-food outlets, patisseries, bakeries and other food businesses that want their own online sales channel.", "المطاعم والمقاهي ومطاعم الوجبات السريعة ومحلات الحلويات والمخابز وسائر أعمال الأغذية التي تريد قناة بيع إلكترونية خاصة بها.") },
      { q: t("آیا برای هر سفارش کارمزد پرداخت می‌کنم؟", "Do I pay a commission on every order?", "هل أدفع عمولة على كل طلب؟"), a: t("لیموفود کانال فروش مستقیم شماست و برای هر سفارش کارمزد واسطه دریافت نمی‌شود. جزئیات مدل همکاری را در جلسهٔ مشاوره بررسی می‌کنیم.", "LimoFood is your direct sales channel, so there’s no intermediary commission per order. We’ll go through the commercial model in a consultation.", "ليموفود قناة بيعك المباشرة، ولا تُفرض عمولة وسيط على كل طلب. نراجع تفاصيل نموذج التعاون في جلسة الاستشارة.") },
      { q: t("پرداخت آنلاین چطور انجام می‌شود؟", "How does online payment work?", "كيف يتم الدفع الإلكتروني؟"), a: t("مشتری سفارش را از طریق درگاه پرداخت آنلاین پرداخت می‌کند.", "Customers pay for their order through an online payment gateway.", "يدفع العميل ثمن الطلب عبر بوابة دفع إلكتروني.") },
      { q: t("آیا امکان اپلیکیشن یا چندفروشندگی وجود دارد؟", "Is there an app or multi-vendor option?", "هل يتوفر تطبيق أو تعدد البائعين؟"), a: t("این امکانات به‌صورت ماژول‌های توسعه‌ای قابل ارائه هستند و در جلسهٔ مشاوره بررسی می‌شوند.", "These are available as add-on modules and can be discussed in a consultation.", "تتوفر هذه الإمكانات كوحدات إضافية ونناقشها في جلسة الاستشارة.") },
    ],
    theme: "limofood", surface: "white",
  }),
  PRICING("limofood", "limofood", "white"),
  s("lead_form", "درخواست مشاوره", {
    layout: "banner", badge: t("لیموفود", "LimoFood", "ليموفود"),
    title: t("کانال فروش آنلاین خودتان را راه بیندازید", "Launch your own online sales channel", "أطلق قناة البيع الإلكترونية الخاصة بك"),
    lead: t("اطلاعات کسب‌وکارتان را بفرستید تا برای راه‌اندازی لیموفود با شما تماس بگیریم.", "Send us your business details and we’ll get in touch about setting up LimoFood.", "أرسل بيانات نشاطك التجاري وسنتواصل معك لإطلاق ليموفود."),
    form: F("demo"), submit_label: PRIMARY, context: "limofood",
    secondary_link: { label: SITE.label, url: SITE.url },
    theme: "limofood", banner_surface: "dark", anchor: "demo",
  }),
  s("other_products", "سایر محصولات", OTHER()),
]);
