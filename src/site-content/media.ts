import type { MediaItem } from "@/cms/types";
import { t } from "@/cms/fields";

/** فایل‌ها در public/media هستند و همین پوشه در بسته به media/ تبدیل می‌شود */
export const media: MediaItem[] = [
  { ref: "logo-mark", file: "media/logo-mark.png", alt: t("نشانهٔ اِنو دیجیتال", "ENODIGITAL mark", "شعار إنو ديجيتال") },
  { ref: "logo-mark-white", file: "media/logo-mark-white.png", alt: t("نشانهٔ اِنو دیجیتال", "ENODIGITAL mark", "شعار إنو ديجيتال") },
  { ref: "logo-wordmark", file: "media/logo-wordmark.webp", alt: t("ENODIGITAL", "ENODIGITAL", "ENODIGITAL") },
  { ref: "logo-wordmark-white", file: "media/logo-wordmark-white.webp", alt: t("ENODIGITAL", "ENODIGITAL", "ENODIGITAL") },
  { ref: "logo-full", file: "media/logo-full.webp", alt: t("لوگوی اِنو دیجیتال؛ مجموعه بازرگانی سامانه‌های پیشرو اقتصاد نوین دیجیتال", "ENODIGITAL logo", "شعار إنو ديجيتال") },
  { ref: "og-cover", file: "media/og-cover.png", alt: t("اِنو دیجیتال", "ENODIGITAL", "إنو ديجيتال") },

  { ref: "limoc-kanban", file: "media/limoc-kanban.webp", alt: t(
    "نمای Kanban فروش در لیموسی: معاملات در مراحل مذاکره، پیشنهاد ارسال‌شده، برنده و ازدست‌رفته",
    "Limoc sales Kanban: deals across negotiation, proposal sent, won and lost",
    "لوحة Kanban للمبيعات في ليموسي: الصفقات في مراحل التفاوض وإرسال العرض والفوز والخسارة") },
  { ref: "limoc-quote", file: "media/limoc-quote.webp", alt: t(
    "صدور پیش‌فاکتور در لیموسی: اقلام از کاتالوگ، تخفیف، مالیات، جمع‌بندی مالی و ارسال به مشتری",
    "Creating a quote in Limoc: catalogue items, discount, tax, totals and sending to the customer",
    "إصدار عرض سعر في ليموسي: بنود من الكتالوج وخصم وضريبة وإجمالي وإرسال إلى العميل") },
  { ref: "limoc-ticket", file: "media/limoc-ticket.webp", alt: t(
    "تیکت پشتیبانی در لیموسی: مکاتبات، تغییر وضعیت، مسئول تیکت، مهلت پاسخ و تاریخچهٔ وضعیت",
    "A Limoc support ticket: conversation, status, assignee, response deadline and status history",
    "تذكرة دعم في ليموسي: المراسلات والحالة والمسؤول ومهلة الرد وسجل الحالات") },
  { ref: "limoc-portal", file: "media/limoc-portal.webp", alt: t(
    "پرتال مشتریان لیموسی: تیکت‌های باز، فاکتورها، ماندهٔ قابل پرداخت و وضعیت پشتیبانی",
    "Limoc customer portal: open tickets, invoices, balance due and support status",
    "بوابة عملاء ليموسي: التذاكر المفتوحة والفواتير والرصيد المستحق وحالة الدعم") },
  { ref: "limoc-project", file: "media/limoc-project.webp", alt: t(
    "ویرایش پروژه در لیموسی: شرکت طرف قرارداد، قرارداد، مدیر پروژه و مبنای پورسانت",
    "Editing a project in Limoc: client company, contract, project manager and commission basis",
    "تحرير مشروع في ليموسي: الشركة المتعاقدة والعقد ومدير المشروع وأساس العمولة") },
  { ref: "limofood-store", file: "media/limofood-store.webp", alt: t(
    "صفحهٔ فروشگاه در لیموفود: بنر فروشگاه، اطلاعات، منوی فروشگاه و دسته‌بندی محصولات",
    "A LimoFood store page: banner, store details, menu and product categories",
    "صفحة متجر في ليموفود: اللافتة ومعلومات المتجر والقائمة وتصنيفات المنتجات") },
  { ref: "limofood-menu", file: "media/limofood-menu.webp", alt: t(
    "منوی آنلاین فروشگاه در لیموفود: دسته‌بندی محصولات، قیمت‌ها و افزودن به سبد",
    "LimoFood online menu: product categories, prices and add to cart",
    "قائمة ليموفود الإلكترونية: تصنيفات المنتجات والأسعار والإضافة إلى السلة") },
  { ref: "refah-admin-dashboard", file: "media/refah-admin-dashboard.webp", alt: t(
    "داشبورد پنل مدیریت سامانهٔ رفاهیات: بن‌های فعال، اعتبار تخصیص‌یافته، مصرف‌شده و فعالیت ۳۰ روز اخیر",
    "Benefits admin dashboard: active vouchers, allocated and spent credit, and the last 30 days of activity",
    "لوحة تحكم منصة المزايا: القسائم النشطة والرصيد المخصص والمستهلك ونشاط آخر 30 يوماً") },
  { ref: "refah-voucher-wizard", file: "media/refah-voucher-wizard.webp", alt: t(
    "ویزارد پنج‌مرحله‌ای صدور بن جدید در پنل مدیریت",
    "The five-step wizard for issuing a new voucher in the admin panel",
    "معالج إصدار قسيمة جديدة من خمس خطوات في لوحة الإدارة") },
  { ref: "refah-seller-purchase", file: "media/refah-seller-purchase.webp", alt: t(
    "پنل فروشنده: ثبت خرید جدید و انتخاب روش شناسایی کارمند",
    "Merchant panel: recording a new purchase and choosing how to identify the employee",
    "لوحة التاجر: تسجيل عملية شراء جديدة واختيار طريقة التعرف على الموظف") },
  { ref: "refah-seller-wallet", file: "media/refah-seller-wallet.webp", alt: t(
    "کیف پول فروشنده: کل طلب، دریافت‌شده و مانده",
    "Merchant wallet: total receivable, received and outstanding",
    "محفظة التاجر: إجمالي المستحقات والمستلم والمتبقي") },
  { ref: "refah-employee-voucher", file: "media/refah-employee-voucher.webp", alt: t(
    "پنل کارکنان: جزئیات بن و مانده اعتبار",
    "Employee panel: voucher details and remaining balance",
    "لوحة الموظف: تفاصيل القسيمة والرصيد المتبقي") },
];
