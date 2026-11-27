import { F, M, P, items, page, s, t, ul } from "../helpers";

export const home = page("home", "خانه", "", ["خانه", "Home", "الرئيسية"], {
  fa: ["اِنو دیجیتال | توسعهٔ نرم‌افزار و محصولات SaaS", "نرم‌افزار برای کسب‌وکارهای رو به رشد: لیموسی برای مشتری و فروش، لیموفود برای سفارش آنلاین غذا، سامانهٔ رفاهیات و نرم‌افزار سفارشی."],
  en: ["ENODIGITAL | Software development and SaaS products", "Software for growing businesses: Limoc for customers and sales, LimoFood for online food ordering, an employee-benefits platform and custom software."],
  ar: ["إنو ديجيتال | تطوير البرمجيات ومنتجات SaaS", "برمجيات للأعمال النامية: ليموسي للعملاء والمبيعات، وليموفود للطلب الإلكتروني، ومنصة مزايا الموظفين، وبرمجيات مخصصة."],
}, [
  s("home_hero", "هیروی صفحهٔ اصلی", {
    badge: t("محصولات آماده + توسعهٔ نرم‌افزار سفارشی", "Ready-made products + custom software", "منتجات جاهزة + برمجيات مخصصة"),
    title: t("نرم‌افزارهایی برای کسب‌وکارهای رو به رشد.", "Software for businesses that are growing.", "برمجيات للأعمال التي تنمو."),
    title_highlight: t("کسب‌وکارهای رو به رشد.", "that are growing.", "التي تنمو."),
    subtitle: t(
      "از محصولات نرم‌افزاری آماده تا راهکارهای اختصاصی؛ فناوری را به ابزاری برای ساده‌تر شدن فرایندها و توسعهٔ کسب‌وکار شما تبدیل می‌کنیم.",
      "From ready-made software products to tailored solutions, we turn technology into a tool that simplifies your processes and helps your business grow.",
      "من المنتجات البرمجية الجاهزة إلى الحلول المخصصة؛ نحوّل التقنية إلى أداة تبسّط إجراءاتك وتدعم نمو أعمالك.",
    ),
    buttons: [
      { label: t("کشف محصولات", "Explore products", "اكتشف المنتجات"), page: P("products"), style: "primary" },
      { label: t("سفارش نرم‌افزار اختصاصی", "Commission custom software", "اطلب برمجيات مخصصة"), page: P("custom-software"), style: "ghost" },
    ],
    image_main: M("limoc-kanban"), image_main_title: t("لیموسی · نمای Kanban فروش", "Limoc · Sales Kanban", "ليموسي · لوحة Kanban للمبيعات"),
    image_secondary: M("refah-admin-dashboard"), image_secondary_title: t("پنل مدیریت · داشبورد", "Admin panel · Dashboard", "لوحة الإدارة · لوحة المعلومات"),
  }),
  s("intro_cards", "رویکرد ما", {
    eyebrow: t("رویکرد ما", "Our approach", "نهجنا"),
    title: t("ما فقط نرم‌افزار نمی‌نویسیم؛ راهکارهایی می‌سازیم که به کار می‌آیند.", "We don’t just write software — we build solutions that get used.", "نحن لا نكتب برمجيات فحسب؛ بل نبني حلولاً تُستخدم فعلاً."),
    lead: t(
      "هر محصول و هر پروژه از یک مسئلهٔ واقعی شروع می‌شود. اول فرایند را می‌فهمیم، بعد تجربه‌ای طراحی می‌کنیم که کاربر بدون آموزش طولانی از آن استفاده کند، و آن را طوری می‌سازیم که سال‌ها قابل نگهداری بماند.",
      "Every product and project starts with a real problem. First we understand the process, then design an experience people can use without lengthy training, and build it to stay maintainable for years.",
      "يبدأ كل منتج وكل مشروع من مشكلة حقيقية. نفهم الإجراء أولاً، ثم نصمم تجربة يستخدمها الناس دون تدريب طويل، ونبنيها لتبقى قابلة للصيانة لسنوات.",
    ),
    buttons: [{ label: t("دربارهٔ شرکت", "About the company", "عن الشركة"), page: P("about"), style: "ghost" }],
    cards: [
      { icon: "target", title: t("مسئله، پیش از راهکار", "Problem before solution", "المشكلة قبل الحل"), desc: t("اول می‌فهمیم چه چیزی باید بهتر شود؛ بعد تصمیم می‌گیریم چه بسازیم.", "We first understand what needs to improve, then decide what to build.", "نفهم أولاً ما الذي يجب تحسينه، ثم نقرر ماذا نبني.") },
      { icon: "pen", title: t("تجربهٔ کاربری اصولی", "Thoughtful user experience", "تجربة مستخدم مدروسة"), desc: t("رابط‌هایی که کاربران واقعی بدون آموزش طولانی از آن استفاده کنند.", "Interfaces real people can use without long training.", "واجهات يستخدمها الناس فعلاً دون تدريب طويل.") },
      { icon: "code", title: t("توسعهٔ قابل نگهداری", "Maintainable engineering", "تطوير قابل للصيانة"), desc: t("معماری لایه‌بندی‌شده، کد خوانا و مستندسازی برای توسعهٔ بعدی.", "Layered architecture, readable code and documentation for what comes next.", "بنية متعددة الطبقات وشيفرة واضحة وتوثيق للتطوير اللاحق.") },
      { icon: "lifebuoy", title: t("همراهی پس از تحویل", "Support after launch", "مرافقة بعد التسليم"), desc: t("پشتیبانی، رفع اشکال و بهبود بر اساس استفادهٔ واقعی.", "Support, fixes and improvements based on real-world use.", "دعم وإصلاح وتحسين بناءً على الاستخدام الفعلي.") },
    ],
  }),
  s("products_showcase", "ویترین محصولات", {
    eyebrow: t("محصولات", "Products", "المنتجات"),
    title: t("سه محصول مستقل، هرکدام برای یک بازار مشخص", "Three independent products, each for a specific market", "ثلاثة منتجات مستقلة، لكلٍّ منها سوقه"),
    lead: t("هر محصول تیم، نقشهٔ راه و مخاطب خودش را دارد؛ اما همه با یک استاندارد ساخته می‌شوند.", "Each product has its own team, roadmap and audience — all built to the same standard.", "لكل منتج فريقه وخارطة طريقه وجمهوره، لكنها جميعاً تُبنى بالمعيار نفسه."),
    buttons: [{ label: t("مقایسهٔ محصولات", "Compare products", "قارن المنتجات"), page: P("products"), style: "ghost" }],
  }),
  s("solution_finder", "انتخاب راهکار", {
    eyebrow: t("راهکار مناسب شما", "Find your fit", "الحل المناسب لك"),
    title: t("نیاز شما کدام است؟", "What do you need?", "ما الذي تحتاجه؟"),
    lead: t("یکی را انتخاب کنید تا محصول یا خدمت مرتبط را ببینید.", "Pick one to see the matching product or service.", "اختر أحدها لترى المنتج أو الخدمة المناسبة."),
    tabs: [
      {
        icon: "users", theme: "limoc", visual: "browser", image: M("limoc-kanban"), frame_title: t("لیموسی · نمای Kanban فروش", "Limoc · Sales Kanban", "ليموسي · لوحة Kanban للمبيعات"),
        label: t("مدیریت مشتریان و فروش", "Customers & sales", "العملاء والمبيعات"), badge: t("لیموسی", "Limoc", "ليموسي"),
        title: t("لیموسی؛ مشتری، فروش، پروژه و پشتیبانی در یک محیط", "Limoc: customers, sales, projects and support in one place", "ليموسي: العملاء والمبيعات والمشاريع والدعم في مكان واحد"),
        desc: t("اگر پیگیری مشتری‌ها بین اکسل و واتساپ گم می‌شود، لیموسی مسیر سرنخ تا پیش‌فاکتور، قرارداد، پروژه و پشتیبانی را یکجا نگه می‌دارد.", "If customer follow-ups get lost between spreadsheets and WhatsApp, Limoc keeps the whole path — lead, quote, contract, project and support — in one place.", "إذا كانت متابعات العملاء تضيع بين Excel وواتساب، فإن ليموسي يجمع المسار كله من العميل المحتمل إلى عرض السعر والعقد والمشروع والدعم."),
        points: ul(["قیف فروش و یادآوری پیگیری‌ها", "Sales pipeline and follow-up reminders", "مسار المبيعات وتذكيرات المتابعة"], ["پیش‌فاکتور، قرارداد و پرداخت", "Quotes, contracts and payments", "عروض الأسعار والعقود والمدفوعات"], ["تیکتینگ با SLA و پرتال مشتری", "SLA ticketing and a customer portal", "تذاكر وفق SLA وبوابة للعملاء"]),
        cta_label: t("آشنایی با لیموسی", "Meet Limoc", "تعرّف على ليموسي"), cta_page: P("limoc"),
      },
      {
        icon: "utensils", theme: "limofood", visual: "browser", image: M("limofood-store"), frame_title: t("لیموفود · صفحهٔ فروشگاه", "LimoFood · Store page", "ليموفود · صفحة المتجر"),
        label: t("سفارش‌گیری آنلاین غذا", "Online food ordering", "الطلب الإلكتروني للطعام"), badge: t("لیموفود", "LimoFood", "ليموفود"),
        title: t("لیموفود؛ کانال فروش آنلاین اختصاصی رستوران شما", "LimoFood: your restaurant’s own online sales channel", "ليموفود: قناة البيع الإلكترونية الخاصة بمطعمك"),
        desc: t("سفارش را مستقیم از مشتری بگیرید، آنلاین پرداخت شود و از ثبت تا ارسال در یک پنل مدیریت شود.", "Take orders directly from customers, get paid online and manage everything from order to delivery in one panel.", "استقبل الطلبات مباشرة من العملاء، واقبض إلكترونياً، وأدر كل شيء من التسجيل حتى التوصيل في لوحة واحدة."),
        points: ul(["منوی آنلاین موبایلی", "Mobile-first online menu", "قائمة إلكترونية للجوال"], ["درگاه پرداخت، بدون کارمزد سفارش", "Online payment, no per-order commission", "دفع إلكتروني دون عمولة على الطلب"], ["مدیریت وضعیت سفارش و پیک", "Order status and courier management", "إدارة حالة الطلب والتوصيل"]),
        cta_label: t("آشنایی با لیموفود", "Meet LimoFood", "تعرّف على ليموفود"), cta_page: P("limofood"),
      },
      {
        icon: "building", theme: "benefits", visual: "phone", image: M("refah-employee-voucher"),
        label: t("مدیریت رفاهیات کارکنان", "Employee benefits", "مزايا الموظفين"), badge: t("سامانهٔ رفاهیات", "Benefits Platform", "منصة المزايا"),
        title: t("سامانهٔ بن الکترونیکی رفاهیات", "Electronic employee-benefits vouchers", "منصة القسائم الإلكترونية لمزايا الموظفين"),
        desc: t("اعتبار رفاهی کارکنان را تخصیص دهید، مصرف در فروشگاه‌های طرف قرارداد را ببینید و شفاف تسویه کنید.", "Allocate benefit credit, see how it’s spent at partner stores and settle transparently.", "خصّص رصيد المزايا، وتابع استهلاكه في المتاجر المتعاقدة، وسوِّ الحسابات بشفافية."),
        points: ul(["صدور بن و اعتبار شخصی هر کارمند", "Vouchers and personal credit for each employee", "إصدار القسائم ورصيد لكل موظف"], ["تأیید خرید با کد ۵ رقمی", "Purchases confirmed with a 5-digit code", "تأكيد الشراء برمز من 5 أرقام"], ["تسویه با فروشندگان و گزارش Excel", "Merchant settlement and Excel reports", "التسوية مع التجار وتقارير Excel"]),
        cta_label: t("آشنایی با سامانهٔ رفاهیات", "Explore the platform", "تعرّف على المنصة"), cta_page: P("benefits"),
      },
      {
        icon: "code", theme: "custom", visual: "steps",
        label: t("نرم‌افزار اختصاصی", "Custom software", "برمجيات مخصصة"), badge: t("خدمات توسعه", "Development services", "خدمات التطوير"),
        title: t("راهکار نرم‌افزاری متناسب با فرایند شما", "Software built around your process", "حل برمجي يناسب إجراءات عملك"),
        desc: t("وقتی فرایندتان خاص است، از تحلیل نیاز تا طراحی، توسعه، استقرار و پشتیبانی همراه شما هستیم.", "When your process is unique, we’re with you from requirements to design, development, deployment and support.", "عندما تكون إجراءاتك خاصة، نرافقك من تحليل الاحتياج إلى التصميم والتطوير والنشر والدعم."),
        points: ul(["تحلیل نیازمندی‌ها و طراحی UI/UX", "Requirements analysis and UI/UX design", "تحليل المتطلبات وتصميم UI/UX"], ["وب‌اپلیکیشن و سیستم‌های داخلی", "Web apps and internal systems", "تطبيقات الويب والأنظمة الداخلية"], ["API و یکپارچه‌سازی سامانه‌ها", "APIs and system integration", "واجهات برمجية وتكامل الأنظمة"]),
        steps: ul(["شناخت مسئله", "Understand the problem", "فهم المشكلة"], ["تحلیل و پیشنهاد راهکار", "Analysis and proposal", "التحليل واقتراح الحل"], ["طراحی", "Design", "التصميم"], ["توسعه و آزمون", "Build and test", "التطوير والاختبار"], ["استقرار و پشتیبانی", "Deploy and support", "النشر والدعم"]),
        cta_label: t("ثبت درخواست پروژه", "Request a project", "اطلب مشروعاً"), cta_page: P("custom-software"), cta_anchor: "request",
      },
    ],
  }),
  s("services_split", "توسعهٔ نرم‌افزار سفارشی", {
    eyebrow: t("توسعهٔ نرم‌افزار سفارشی", "Custom software development", "تطوير البرمجيات المخصصة"),
    title: t("نیاز شما خارج از چارچوب نرم‌افزارهای آماده است؟", "Need more than off-the-shelf software can offer?", "هل يتجاوز احتياجك حدود البرمجيات الجاهزة؟"),
    lead: t("ما نیازهای اختصاصی کسب‌وکار شما را بررسی می‌کنیم و متناسب با فرایندها، اهداف و زیرساخت‌های شما راهکار نرم‌افزاری طراحی و توسعه می‌دهیم.", "We study your business’s specific needs and design and build software that fits your processes, goals and infrastructure.", "ندرس احتياجات أعمالك الخاصة ونصمم ونطوّر حلاً برمجياً يناسب إجراءاتك وأهدافك وبنيتك التحتية."),
    buttons: [
      { label: t("ثبت درخواست پروژه", "Request a project", "اطلب مشروعاً"), page: P("custom-software"), anchor: "request", style: "primary" },
      { label: t("جزئیات خدمات", "Service details", "تفاصيل الخدمات"), page: P("custom-software"), style: "ghost" },
    ],
    items: SERVICES(),
  }),
  s("process_steps", "فرایند همکاری", {
    eyebrow: t("فرایند همکاری", "How we work", "طريقة العمل"),
    title: t("از شناخت مسئله تا استقرار؛ قدم‌به‌قدم و شفاف", "From understanding the problem to launch — step by step", "من فهم المشكلة إلى الإطلاق؛ خطوة بخطوة وبوضوح"),
    steps: PROCESS(),
  }),
  s("projects_showcase", "نمونه‌کارها", {
    eyebrow: t("پروژه‌ها", "Projects", "المشاريع"),
    title: t("نمونه‌کارها", "Case studies", "أعمالنا"),
    lead: t("پروژه‌ها را فقط با اطلاعات قابل‌استناد و پس از تأیید کارفرما منتشر می‌کنیم.", "We only publish projects with verifiable information and the client’s approval.", "لا ننشر المشاريع إلا بمعلومات موثّقة وبعد موافقة العميل."),
    buttons: [{ label: t("همهٔ پروژه‌ها", "All projects", "جميع المشاريع"), page: P("projects"), style: "ghost" }],
    mode: "teaser",
    ...NEXT_PROJECT(),
  }),
  s("blog_teaser", "آخرین مقالات", {
    eyebrow: t("مقالات و دانشنامه", "Articles", "المقالات"),
    title: t("یادداشت‌هایی دربارهٔ فروش، تجربهٔ مشتری و تحول دیجیتال", "Notes on sales, customer experience and digital transformation", "ملاحظات حول المبيعات وتجربة العملاء والتحول الرقمي"),
    buttons: [{ label: t("همهٔ مقالات", "All articles", "جميع المقالات"), page: P("blog"), style: "ghost" }],
    count: 3,
  }),
  s("cta_banner", "دعوت پایانی", CTA()),
]);

/* ---------- محتوای مشترک با صفحات دیگر ---------- */
export function SERVICES() {
  return [
    { icon: "search", title: t("تحلیل نیازمندی‌ها", "Requirements analysis", "تحليل المتطلبات"), desc: t("فرایندها، ذی‌نفعان و قیود را می‌شناسیم و دامنهٔ پروژه را شفاف می‌کنیم.", "We map processes, stakeholders and constraints and make the scope clear.", "نتعرّف على الإجراءات وأصحاب المصلحة والقيود ونوضّح نطاق المشروع.") },
    { icon: "pen", title: t("طراحی UI/UX", "UI/UX design", "تصميم UI/UX"), desc: t("جریان کاربر، وایرفریم و رابط نهایی؛ ساده برای کاربر، دقیق برای مدیر.", "User flows, wireframes and final UI — simple for users, precise for managers.", "مسارات المستخدم والنماذج الأولية والواجهة النهائية؛ بسيطة للمستخدم ودقيقة للمدير.") },
    { icon: "code", title: t("توسعهٔ وب‌اپلیکیشن", "Web application development", "تطوير تطبيقات الويب"), desc: t("سامانه‌های تحت وب پایدار، امن و قابل توسعه.", "Stable, secure and extensible web systems.", "أنظمة ويب مستقرة وآمنة وقابلة للتوسع.") },
    { icon: "layers", title: t("سیستم‌های مدیریت داخلی", "Internal management systems", "أنظمة الإدارة الداخلية"), desc: t("اتوماسیون فرایندهای درون‌سازمانی و حذف کار دستی.", "Automating internal processes and removing manual work.", "أتمتة الإجراءات الداخلية والتخلص من العمل اليدوي.") },
    { icon: "chart", title: t("داشبوردهای مدیریتی", "Management dashboards", "لوحات المعلومات الإدارية"), desc: t("تبدیل داده‌های پراکنده به گزارش‌های قابل تصمیم‌گیری.", "Turning scattered data into reports you can act on.", "تحويل البيانات المتفرقة إلى تقارير تساعد على اتخاذ القرار.") },
    { icon: "plug", title: t("API و یکپارچه‌سازی", "APIs and integration", "واجهات برمجية وتكامل"), desc: t("اتصال سامانه‌های موجود، درگاه‌ها و سرویس‌های بیرونی.", "Connecting existing systems, payment gateways and external services.", "ربط الأنظمة القائمة وبوابات الدفع والخدمات الخارجية.") },
    { icon: "lifebuoy", title: t("توسعه و پشتیبانی", "Ongoing development and support", "التطوير والدعم المستمر"), desc: t("نگهداری، بهبود مستمر و پاسخ‌گویی پس از استقرار.", "Maintenance, continuous improvement and responsiveness after launch.", "الصيانة والتحسين المستمر والاستجابة بعد الإطلاق.") },
  ];
}

export function PROCESS() {
  return [
    { title: t("شناخت مسئله", "Understand the problem", "فهم المشكلة"), desc: t("گفت‌وگو با ذی‌نفعان، بررسی فرایند فعلی و تعریف معیار موفقیت.", "Talking with stakeholders, reviewing the current process and defining success.", "الحوار مع أصحاب المصلحة ومراجعة الإجراء الحالي وتحديد معيار النجاح.") },
    { title: t("تحلیل و پیشنهاد راهکار", "Analysis and proposal", "التحليل واقتراح الحل"), desc: t("دامنه، معماری پیشنهادی، زمان‌بندی و مدل همکاری.", "Scope, proposed architecture, timeline and engagement model.", "النطاق والبنية المقترحة والجدول الزمني ونموذج التعاون.") },
    { title: t("طراحی", "Design", "التصميم"), desc: t("جریان‌های کاربری و رابط کاربری، پیش از نوشتن کد تأیید می‌شود.", "User flows and interface are approved before any code is written.", "تُعتمد مسارات المستخدم والواجهة قبل كتابة الشيفرة.") },
    { title: t("توسعه و آزمون", "Build and test", "التطوير والاختبار"), desc: t("توسعهٔ مرحله‌ای با تحویل‌های قابل بررسی و آزمون مستمر.", "Incremental development with reviewable deliveries and continuous testing.", "تطوير مرحلي مع تسليمات قابلة للمراجعة واختبار مستمر.") },
    { title: t("استقرار و پشتیبانی", "Deploy and support", "النشر والدعم"), desc: t("راه‌اندازی روی زیرساخت شما، آموزش و پشتیبانی پس از تحویل.", "Launch on your infrastructure, training and post-delivery support.", "الإطلاق على بنيتك التحتية والتدريب والدعم بعد التسليم.") },
  ];
}

export function APPROACH() {
  return [
    { icon: "target", title: t("مسئله، پیش از راهکار", "Problem before solution", "المشكلة قبل الحل"), desc: t("اول می‌فهمیم چه چیزی باید بهتر شود؛ بعد تصمیم می‌گیریم چه بسازیم.", "We first understand what needs to improve, then decide what to build.", "نفهم أولاً ما الذي يجب تحسينه، ثم نقرر ماذا نبني.") },
    { icon: "pen", title: t("تجربهٔ کاربری اصولی", "Thoughtful user experience", "تجربة مستخدم مدروسة"), desc: t("رابط‌هایی که کاربران واقعی بدون آموزش طولانی از آن استفاده کنند.", "Interfaces real people can use without long training.", "واجهات يستخدمها الناس فعلاً دون تدريب طويل.") },
    { icon: "code", title: t("توسعهٔ قابل نگهداری", "Maintainable engineering", "تطوير قابل للصيانة"), desc: t("معماری لایه‌بندی‌شده، کد خوانا و مستندسازی برای توسعهٔ بعدی.", "Layered architecture, readable code and documentation for what comes next.", "بنية متعددة الطبقات وشيفرة واضحة وتوثيق للتطوير اللاحق.") },
    { icon: "lifebuoy", title: t("همراهی پس از تحویل", "Support after launch", "مرافقة بعد التسليم"), desc: t("پشتیبانی، رفع اشکال و بهبود بر اساس استفادهٔ واقعی.", "Support, fixes and improvements based on real-world use.", "دعم وإصلاح وتحسين بناءً على الاستخدام الفعلي.") },
  ];
}

export function NEXT_PROJECT() {
  return {
    cta_title: t("پروژهٔ بعدی می‌تواند مال شما باشد", "Your project could be next", "قد يكون مشروعك هو التالي"),
    cta_desc: t("نیازتان را بنویسید؛ مسیر اجرا، زمان‌بندی و مدل همکاری را با هم بررسی می‌کنیم.", "Tell us what you need and we’ll work out the approach, timeline and engagement model together.", "أخبرنا باحتياجك، وسنبحث معاً مسار التنفيذ والجدول الزمني ونموذج التعاون."),
    cta_link: { label: t("ثبت درخواست پروژه", "Request a project", "اطلب مشروعاً"), page: P("custom-software"), anchor: "request" },
  };
}

export function CTA(title?: [string, string, string], lead?: [string, string, string]) {
  return {
    title: title ? t(...title) : t("برای تبدیل ایده‌تان به یک راهکار نرم‌افزاری آماده‌اید؟", "Ready to turn your idea into working software?", "هل أنت مستعد لتحويل فكرتك إلى حل برمجي؟"),
    lead: lead ? t(...lead) : t("دربارهٔ نیازتان بگویید؛ محصول مناسب را پیشنهاد می‌دهیم یا راهکار اختصاصی را با هم تعریف می‌کنیم.", "Tell us what you need — we’ll recommend the right product or define a tailored solution with you.", "حدّثنا عن احتياجك؛ سنقترح المنتج المناسب أو نحدد معك حلاً مخصصاً."),
    buttons: [
      { label: t("شروع گفتگو", "Start a conversation", "ابدأ المحادثة"), page: P("contact"), style: "secondary" },
      { label: t("مشاهدهٔ محصولات", "View products", "عرض المنتجات"), page: P("products"), style: "ghost" },
    ],
  };
}

export { F };
