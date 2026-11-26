import type { BlogCategory, BlogPost } from "@/cms/types";

const ul = (items: string[]) => `<ul>${items.map((x) => `<li>${x}</li>`).join("")}</ul>`;

export const categories: BlogCategory[] = [
  { key: "crm-sales", translations: { fa: { name: "CRM و فروش", slug: "crm-sales" }, en: { name: "CRM & sales", slug: "crm-sales" }, ar: { name: "CRM والمبيعات", slug: "crm-sales" } } },
  { key: "online-sales", translations: { fa: { name: "فروش آنلاین", slug: "online-sales" }, en: { name: "Online sales", slug: "online-sales" }, ar: { name: "البيع الإلكتروني", slug: "online-sales" } } },
  { key: "digital-transformation", translations: { fa: { name: "تحول دیجیتال", slug: "digital-transformation" }, en: { name: "Digital transformation", slug: "digital-transformation" }, ar: { name: "التحول الرقمي", slug: "digital-transformation" } } },
];

export const posts: BlogPost[] = [
  {
    slug: "crm-for-service-teams",
    status: "published",
    published_at: "2026-10-12T09:00:00",
    categories: ["crm-sales"],
    translations: {
      fa: {
        title: "چرا تیم‌های خدماتی به CRM نیاز دارند، حتی وقتی کوچک‌اند",
        excerpt: "اکسل و پیام‌رسان تا جایی جواب می‌دهند؛ از جایی به بعد، هزینهٔ پیگیری‌های فراموش‌شده از هزینهٔ نرم‌افزار بیشتر می‌شود.",
        content:
          "<p>بسیاری از تیم‌های خدماتی کار را با یک فایل اکسل و چند گروه در پیام‌رسان شروع می‌کنند. این روش در ماه‌های اول کافی است، اما با بیشتر شدن مشتری‌ها، اطلاعات در ذهن افراد و گفت‌وگوهای پراکنده گم می‌شود.</p>" +
          "<h2>نشانه‌هایی که می‌گویند وقتش رسیده</h2>" +
          ul(["پیگیری یک مشتری بالقوه فراموش شده و او سراغ رقیب رفته است", "برای دانستن وضعیت یک پروژه باید از چند نفر بپرسید", "پیش‌فاکتور و قرارداد هر مشتری در جای متفاوتی است", "درخواست‌های پشتیبانی اولویت و زمان پاسخ مشخص ندارند"]) +
          "<h2>CRM دقیقاً چه چیزی را حل می‌کند؟</h2>" +
          "<p>CRM یک پروندهٔ واحد برای هر مشتری می‌سازد: اطلاعات تماس، تاریخچهٔ گفت‌وگوها، فرصت‌های فروش، اسناد مالی و درخواست‌های پشتیبانی. ارزش اصلی آن در «حافظهٔ مشترک» تیم است؛ هر کس پرونده را باز کند، همان تصویری را می‌بیند که بقیه می‌بینند.</p>" +
          "<h2>از کجا شروع کنیم؟</h2>" +
          "<p>لازم نیست همهٔ فرایندها را یک‌باره منتقل کنید. با ثبت مشتریان و پیگیری‌ها شروع کنید، سپس قیف فروش را تعریف کنید و در مرحلهٔ بعد پیش‌فاکتور، پروژه و پشتیبانی را اضافه کنید.</p>",
      },
      en: {
        title: "Why service teams need a CRM — even when they’re small",
        excerpt: "Spreadsheets and chat apps work up to a point. Beyond it, forgotten follow-ups cost more than the software would.",
        content:
          "<p>Many service teams start out with a spreadsheet and a few chat groups. That works for the first few months, but as the customer list grows, information ends up scattered across people’s heads and old conversations.</p>" +
          "<h2>Signs it’s time</h2>" +
          ul(["A follow-up with a prospect slipped and they went to a competitor", "You have to ask several people to find out where a project stands", "Each customer’s quotes and contracts live in a different place", "Support requests have no clear priority or response time"]) +
          "<h2>What exactly does a CRM fix?</h2>" +
          "<p>A CRM gives every customer a single record: contact details, conversation history, sales opportunities, financial documents and support requests. Its real value is the team’s shared memory — whoever opens the record sees the same picture as everyone else.</p>" +
          "<h2>Where to start</h2>" +
          "<p>You don’t have to move every process at once. Start by recording customers and follow-ups, then define your sales pipeline, and after that add quotes, projects and support.</p>",
      },
      ar: {
        title: "لماذا تحتاج فرق الخدمات إلى نظام CRM حتى وهي صغيرة",
        excerpt: "جداول البيانات وتطبيقات المراسلة تفي بالغرض إلى حدٍّ ما؛ بعده تصبح كلفة المتابعات المنسية أعلى من كلفة البرنامج.",
        content:
          "<p>تبدأ فرق خدمات كثيرة عملها بملف Excel وبضع مجموعات على تطبيقات المراسلة. ينجح ذلك في الأشهر الأولى، لكن مع ازدياد العملاء تضيع المعلومات بين ذاكرة الأفراد والمحادثات المتفرقة.</p>" +
          "<h2>علامات تقول إن الوقت قد حان</h2>" +
          ul(["نُسيت متابعة عميل محتمل فذهب إلى منافس", "لمعرفة حالة مشروع عليك أن تسأل عدة أشخاص", "عروض الأسعار والعقود لكل عميل في مكان مختلف", "طلبات الدعم بلا أولوية أو زمن استجابة محدد"]) +
          "<h2>ما الذي يحلّه CRM تحديداً؟</h2>" +
          "<p>ينشئ CRM ملفاً واحداً لكل عميل: بيانات الاتصال وسجل المحادثات وفرص البيع والمستندات المالية وطلبات الدعم. وقيمته الحقيقية هي «الذاكرة المشتركة» للفريق؛ فمن يفتح الملف يرى الصورة نفسها التي يراها الآخرون.</p>" +
          "<h2>من أين نبدأ؟</h2>" +
          "<p>لا داعي لنقل كل الإجراءات دفعة واحدة. ابدأ بتسجيل العملاء والمتابعات، ثم عرّف مسار المبيعات، وبعدها أضف عروض الأسعار والمشاريع والدعم.</p>",
      },
    },
  },
  {
    slug: "direct-online-ordering-for-restaurants",
    status: "published",
    published_at: "2026-10-26T09:00:00",
    categories: ["online-sales"],
    translations: {
      fa: {
        title: "فروش آنلاین مستقیم برای رستوران‌ها: چه چیزی را باید کنترل کنید؟",
        excerpt: "پلتفرم‌های واسطه دیده شدن می‌آورند، اما کانال فروش اختصاصی ارتباط با مشتری و حاشیهٔ سود را به شما برمی‌گرداند.",
        content:
          "<p>برای بسیاری از رستوران‌ها و کافه‌ها، فروش آنلاین یعنی حضور در یک یا چند پلتفرم سفارش غذا. این حضور مفید است، اما همهٔ فروش آنلاین نباید به آن وابسته باشد.</p>" +
          "<h2>سه چیزی که در کانال اختصاصی به دست می‌آورید</h2>" +
          ul(["ارتباط مستقیم با مشتری و امکان دعوت دوباره از او", "کنترل تخفیف‌ها، منو و تجربهٔ سفارش", "گزارش دقیق فروش بدون کارمزد واسطه برای هر سفارش"]) +
          "<h2>سفارش‌گیری خوب چه ویژگی‌هایی دارد؟</h2>" +
          "<p>منوی موبایلی سریع و خوانا، پرداخت آنلاین بی‌دردسر، اطلاع‌رسانی وضعیت سفارش و مدیریت پیک. مشتری باید در کمتر از چند دقیقه از دیدن منو به ثبت سفارش برسد.</p>" +
          "<h2>چطور مشتری را به کانال خودتان بیاورید؟</h2>" +
          "<p>لینک منوی آنلاین را روی بسته‌بندی، رسید و صفحه‌های اجتماعی قرار دهید و برای اولین سفارش مستقیم، کد تخفیف در نظر بگیرید.</p>",
      },
      en: {
        title: "Direct online ordering for restaurants: what should you control?",
        excerpt: "Marketplaces bring visibility, but your own sales channel gives you back the customer relationship and your margin.",
        content:
          "<p>For many restaurants and cafés, selling online means being listed on one or more food-delivery marketplaces. That presence is useful, but your whole online business shouldn’t depend on it.</p>" +
          "<h2>Three things you gain with your own channel</h2>" +
          ul(["A direct relationship with customers and the ability to invite them back", "Control over discounts, the menu and the ordering experience", "Accurate sales reports, with no intermediary commission on each order"]) +
          "<h2>What makes ordering work well?</h2>" +
          "<p>A fast, readable mobile menu, painless online payment, order-status updates and courier management. Customers should get from seeing the menu to placing an order in just a few minutes.</p>" +
          "<h2>How do you bring customers to your own channel?</h2>" +
          "<p>Put your online menu link on packaging, receipts and social profiles, and offer a discount code on the first direct order.</p>",
      },
      ar: {
        title: "البيع الإلكتروني المباشر للمطاعم: ما الذي يجب أن تتحكم فيه؟",
        excerpt: "المنصات الوسيطة تمنحك الظهور، لكن قناة البيع الخاصة بك تعيد إليك العلاقة مع العميل وهامش الربح.",
        content:
          "<p>بالنسبة لكثير من المطاعم والمقاهي، يعني البيع الإلكتروني الظهور على منصة أو أكثر لطلب الطعام. هذا الظهور مفيد، لكن لا ينبغي أن يعتمد كل البيع الإلكتروني عليه.</p>" +
          "<h2>ثلاثة أشياء تكسبها من قناتك الخاصة</h2>" +
          ul(["علاقة مباشرة مع العميل وإمكانية دعوته مجدداً", "التحكم في الخصومات والقائمة وتجربة الطلب", "تقارير مبيعات دقيقة دون عمولة وسيط على كل طلب"]) +
          "<h2>ما مواصفات نظام الطلب الجيد؟</h2>" +
          "<p>قائمة سريعة وواضحة على الجوال، ودفع إلكتروني سلس، وإشعارات بحالة الطلب، وإدارة للتوصيل. يجب أن ينتقل العميل من رؤية القائمة إلى تسجيل الطلب في دقائق قليلة.</p>" +
          "<h2>كيف تجلب العملاء إلى قناتك؟</h2>" +
          "<p>ضع رابط القائمة الإلكترونية على العبوات والإيصالات وصفحات التواصل الاجتماعي، وخصّص رمز خصم لأول طلب مباشر.</p>",
      },
    },
  },
  {
    slug: "digital-employee-benefits",
    status: "published",
    published_at: "2026-11-09T09:00:00",
    categories: ["digital-transformation"],
    translations: {
      fa: {
        title: "دیجیتال‌سازی رفاهیات کارکنان؛ از کوپن کاغذی تا تسویهٔ شفاف",
        excerpt: "وقتی هر خرید ثبت و تأیید می‌شود، واحد مالی به‌جای جمع‌زنی فاکتورها، گزارش آماده تحویل می‌گیرد.",
        content:
          "<p>بن و کوپن رفاهی یکی از رایج‌ترین مزایای کارکنان است. در روش کاغذی، ثبت مانده، تأیید خرید و محاسبهٔ طلب فروشگاه‌ها همه دستی انجام می‌شود و پاسخ‌گویی را دشوار می‌کند.</p>" +
          "<h2>چهار گره اصلی روش کاغذی</h2>" +
          ul(["مانده اعتبار هر نفر به‌روز و قابل اتکا نیست", "تأیید خرید به امضا و شناسایی حضوری وابسته است", "طلب فروشندگان با جمع‌زنی دستی فاکتورها محاسبه می‌شود", "سابقهٔ حسابرسی در پرونده‌های کاغذی پراکنده است"]) +
          "<h2>یک چرخهٔ دیجیتال چطور کار می‌کند؟</h2>" +
          "<p>سازمان بن را برای مشمولین صادر می‌کند. فروشنده کارمند را شناسایی و مبلغ را وارد می‌کند و کارمند با کد تأیید، خرید را می‌پذیرد. هر خرید یک تراکنش کامل است و طلب فروشنده و ماندهٔ کارمند خودکار به‌روز می‌شود.</p>" +
          "<h2>برای شروع چه چیزی لازم است؟</h2>" +
          "<p>فهرست کارکنان مشمول، فهرست فروشگاه‌ها و شعب طرف قرارداد، و قاعدهٔ تعیین مبلغ. بقیهٔ فرایند در سامانه تعریف می‌شود.</p>",
      },
      en: {
        title: "Digitising employee benefits: from paper coupons to transparent settlement",
        excerpt: "When every purchase is recorded and confirmed, finance receives ready-made reports instead of tallying invoices.",
        content:
          "<p>Benefit vouchers and coupons are among the most common employee perks. On paper, tracking balances, approving purchases and working out what each merchant is owed are all manual — which makes accountability hard.</p>" +
          "<h2>The four main pain points of paper</h2>" +
          ul(["Nobody’s balance is up to date or reliable", "Approving a purchase depends on signatures and in-person identification", "Merchant receivables are calculated by adding up invoices by hand", "The audit trail is scattered across paper files"]) +
          "<h2>How does a digital cycle work?</h2>" +
          "<p>The organisation issues vouchers to eligible staff. The merchant identifies the employee and enters the amount, and the employee accepts the purchase with a confirmation code. Every purchase is a complete transaction, and the merchant’s receivable and the employee’s balance update automatically.</p>" +
          "<h2>What do you need to get started?</h2>" +
          "<p>A list of eligible employees, a list of partner stores and branches, and the rule for setting amounts. The rest of the process is configured in the platform.</p>",
      },
      ar: {
        title: "رقمنة مزايا الموظفين: من القسائم الورقية إلى تسوية شفافة",
        excerpt: "عندما تُسجَّل كل عملية شراء وتُؤكَّد، تستلم الإدارة المالية تقارير جاهزة بدلاً من جمع الفواتير.",
        content:
          "<p>تُعد القسائم والكوبونات من أكثر مزايا الموظفين شيوعاً. في الطريقة الورقية، يتم تسجيل الرصيد وتأكيد الشراء وحساب مستحقات المتاجر يدوياً، ما يصعّب المساءلة.</p>" +
          "<h2>أربع عقد رئيسية في الطريقة الورقية</h2>" +
          ul(["رصيد كل شخص غير محدّث ولا يمكن الاعتماد عليه", "تأكيد الشراء يعتمد على التوقيع والتحقق الحضوري", "تُحسب مستحقات التجار بجمع الفواتير يدوياً", "سجل التدقيق مبعثر في ملفات ورقية"]) +
          "<h2>كيف تعمل الدورة الرقمية؟</h2>" +
          "<p>تُصدر المؤسسة القسائم للمستحقين. يتعرّف التاجر على الموظف ويُدخل المبلغ، ويؤكد الموظف الشراء برمز التأكيد. كل عملية شراء معاملة كاملة، وتُحدَّث مستحقات التاجر ورصيد الموظف تلقائياً.</p>" +
          "<h2>ما المطلوب للبدء؟</h2>" +
          "<p>قائمة بالموظفين المستحقين، وقائمة بالمتاجر والفروع المتعاقدة، وقاعدة تحديد المبلغ. أما بقية الإجراءات فتُعرَّف داخل المنصة.</p>",
      },
    },
  },
];
