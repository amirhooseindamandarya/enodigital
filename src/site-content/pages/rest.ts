import { APPROACH, CTA, NEXT_PROJECT, PROCESS, SERVICES } from "./home";
import { F, M, P, items, page, s, t } from "../helpers";

/* ---------------- نرم‌افزار سفارشی ---------------- */
export const customSoftware = page("custom-software", "نرم‌افزار سفارشی", "custom-software", ["توسعهٔ نرم‌افزار سفارشی", "Custom software development", "تطوير البرمجيات المخصصة"], {
  fa: ["توسعهٔ نرم‌افزار سفارشی", "تحلیل نیاز، طراحی UI/UX، توسعهٔ وب‌اپلیکیشن، سیستم‌های داخلی، داشبورد، API و یکپارچه‌سازی؛ از شناخت مسئله تا استقرار و پشتیبانی."],
  en: ["Custom software development", "Requirements, UI/UX design, web apps, internal systems, dashboards, APIs and integration — from understanding the problem to launch and support."],
  ar: ["تطوير البرمجيات المخصصة", "تحليل المتطلبات وتصميم UI/UX وتطبيقات الويب والأنظمة الداخلية ولوحات المعلومات والتكامل؛ من فهم المشكلة حتى الإطلاق والدعم."],
}, [
  s("page_header", "سربرگ", {
    eyebrow: t("توسعهٔ نرم‌افزار سفارشی", "Custom software development", "تطوير البرمجيات المخصصة"),
    title: t("نرم‌افزاری که با فرایند شما ساخته می‌شود، نه برعکس.", "Software shaped around your process — not the other way round.", "برمجيات تُبنى حول إجراءاتك، لا العكس."),
    lead: t("از شناخت مسئله و تحلیل نیاز تا طراحی، توسعه، استقرار و پشتیبانی، کنار تیم شما هستیم تا سامانه‌ای بسازیم که واقعاً استفاده شود.", "From understanding the problem and analysing needs to design, development, launch and support, we work alongside your team to build a system people actually use.", "من فهم المشكلة وتحليل الاحتياج إلى التصميم والتطوير والإطلاق والدعم، نقف بجانب فريقك لنبني نظاماً يُستخدم فعلاً."),
    surface: "dark",
    buttons: [
      { label: t("ثبت درخواست پروژه", "Request a project", "اطلب مشروعاً"), anchor: "request", style: "secondary" },
      { label: t("فرایند اجرا", "Our process", "مراحل التنفيذ"), anchor: "process", style: "ghost" },
    ],
    tiles: SERVICES().slice(0, 4).map(({ icon, title }) => ({ icon, title })),
  }),
  s("numbered_list", "چه زمانی؟", {
    eyebrow: t("چه زمانی؟", "When does it make sense?", "متى؟"),
    title: t("چه زمانی نرم‌افزار سفارشی انتخاب درستی است؟", "When is custom software the right choice?", "متى تكون البرمجيات المخصصة الخيار الصحيح؟"),
    lead: t("نرم‌افزار آماده سریع‌تر و ارزان‌تر است؛ ما هم وقتی محصول آماده کافی باشد، همان را پیشنهاد می‌دهیم. اما در این موقعیت‌ها راهکار اختصاصی ارزش بیشتری می‌سازد:", "Off-the-shelf software is faster and cheaper, and when it’s enough we’ll recommend it. But in these situations a tailored solution creates more value:", "البرمجيات الجاهزة أسرع وأرخص، وحين تكفي نوصي بها. لكن في هذه الحالات يحقق الحل المخصص قيمة أكبر:"),
    items: items(
      ["فرایند شما خاص است و نرم‌افزارهای آماده فقط بخشی از آن را پوشش می‌دهند", "Your process is unique and off-the-shelf tools only cover part of it", "إجراءاتك خاصة والبرمجيات الجاهزة لا تغطي إلا جزءاً منها"],
      ["چند سامانهٔ جدا دارید که باید با هم یکپارچه شوند", "You have several separate systems that need to work together", "لديك عدة أنظمة منفصلة يجب أن تتكامل"],
      ["دادهٔ حساس دارید و می‌خواهید سامانه روی زیرساخت خودتان باشد", "You handle sensitive data and want the system on your own infrastructure", "لديك بيانات حساسة وتريد النظام على بنيتك التحتية"],
      ["به داشبورد و گزارشی نیاز دارید که از چند منبع داده تغذیه شود", "You need dashboards and reports fed from several data sources", "تحتاج إلى لوحات معلومات وتقارير تُغذّى من عدة مصادر"],
      ["می‌خواهید یک محصول دیجیتال جدید را از ایده تا بازار برسانید", "You want to take a new digital product from idea to market", "تريد إيصال منتج رقمي جديد من الفكرة إلى السوق"],
    ),
    theme: "custom", surface: "white",
  }),
  s("feature_grid", "انواع سامانه‌ها", {
    eyebrow: t("انواع سامانه‌ها", "What we build", "أنواع الأنظمة"),
    title: t("چه نوع سامانه‌هایی توسعه می‌دهیم؟", "What kinds of systems do we build?", "ما أنواع الأنظمة التي نطوّرها؟"),
    items: [
      { icon: "building", title: t("سامانه‌های سازمانی", "Enterprise systems", "الأنظمة المؤسسية"), desc: t("اتوماسیون اداری، درخواست‌ها، گردش‌کار و تأییدها", "Office automation, requests, workflows and approvals", "الأتمتة الإدارية والطلبات وسير العمل والموافقات") },
      { icon: "wallet", title: t("سامانه‌های مالی و تسویه", "Finance and settlement systems", "الأنظمة المالية والتسويات"), desc: t("کیف پول، اعتبار، تراکنش و تسویه با طرف‌های قرارداد", "Wallets, credit, transactions and settlement with partners", "المحافظ والرصيد والمعاملات والتسوية مع الأطراف المتعاقدة") },
      { icon: "store", title: t("پلتفرم‌های فروش و سفارش", "Sales and ordering platforms", "منصات البيع والطلب"), desc: t("فروشگاه، سفارش‌گیری و پنل فروشندگان", "Stores, ordering and merchant panels", "المتاجر والطلبات ولوحات البائعين") },
      { icon: "chart", title: t("داشبورد و هوش تجاری", "Dashboards and BI", "لوحات المعلومات وذكاء الأعمال"), desc: t("گزارش‌های مدیریتی از داده‌های چند سامانه", "Management reporting across multiple systems", "تقارير إدارية من بيانات عدة أنظمة") },
      { icon: "plug", title: t("یکپارچه‌سازی و API", "Integration and APIs", "التكامل وواجهات البرمجة"), desc: t("اتصال نرم‌افزارهای موجود، پیامک و درگاه‌ها", "Connecting existing software, SMS and payment gateways", "ربط البرمجيات القائمة والرسائل القصيرة وبوابات الدفع") },
      { icon: "mobile", title: t("وب‌اپ موبایل‌محور", "Mobile-first web apps", "تطبيقات ويب للجوال أولاً"), desc: t("پنل‌هایی که برای کار با گوشی طراحی شده‌اند", "Panels designed to be used on a phone", "لوحات مصممة للعمل على الهاتف") },
    ],
    columns: "3", theme: "brand", surface: "paper",
  }),
  s("process_steps", "فرایند اجرا", {
    eyebrow: t("فرایند همکاری", "How we work", "طريقة العمل"),
    title: t("از شناخت مسئله تا استقرار؛ قدم‌به‌قدم و شفاف", "From understanding the problem to launch — step by step", "من فهم المشكلة إلى الإطلاق؛ خطوة بخطوة وبوضوح"),
    steps: PROCESS(), anchor: "process", surface: "white",
  }),
  s("feature_grid", "رویکرد ما", {
    eyebrow: t("رویکرد ما", "Our approach", "نهجنا"),
    title: t("معماری و تجربهٔ کاربری؛ دو ستون یک سامانهٔ ماندگار", "Architecture and UX: the two pillars of lasting software", "البنية وتجربة المستخدم: ركيزتا النظام الدائم"),
    items: APPROACH(), columns: "4", theme: "brand", surface: "dark",
  }),
  s("feature_grid", "مدل همکاری", {
    eyebrow: t("مدل همکاری", "Engagement models", "نماذج التعاون"),
    title: t("متناسب با مرحلهٔ پروژهٔ شما", "Matched to where your project is", "بما يناسب مرحلة مشروعك"),
    items: [
      { title: t("پروژهٔ با دامنهٔ مشخص", "Fixed-scope project", "مشروع بنطاق محدد"), desc: t("برای نیازهای روشن: دامنه، زمان‌بندی و تحویل‌ها از ابتدا توافق می‌شود.", "For clear requirements: scope, timeline and deliverables are agreed up front.", "للاحتياجات الواضحة: يُتفق على النطاق والجدول والتسليمات منذ البداية.") },
      { title: t("توسعهٔ مرحله‌ای", "Phased development", "تطوير مرحلي"), desc: t("برای محصولات در حال رشد: تحویل در فازهای کوتاه و اولویت‌بندی مداوم.", "For growing products: short delivery phases and ongoing prioritisation.", "للمنتجات النامية: تسليم على مراحل قصيرة وترتيب مستمر للأولويات.") },
      { title: t("پشتیبانی و توسعهٔ مستمر", "Ongoing support and development", "دعم وتطوير مستمر"), desc: t("برای سامانه‌های در حال استفاده: نگهداری، بهبود و افزودن قابلیت.", "For systems in use: maintenance, improvements and new features.", "للأنظمة قيد الاستخدام: الصيانة والتحسين وإضافة الإمكانات.") },
    ],
    columns: "3", number_prefix: t("مدل", "Model", "النموذج"), theme: "custom", surface: "white",
  }),
  s("faq", "سؤالات متداول", {
    eyebrow: t("سؤالات متداول", "FAQ", "الأسئلة الشائعة"),
    title: t("پیش از شروع پروژه", "Before you start", "قبل بدء المشروع"),
    items: [
      { q: t("هزینهٔ پروژه چطور تعیین می‌شود؟", "How is the project cost set?", "كيف تُحدَّد تكلفة المشروع؟"), a: t("پس از جلسهٔ شناخت و تحلیل نیاز، پیشنهاد دامنه، زمان‌بندی و هزینه را ارائه می‌کنیم. پیش از این مرحله عدد قطعی اعلام نمی‌کنیم.", "After a discovery session and needs analysis, we propose scope, timeline and cost. We don’t quote a final figure before that.", "بعد جلسة التعرف وتحليل الاحتياج نقدّم مقترح النطاق والجدول والتكلفة. ولا نعلن رقماً نهائياً قبل ذلك.") },
      { q: t("آیا سامانه روی سرور خودمان نصب می‌شود؟", "Can the system run on our own servers?", "هل يُثبَّت النظام على خوادمنا؟"), a: t("بله، استقرار روی زیرساخت شما یا سرور مورد توافق قابل انجام است.", "Yes. We can deploy on your infrastructure or on an agreed server.", "نعم، يمكن النشر على بنيتك التحتية أو على خادم يُتفق عليه.") },
      { q: t("مالکیت کد با چه کسی است؟", "Who owns the code?", "لمن تعود ملكية الشيفرة؟"), a: t("مالکیت و شرایط تحویل کد در قرارداد هر پروژه مشخص می‌شود.", "Code ownership and handover terms are set in each project’s contract.", "تُحدَّد ملكية الشيفرة وشروط تسليمها في عقد كل مشروع.") },
      { q: t("بعد از تحویل پشتیبانی دارید؟", "Do you provide support after delivery?", "هل تقدمون دعماً بعد التسليم؟"), a: t("بله، دورهٔ پشتیبانی و مدل نگهداری بخشی از پیشنهاد هر پروژه است.", "Yes. A support period and maintenance model are part of every proposal.", "نعم، فترة الدعم ونموذج الصيانة جزء من مقترح كل مشروع.") },
    ],
    theme: "brand", surface: "paper",
  }),
  s("lead_form", "ثبت درخواست پروژه", {
    layout: "split",
    eyebrow: t("ثبت درخواست پروژه", "Request a project", "طلب مشروع"),
    title: t("دربارهٔ پروژه‌تان بگویید", "Tell us about your project", "حدّثنا عن مشروعك"),
    lead: t("پس از بررسی درخواست، برای جلسهٔ شناخت مسئله با شما تماس می‌گیریم.", "Once we’ve reviewed your request, we’ll get in touch to set up a discovery session.", "بعد مراجعة طلبك سنتواصل معك لترتيب جلسة لفهم المشكلة."),
    bullets: items(["بررسی نیاز و پیشنهاد دامنهٔ اولیه", "Needs review and an initial scope", "مراجعة الاحتياج واقتراح نطاق أولي"], ["پیشنهاد معماری و زمان‌بندی", "Proposed architecture and timeline", "اقتراح البنية والجدول الزمني"], ["شفافیت در هزینه پیش از شروع", "Clear costs before we start", "وضوح التكلفة قبل البدء"]),
    form: F("project"), context: "custom-software", theme: "custom", anchor: "request",
  }),
]);

/* ---------------- پروژه‌ها ---------------- */
export const projects = page("projects", "پروژه‌ها", "projects", ["پروژه‌ها و نمونه‌کارها", "Projects and case studies", "المشاريع والأعمال"], {
  fa: ["پروژه‌ها و نمونه‌کارها", "نمونه‌کارهای توسعهٔ نرم‌افزار؛ مسئلهٔ مشتری، راهکار ارائه‌شده و نتیجه."],
  en: ["Projects and case studies", "Software development case studies: the client’s problem, the solution we delivered and the outcome."],
  ar: ["المشاريع والأعمال", "أعمال تطوير البرمجيات: مشكلة العميل والحل المقدَّم والنتيجة."],
}, [
  s("page_header", "سربرگ", {
    title: t("پروژه‌ها و نمونه‌کارها", "Projects and case studies", "المشاريع والأعمال"),
    lead: t("هر پروژه را با ساختار «مسئله، راهکار، نتیجه» معرفی می‌کنیم و فقط اطلاعاتی را منتشر می‌کنیم که قابل‌استناد باشد و کارفرما انتشار آن را تأیید کرده باشد.", "We present each project as challenge, solution and outcome, and only publish information that is verifiable and approved by the client.", "نعرض كل مشروع وفق «التحدي والحل والنتيجة»، ولا ننشر إلا معلومات موثّقة وافق العميل على نشرها."),
    surface: "paper",
  }),
  s("projects_showcase", "فهرست پروژه‌ها", { mode: "full", ...NEXT_PROJECT() }),
  s("cta_banner", "دعوت پایانی", CTA(["پروژهٔ بعدی می‌تواند مال شما باشد", "Your project could be next", "قد يكون مشروعك هو التالي"], ["نیازتان را بنویسید تا مسیر اجرای آن را با هم بررسی کنیم.", "Tell us what you need and we’ll map out how to deliver it together.", "اكتب احتياجك لنبحث معاً مسار تنفيذه."])),
]);

/* ---------------- درباره ---------------- */
export const about = page("about", "درباره ما", "about", ["درباره ما", "About us", "من نحن"], {
  fa: ["درباره ما", "اِنو دیجیتال؛ شرکت توسعهٔ نرم‌افزار با دو حوزهٔ فعالیت: محصولات نرم‌افزاری آماده و توسعهٔ نرم‌افزار سفارشی."],
  en: ["About us", "ENODIGITAL is a software company working in two areas: ready-made software products and custom software development."],
  ar: ["من نحن", "إنو ديجيتال شركة تطوير برمجيات تعمل في مجالين: المنتجات البرمجية الجاهزة وتطوير البرمجيات المخصصة."],
}, [
  s("page_header", "سربرگ", {
    eyebrow: t("دربارهٔ اِنو دیجیتال", "About ENODIGITAL", "عن إنو ديجيتال"),
    title: t("نرم‌افزار می‌سازیم تا کار، ساده‌تر و قابل پیگیری‌تر شود.", "We build software that makes work simpler and easier to track.", "نصنع برمجيات تجعل العمل أبسط وأسهل في المتابعة."),
    lead: t("اِنو دیجیتال یک شرکت توسعهٔ نرم‌افزار است که در دو حوزه فعالیت می‌کند: ساخت و پشتیبانی محصولات نرم‌افزاری آماده، و طراحی و توسعهٔ نرم‌افزار سفارشی برای سازمان‌ها و کسب‌وکارها.", "ENODIGITAL is a software company working in two areas: building and supporting ready-made software products, and designing and developing custom software for organisations and businesses.", "إنو ديجيتال شركة تطوير برمجيات تعمل في مجالين: بناء المنتجات البرمجية الجاهزة ودعمها، وتصميم البرمجيات المخصصة وتطويرها للمؤسسات والأعمال."),
    surface: "dark",
  }),
  s("identity_card", "هویت ما", {
    image: M("logo-full"),
    eyebrow: t("هویت ما", "Our identity", "هويتنا"),
    title: t("مجموعه بازرگانی سامانه‌های پیشرو اقتصاد نوین دیجیتال", "Pioneering systems for the new digital economy", "منظومة أنظمة رائدة للاقتصاد الرقمي الجديد"),
    text: t("نشانهٔ اِنو دیجیتال از سه لایه ساخته شده است؛ لایه‌هایی که مثل محصولات و خدمات ما، هرکدام نقش خودشان را دارند و در کنار هم یک کل منسجم می‌سازند.", "The ENODIGITAL mark is built from three layers. Like our products and services, each has its own role, and together they form a coherent whole.", "يتكوّن شعار إنو ديجيتال من ثلاث طبقات؛ ولكلٍّ منها دورها مثل منتجاتنا وخدماتنا، وتشكّل معاً كلاً متماسكاً."),
  }),
  s("pillars", "حوزه‌های فعالیت", {
    items: [
      { icon: "layers", theme: "brand", title: t("محصولات نرم‌افزاری آماده", "Ready-made software products", "المنتجات البرمجية الجاهزة"), desc: t("سه محصول مستقل که هرکدام بازار هدف، مدل فروش و تیم خود را دارند.", "Three independent products, each with its own market, sales model and team.", "ثلاثة منتجات مستقلة لكلٍّ منها سوقه ونموذج بيعه وفريقه."), list_products: true },
      { icon: "code", theme: "custom", title: t("توسعهٔ نرم‌افزار سفارشی", "Custom software development", "تطوير البرمجيات المخصصة"), desc: t("برای سازمان‌هایی که نیاز خاصی دارند: تحلیل نیازمندی‌ها، طراحی، توسعه، پیاده‌سازی و پشتیبانی.", "For organisations with specific needs: requirements analysis, design, development, implementation and support.", "للمؤسسات ذات الاحتياجات الخاصة: تحليل المتطلبات والتصميم والتطوير والتنفيذ والدعم.") },
    ],
  }),
  s("feature_grid", "اصول کاری", {
    eyebrow: t("اصول کاری", "Principles", "مبادئ العمل"),
    title: t("چطور کار می‌کنیم", "How we work", "كيف نعمل"),
    items: APPROACH(), columns: "4", theme: "brand", surface: "paper",
  }),
  s("cta_banner", "دعوت پایانی", CTA()),
]);

/* ---------------- مقالات ---------------- */
export const blog = page("blog", "مقالات", "blog", ["مقالات", "Articles", "المقالات"], {
  fa: ["مقالات", "یادداشت‌هایی دربارهٔ CRM، فروش آنلاین، تجربهٔ مشتری، تحول دیجیتال و توسعهٔ نرم‌افزار."],
  en: ["Articles", "Notes on CRM, online sales, customer experience, digital transformation and software development."],
  ar: ["المقالات", "ملاحظات حول CRM والبيع الإلكتروني وتجربة العملاء والتحول الرقمي وتطوير البرمجيات."],
}, [
  s("page_header", "سربرگ", {
    title: t("مقالات و دانشنامه", "Articles", "المقالات"),
    lead: t("یادداشت‌هایی کوتاه و کاربردی دربارهٔ فروش، تجربهٔ مشتری، تحول دیجیتال و توسعهٔ نرم‌افزار.", "Short, practical notes on sales, customer experience, digital transformation and software development.", "ملاحظات قصيرة وعملية حول المبيعات وتجربة العملاء والتحول الرقمي وتطوير البرمجيات."),
    surface: "paper",
  }),
  s("blog_list", "فهرست مقالات", { empty_text: t("هنوز مقاله‌ای منتشر نشده است.", "No articles have been published yet.", "لم تُنشر أي مقالات بعد.") }),
]);

/* ---------------- تماس ---------------- */
export const contact = page("contact", "تماس", "contact", ["تماس و درخواست مشاوره", "Contact us", "اتصل بنا"], {
  fa: ["تماس و درخواست مشاوره", "برای دریافت دموی محصولات، مشاوره یا ثبت درخواست پروژهٔ نرم‌افزاری با ما در تماس باشید."],
  en: ["Contact us", "Get in touch for a product demo, a consultation or to request a software project."],
  ar: ["اتصل بنا", "تواصل معنا لطلب عرض تجريبي للمنتجات أو استشارة أو مشروع برمجي."],
}, [
  s("contact_panel", "صفحهٔ تماس", {
    title: t("بیایید گفتگو کنیم", "Let’s talk", "لنتحدث"),
    lead: t("دموی محصول، مشاوره برای انتخاب راهکار یا ثبت درخواست پروژهٔ سفارشی؛ پیام بگذارید تا با شما تماس بگیریم.", "A product demo, advice on choosing a solution, or a custom project request — leave a message and we’ll get back to you.", "عرض تجريبي لمنتج أو استشارة لاختيار الحل أو طلب مشروع مخصص؛ اترك رسالة وسنتواصل معك."),
    quick_title: t("یا مستقیم به صفحهٔ مرتبط بروید", "Or go straight to the right page", "أو انتقل مباشرة إلى الصفحة المناسبة"),
    quick_links: [
      { icon: "users", theme: "limoc", label: t("درخواست دموی لیموسی", "Request a Limoc demo", "اطلب عرضاً تجريبياً لليموسي"), subtitle: t("لیموسی", "Limoc", "ليموسي"), page: P("limoc"), anchor: "demo" },
      { icon: "utensils", theme: "limofood", label: t("درخواست مشاورهٔ راه‌اندازی", "Request a setup consultation", "اطلب استشارة الإطلاق"), subtitle: t("لیموفود", "LimoFood", "ليموفود"), page: P("limofood"), anchor: "demo" },
      { icon: "building", theme: "benefits", label: t("درخواست دمو برای سازمان", "Request a demo for your organisation", "اطلب عرضاً تجريبياً لمؤسستك"), subtitle: t("سامانهٔ رفاهیات", "Benefits Platform", "منصة المزايا"), page: P("benefits"), anchor: "demo" },
      { icon: "code", theme: "custom", label: t("ثبت درخواست پروژه", "Request a project", "اطلب مشروعاً"), subtitle: t("نرم‌افزار سفارشی", "Custom software", "برمجيات مخصصة"), page: P("custom-software"), anchor: "request" },
    ],
    form_title: t("فرم تماس", "Contact form", "نموذج التواصل"),
    form: F("contact"),
  }),
]);
