import { OTHER } from "./limoc";
import { F, M, items, page, s, t, ul } from "../helpers";
import { PRICING } from "./pricing";

const PRIMARY = t("درخواست دمو برای سازمان", "Request a demo for your organisation", "اطلب عرضاً تجريبياً لمؤسستك");

export const benefits = page("benefits", "سامانهٔ رفاهیات", "benefits", ["سامانهٔ رفاهیات", "Benefits Platform", "منصة المزايا"], {
  fa: ["سامانه بن الکترونیکی رفاهیات کارکنان", "سامانهٔ بن الکترونیکی رفاهیات: تخصیص اعتبار به کارکنان، خرید در فروشگاه‌های طرف قرارداد با کد تأیید، تسویه با فروشندگان و گزارش Excel."],
  en: ["Electronic employee-benefits voucher platform", "Allocate benefit credit to employees, let them buy at partner stores with a confirmation code, settle with merchants and export Excel reports."],
  ar: ["منصة القسائم الإلكترونية لمزايا الموظفين", "خصّص رصيد المزايا للموظفين، واشترِ من المتاجر المتعاقدة برمز تأكيد، وسوِّ الحسابات مع التجار، واستخرج تقارير Excel."],
}, [
  s("product_hero", "هیروی رفاهیات", {
    variant: "benefits",
    badge: t("سامانهٔ بن الکترونیکی رفاهیات کارکنان", "Electronic employee-benefits vouchers", "منصة القسائم الإلكترونية لمزايا الموظفين"),
    title: t("مدیریت هوشمند رفاهیات کارکنان", "Smarter employee benefits management", "إدارة ذكية لمزايا الموظفين"),
    lead: t("از تخصیص اعتبار تا مصرف و تسویه؛ سازمان بن صادر می‌کند، کارکنان در فروشگاه‌های طرف قرارداد خرید می‌کنند و طلب هر فروشنده شفاف تسویه می‌شود.", "From allocation to spending and settlement: the organisation issues vouchers, employees shop at partner stores, and every merchant is settled transparently.", "من تخصيص الرصيد إلى الاستهلاك والتسوية؛ تُصدر المؤسسة القسائم، ويشتري الموظفون من المتاجر المتعاقدة، وتُسوّى مستحقات كل تاجر بشفافية."),
    buttons: [{ label: PRIMARY, anchor: "demo", style: "primary" }, { label: t("مشاهدهٔ چرخهٔ کار", "See how it works", "شاهد دورة العمل"), anchor: "cycle", style: "ghost" }],
    image_main: M("refah-admin-dashboard"), image_main_title: t("پنل مدیریت سازمان · داشبورد", "Organisation admin · Dashboard", "لوحة إدارة المؤسسة · لوحة المعلومات"),
    image_secondary: M("refah-seller-purchase"),
    image_tertiary: M("refah-employee-voucher"),
  }),
  s("cycle_diagram", "چرخهٔ سامانه", {
    eyebrow: t("چرخهٔ سامانه", "The cycle", "دورة المنصة"),
    title: t("سازمان، کارمند و فروشگاه؛ در یک چرخهٔ شفاف", "Organisation, employee and store in one transparent cycle", "المؤسسة والموظف والمتجر في دورة شفافة"),
    lead: t("هر خرید یک تراکنش کامل است: کارمند، بن، فروشگاه، شعبه، مبلغ و زمان.", "Every purchase is a complete transaction: employee, voucher, store, branch, amount and time.", "كل عملية شراء معاملة كاملة: الموظف والقسيمة والمتجر والفرع والمبلغ والوقت."),
    nodes: [
      { icon: "building", title: t("سازمان", "Organisation", "المؤسسة"), desc: t("تعریف کارکنان و فروشگاه‌ها، صدور بن و تخصیص اعتبار", "Sets up employees and stores, issues vouchers and allocates credit", "تعريف الموظفين والمتاجر وإصدار القسائم وتخصيص الرصيد") },
      { icon: "user", title: t("کارمند", "Employee", "الموظف"), desc: t("دیدن مانده و فروشگاه‌ها، تأیید خرید با کد ۵ رقمی", "Sees their balance and stores, confirms purchases with a 5-digit code", "يطّلع على رصيده والمتاجر ويؤكد الشراء برمز من 5 أرقام") },
      { icon: "store", title: t("فروشگاه", "Store", "المتجر"), desc: t("شناسایی کارمند، ثبت مبلغ فاکتور، مشاهدهٔ طلب", "Identifies the employee, enters the invoice amount, sees what it’s owed", "يتعرّف على الموظف ويُدخل مبلغ الفاتورة ويرى مستحقاته") },
    ],
    flows: items(["صدور بن و اعتبار", "Vouchers and credit", "إصدار القسائم والرصيد"], ["خرید و تأیید با کد", "Purchase and code confirmation", "الشراء والتأكيد بالرمز"]),
    closing: t("طلب ← تسویه با رسید: سازمان طلب هر فروشنده را از تراکنش‌ها می‌بیند و پرداخت را با شمارهٔ پیگیری ثبت می‌کند.", "Receivable → settlement with receipt: the organisation sees each merchant’s balance from transactions and records payment with a reference number.", "المستحقات ← التسوية بإيصال: ترى المؤسسة مستحقات كل تاجر من المعاملات وتسجّل الدفع برقم مرجعي."),
    theme: "benefits", surface: "paper", anchor: "cycle",
  }),
  s("problem_list", "مسئله", {
    eyebrow: t("مسئله", "The problem", "المشكلة"),
    title: t("وقتی رفاهیات با کوپن کاغذی و جمع‌زنی دستی مدیریت می‌شود", "When benefits run on paper coupons and manual sums", "عندما تُدار المزايا بقسائم ورقية وحسابات يدوية"),
    points: items(
      ["مانده اعتبار هر نفر دستی یا با کوپن کاغذی ثبت می‌شود", "Each person’s balance is tracked by hand or on paper coupons", "يُسجَّل رصيد كل شخص يدوياً أو بقسائم ورقية"],
      ["تأیید خرید به امضا و شناسایی حضوری وابسته است", "Approving a purchase depends on signatures and in-person ID", "تأكيد الشراء يعتمد على التوقيع والتحقق الحضوري"],
      ["طلب فروشندگان با جمع‌زنی دستی فاکتورها محاسبه می‌شود", "Merchant receivables are worked out by adding up invoices by hand", "تُحسب مستحقات التجار بجمع الفواتير يدوياً"],
      ["حسابرسی به پرونده‌های کاغذی تکیه دارد", "Audits rely on paper files", "يعتمد التدقيق على الملفات الورقية"],
    ),
    conclusion: t("مدیریت هوشمند رفاهیات کارکنان؛ از تخصیص اعتبار تا مصرف و تسویه.", "Smarter employee benefits — from allocating credit to spending and settlement.", "إدارة ذكية لمزايا الموظفين؛ من تخصيص الرصيد إلى الاستهلاك والتسوية."),
    layout: "split", theme: "benefits", surface: "white",
  }),
  s("panels_showcase", "سه پنل", {
    eyebrow: t("سه پنل، یک سامانه", "Three panels, one platform", "ثلاث لوحات ومنصة واحدة"),
    title: t("هر نقش، پنل مخصوص خودش", "A dedicated panel for every role", "لوحة خاصة لكل دور"),
    lead: t("هر سه پنل از طریق API با یک بک‌اند مشترک کار می‌کنند و ارقام در همهٔ آن‌ها یکسان است.", "All three panels use the same back end through an API, so the numbers always match.", "تعمل اللوحات الثلاث مع خادم مشترك عبر API، فتتطابق الأرقام في جميعها."),
    panels: [
      { name: t("پنل مدیریت سازمان", "Organisation admin panel", "لوحة إدارة المؤسسة"), audience: t("مدیران، منابع انسانی و واحد مالی", "Managers, HR and finance", "المديرون والموارد البشرية والمالية"), image: M("refah-voucher-wizard"), device: "browser",
        items: ul(["مدیریت کارکنان (تکی و ورود از Excel)", "Employee management (one by one or Excel import)", "إدارة الموظفين (فردياً أو باستيراد Excel)"], ["فروشندگان، شعب و قراردادها", "Merchants, branches and contracts", "التجار والفروع والعقود"], ["صدور، تمدید و غیرفعال‌سازی بن", "Issue, extend and deactivate vouchers", "إصدار القسائم وتمديدها وإيقافها"], ["تراکنش‌ها، تسویه‌ها و ۲۸ گزارش", "Transactions, settlements and 28 reports", "المعاملات والتسويات و28 تقريراً"], ["مدیران، نقش‌ها و لاگ سیستم", "Admins, roles and system logs", "المديرون والأدوار وسجل النظام"]) },
      { name: t("پنل فروشندگان", "Merchant panel", "لوحة التجار"), audience: t("فروشگاه‌های طرف قرارداد", "Partner stores", "المتاجر المتعاقدة"), image: M("refah-seller-purchase"), device: "phone",
        items: ul(["شناسایی کارمند با QR، کد ملی یا شمارهٔ پرسنلی", "Identify employees by QR, national ID or staff number", "التعرف على الموظف عبر QR أو الرقم الوطني أو الرقم الوظيفي"], ["ثبت مبلغ فاکتور و درخواست خرید", "Enter the invoice amount and request the purchase", "إدخال مبلغ الفاتورة وطلب الشراء"], ["سفارش‌ها و مشتریان", "Orders and customers", "الطلبات والعملاء"], ["کیف پول: طلب، دریافت‌شده و مانده", "Wallet: owed, received and outstanding", "المحفظة: المستحق والمستلم والمتبقي"], ["تاریخچهٔ تسویه و رسیدها", "Settlement history and receipts", "سجل التسويات والإيصالات"]) },
      { name: t("پنل کارکنان", "Employee panel", "لوحة الموظفين"), audience: t("کارکنان مشمول", "Eligible employees", "الموظفون المستحقون"), image: M("refah-employee-voucher"), device: "phone",
        items: ul(["مشاهدهٔ اعتبار اولیه، مصرف‌شده و مانده", "See initial, spent and remaining credit", "عرض الرصيد الأولي والمستهلك والمتبقي"], ["فروشگاه‌های طرف قرارداد و تخفیف‌ها", "Partner stores and discounts", "المتاجر المتعاقدة والخصومات"], ["تأیید یا لغو درخواست خرید با کد", "Confirm or cancel purchases with a code", "تأكيد طلب الشراء أو إلغاؤه بالرمز"], ["تراکنش‌ها با جزئیات سهم بن و نقد", "Transactions split into voucher and cash", "المعاملات مع تفصيل حصة القسيمة والنقد"], ["حالت روشن و تیره", "Light and dark mode", "الوضع الفاتح والداكن"]) },
    ],
    theme: "benefits",
  }),
  s("feature_grid", "قابلیت‌ها", {
    eyebrow: t("امکانات کلیدی", "Key features", "الإمكانات الرئيسية"),
    title: t("قابلیت‌های پیاده‌سازی‌شده", "What’s already built", "الإمكانات المنفّذة"),
    items: [
      { icon: "layers", title: t("صدور بن با ویزارد پنج‌مرحله‌ای", "Five-step voucher wizard", "إصدار القسائم بمعالج من خمس خطوات"), desc: t("مشخصات، مشمولین، فروشندگان و شعب، تخفیف‌ها و اطلاع‌رسانی؛ با بازبینی پیش از صدور.", "Details, eligible staff, merchants and branches, discounts and notifications — with a review before issuing.", "البيانات والمستحقون والتجار والفروع والخصومات والإشعارات؛ مع مراجعة قبل الإصدار.") },
      { icon: "users", title: t("اعتبار مستقل برای هر کارمند", "Individual credit per employee", "رصيد مستقل لكل موظف"), desc: t("مبلغ یکسان، ورود از Excel، یا محاسبه بر اساس وضعیت تأهل و تعداد فرزندان.", "A flat amount, Excel import, or calculated from marital status and number of children.", "مبلغ موحّد أو استيراد من Excel أو حساب حسب الحالة الاجتماعية وعدد الأبناء.") },
      { icon: "qr", title: t("شناسایی کارمند در فروشگاه", "Employee identification in store", "التعرف على الموظف في المتجر"), desc: t("با QR دو دقیقه‌ای از پنل کارمند، کد ملی یا شمارهٔ پرسنلی.", "With a two-minute QR from the employee panel, national ID or staff number.", "عبر رمز QR صالح لدقيقتين من لوحة الموظف أو الرقم الوطني أو الرقم الوظيفي.") },
      { icon: "lock", title: t("کد تأیید خرید", "Purchase confirmation code", "رمز تأكيد الشراء"), desc: t("خرید فقط با کد ۵ رقمی ثبت می‌شود که کارمند در پنل خود می‌بیند؛ با امکان لغو.", "Purchases go through only with a 5-digit code shown in the employee’s panel, and can be cancelled.", "لا يُسجَّل الشراء إلا برمز من 5 أرقام يظهر في لوحة الموظف، مع إمكانية الإلغاء.") },
      { icon: "percent", title: t("تخفیف اختصاصی فروشندگان", "Merchant-specific discounts", "خصومات خاصة بالتجار"), desc: t("درصد تخفیف برای هر فروشگاه و در صورت نیاز هر شعبه؛ محاسبه سمت سرور.", "A discount rate per store, and per branch if needed — calculated on the server.", "نسبة خصم لكل متجر، ولكل فرع عند الحاجة؛ تُحسب على الخادم.") },
      { icon: "wallet", title: t("مدیریت تسویه", "Settlement management", "إدارة التسويات"), desc: t("طلب، پرداخت‌شده و ماندهٔ هر فروشنده؛ ثبت پرداخت با شمارهٔ پیگیری و رسید.", "Each merchant’s owed, paid and outstanding amounts; payments recorded with reference number and receipt.", "مستحقات كل تاجر والمدفوع والمتبقي؛ مع تسجيل الدفع برقم مرجعي وإيصال.") },
      { icon: "sheet", title: t("۲۸ گزارش با خروجی Excel", "28 reports with Excel export", "28 تقريراً بتصدير Excel"), desc: t("مرکز گزارش با فیلتر و انتخاب ستون، حتی برای داده‌های حجیم.", "A reporting centre with filters and column selection, even for large datasets.", "مركز تقارير بفلاتر واختيار للأعمدة، حتى للبيانات الكبيرة.") },
      { icon: "bell", title: t("اطلاع‌رسانی", "Notifications", "الإشعارات"), desc: t("اعلان داخل پنل و سناریوهای پیامک برای صدور بن، تراکنش و تسویه.", "In-app notifications and SMS scenarios for vouchers, transactions and settlements.", "إشعارات داخل اللوحة وسيناريوهات رسائل قصيرة للقسائم والمعاملات والتسويات.") },
      { icon: "shield", title: t("لاگ حسابرسی و مجوزها", "Audit log and permissions", "سجل التدقيق والصلاحيات"), desc: t("ثبت فعالیت‌ها با کاربر، زمان، IP و دستگاه؛ دسترسی مدیران در ۱۹ ماژول.", "Activity logged with user, time, IP and device; admin permissions across 19 modules.", "تسجيل الأنشطة بالمستخدم والوقت وعنوان IP والجهاز؛ وصلاحيات المديرين في 19 وحدة.") },
    ],
    columns: "3", theme: "benefits", surface: "dark",
  }),
  s("steps_row", "از صدور تا تسویه", {
    eyebrow: t("نحوهٔ کار", "How it works", "كيف يعمل"),
    title: t("از صدور بن تا تسویه", "From issuing vouchers to settlement", "من إصدار القسيمة إلى التسوية"),
    steps: [
      { title: t("تعریف کارکنان و فروشندگان", "Set up employees and merchants", "تعريف الموظفين والتجار"), desc: t("کارکنان (تکی یا از Excel)، فروشگاه‌ها، شعب و قراردادها ثبت می‌شوند.", "Employees (individually or from Excel), stores, branches and contracts are added.", "يُسجَّل الموظفون (فردياً أو من Excel) والمتاجر والفروع والعقود.") },
      { title: t("صدور بن", "Issue vouchers", "إصدار القسائم"), desc: t("مشمولین، اعتبار هر نفر، فروشندگان مجاز و تخفیف‌ها تعیین می‌شود.", "Choose eligible staff, credit per person, approved merchants and discounts.", "يُحدَّد المستحقون ورصيد كل شخص والتجار المعتمدون والخصومات.") },
      { title: t("شناسایی و ثبت خرید", "Identify and record the purchase", "التعرف وتسجيل الشراء"), desc: t("فروشنده کارمند را شناسایی و مبلغ فاکتور را وارد می‌کند.", "The merchant identifies the employee and enters the invoice amount.", "يتعرّف التاجر على الموظف ويُدخل مبلغ الفاتورة.") },
      { title: t("تأیید کارمند", "Employee confirms", "تأكيد الموظف"), desc: t("کارمند با کد ۵ رقمی خرید را تأیید می‌کند و مانده کم می‌شود.", "The employee confirms with a 5-digit code and the balance is reduced.", "يؤكد الموظف الشراء برمز من 5 أرقام ويُخصم من الرصيد.") },
      { title: t("تسویه و گزارش", "Settle and report", "التسوية والتقارير"), desc: t("مدیر پرداخت به فروشنده را با رسید ثبت و گزارش‌ها را دریافت می‌کند.", "The admin records the merchant payment with a receipt and pulls reports.", "يسجّل المدير الدفع للتاجر بإيصال ويستخرج التقارير.") },
    ],
    style: "cards", theme: "benefits", surface: "paper",
  }),
  s("media_split", "تسویه با فروشندگان", {
    eyebrow: t("تسویه با فروشندگان", "Merchant settlement", "التسوية مع التجار"),
    title: t("طلب هر فروشنده، مستقیم از تراکنش‌ها", "Every merchant’s balance, straight from transactions", "مستحقات كل تاجر مباشرة من المعاملات"),
    lead: t("مدیر پرداخت به فروشنده را با تاریخ، شمارهٔ پیگیری و رسید ثبت می‌کند؛ پرداخت جزئی یا کامل. فروشنده همان ارقام را در کیف پول خود می‌بیند.", "The admin records each payment with date, reference number and receipt — partial or full. The merchant sees the same figures in their wallet.", "يسجّل المدير الدفع للتاجر بالتاريخ والرقم المرجعي والإيصال؛ دفعاً جزئياً أو كاملاً. ويرى التاجر الأرقام نفسها في محفظته."),
    note: t("پرداخت به فروشندگان توسط سازمان انجام می‌شود و سامانه آن را ثبت و پیگیری می‌کند؛ پرداخت خودکار بانکی بخشی از سامانه نیست.", "Payments to merchants are made by the organisation; the platform records and tracks them. Automatic bank transfers are not part of the platform.", "تُجري المؤسسة الدفع للتجار، وتتولى المنصة تسجيله ومتابعته؛ التحويل المصرفي التلقائي ليس جزءاً من المنصة."),
    image: M("refah-seller-wallet"), frame: "phone", image_side: "end", theme: "benefits", surface: "white",
  }),
  s("audience", "مخاطبان", {
    eyebrow: t("کاربران و صنایع هدف", "Who it’s for", "لمن صُمّمت"),
    title: t("برای سازمان، کارکنان و فروشگاه‌ها", "For organisations, employees and stores", "للمؤسسات والموظفين والمتاجر"),
    items: [
      { icon: "building", title: t("سازمان‌ها و شرکت‌ها", "Organisations and companies", "المؤسسات والشركات"), desc: t("تخصیص و کنترل بودجهٔ رفاهی کارکنان", "Allocate and control the employee-benefits budget", "تخصيص ميزانية مزايا الموظفين ومراقبتها") },
      { icon: "users", title: t("کارکنان", "Employees", "الموظفون"), desc: t("مشاهدهٔ مانده و خرید از فروشگاه‌های طرف قرارداد", "Check their balance and shop at partner stores", "الاطلاع على الرصيد والشراء من المتاجر المتعاقدة") },
      { icon: "store", title: t("فروشگاه‌های طرف قرارداد", "Partner stores", "المتاجر المتعاقدة"), desc: t("ثبت خرید با بن و پیگیری مطالبات", "Record voucher purchases and track receivables", "تسجيل المشتريات بالقسائم ومتابعة المستحقات") },
    ],
    theme: "benefits", surface: "white",
  }),
  s("faq", "سؤالات متداول", {
    eyebrow: t("سؤالات متداول", "FAQ", "الأسئلة الشائعة"),
    title: t("پرسش‌های رایج دربارهٔ سامانهٔ رفاهیات", "Common questions about the platform", "أسئلة شائعة عن منصة المزايا"),
    items: [
      { q: t("کارکنان چطور وارد سامانه می‌شوند؟", "How do employees sign in?", "كيف يدخل الموظفون إلى المنصة؟"), a: t("با کد ملی و شمارهٔ همراه. حساب کارکنان را مدیر تعریف می‌کند یا از فایل Excel به‌صورت گروهی وارد می‌کند.", "With their national ID and mobile number. Admins create employee accounts or import them in bulk from Excel.", "بالرقم الوطني ورقم الجوال. ينشئ المدير حسابات الموظفين أو يستوردها جماعياً من ملف Excel.") },
      { q: t("اگر مانده بن کمتر از مبلغ خرید باشد چه می‌شود؟", "What if the balance is less than the purchase?", "ماذا لو كان الرصيد أقل من مبلغ الشراء؟"), a: t("سامانه سهم بن و سهم نقدی را جدا محاسبه می‌کند؛ مانده بن مصرف و باقی مبلغ نقدی پرداخت می‌شود.", "The platform splits the voucher and cash portions: the remaining balance is used and the rest is paid in cash.", "تحسب المنصة حصة القسيمة وحصة النقد بشكل منفصل؛ يُستهلك الرصيد المتبقي ويُدفع الباقي نقداً.") },
      { q: t("آیا شناسایی با کارت NFC ممکن است؟", "Can employees be identified by NFC card?", "هل يمكن التعرف ببطاقة NFC؟"), a: t("سامانه برای خواندن کارت NFC در مرورگرهای سازگار (Chrome اندروید) و یک برنامهٔ همراه iOS آماده شده است. این قابلیت پیش از استقرار روی دستگاه‌های سازمان شما آزموده می‌شود.", "The platform is prepared to read NFC cards in compatible browsers (Chrome on Android) and through an iOS companion app. This is tested on your organisation’s devices before rollout.", "المنصة مهيأة لقراءة بطاقات NFC في المتصفحات المتوافقة (Chrome على أندرويد) وعبر تطبيق مرافق على iOS. وتُختبر هذه الميزة على أجهزة مؤسستك قبل النشر.") },
      { q: t("تسویه با فروشندگان چطور انجام می‌شود؟", "How are merchants settled?", "كيف تتم التسوية مع التجار؟"), a: t("طلب هر فروشنده از تراکنش‌ها محاسبه می‌شود. پرداخت توسط سازمان انجام و در سامانه با تاریخ، شمارهٔ پیگیری و رسید ثبت می‌شود؛ فروشنده آن را در پنل خود می‌بیند.", "Each merchant’s balance is calculated from transactions. The organisation makes the payment and records it with date, reference number and receipt; the merchant sees it in their panel.", "تُحسب مستحقات كل تاجر من المعاملات. تُجري المؤسسة الدفع وتسجّله في المنصة بالتاريخ والرقم المرجعي والإيصال، ويراه التاجر في لوحته.") },
      { q: t("بعد از پایان مهلت بن چه می‌شود؟", "What happens when a voucher expires?", "ماذا يحدث بعد انتهاء صلاحية القسيمة؟"), a: t("وضعیت بن‌ها روزانه به‌روز می‌شود و پیش از انقضا یادآوری ارسال می‌شود. مدیر می‌تواند بن را تمدید یا غیرفعال کند.", "Voucher statuses update daily and reminders go out before expiry. Admins can extend or deactivate a voucher.", "تُحدَّث حالة القسائم يومياً ويُرسل تذكير قبل الانتهاء. ويمكن للمدير تمديد القسيمة أو إيقافها.") },
    ],
    theme: "benefits", surface: "white",
  }),
  PRICING("benefits", "benefits", "paper"),
  s("lead_form", "درخواست دمو", {
    layout: "banner", badge: t("سامانهٔ رفاهیات", "Benefits Platform", "منصة المزايا"),
    title: t("رفاهیات سازمانتان را دیجیتال کنید", "Take your organisation’s benefits digital", "حوّل مزايا مؤسستك إلى نظام رقمي"),
    lead: t("در جلسهٔ دمو، سه پنل سامانه را با سناریوی سازمان شما مرور می‌کنیم: روش تعیین مبلغ، فروشگاه‌های طرف قرارداد و فرایند تسویه.", "In the demo we’ll walk through all three panels using your organisation’s scenario: how amounts are set, partner stores and the settlement process.", "في العرض التجريبي نستعرض اللوحات الثلاث وفق سيناريو مؤسستك: طريقة تحديد المبلغ والمتاجر المتعاقدة وإجراء التسوية."),
    form: F("demo"), submit_label: PRIMARY, context: "benefits",
    theme: "benefits", banner_surface: "dark", anchor: "demo",
  }),
  s("other_products", "سایر محصولات", OTHER()),
]);
