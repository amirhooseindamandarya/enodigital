import type { FormDef } from "@/cms/types";
import { t } from "@/cms/fields";

const fullName = { key: "full_name", type: "text" as const, required: true, labels: t("نام و نام خانوادگی", "Full name", "الاسم الكامل"), placeholders: { fa: "مثلاً علی رضایی", en: "e.g. Sara Ahmadi", ar: "مثلاً علي رضائي" } };
const org = { key: "organization", type: "text" as const, labels: t("سازمان یا شرکت", "Company or organisation", "الشركة أو المؤسسة") };
const phone = { key: "phone", type: "phone" as const, required: true, labels: t("شمارهٔ تماس", "Phone number", "رقم الهاتف"), placeholders: { fa: "09xx xxx xxxx", en: "+98 9xx xxx xxxx", ar: "+98 9xx xxx xxxx" } };
const email = { key: "email", type: "email" as const, labels: t("ایمیل", "Email", "البريد الإلكتروني"), placeholders: { fa: "name@example.com", en: "name@example.com", ar: "name@example.com" } };

export const forms: FormDef[] = [
  {
    key: "contact",
    name: "فرم تماس با ما",
    fields: [
      fullName, org, phone, email,
      {
        key: "topic", type: "select", required: false, labels: t("موضوع", "Topic", "الموضوع"),
        options: [
          { value: "limoc", labels: t("لیموسی", "Limoc", "ليموسي") },
          { value: "limofood", labels: t("لیموفود", "LimoFood", "ليموفود") },
          { value: "benefits", labels: t("سامانهٔ رفاهیات", "Benefits Platform", "منصة المزايا") },
          { value: "custom", labels: t("نرم‌افزار سفارشی", "Custom software", "برمجيات مخصصة") },
          { value: "other", labels: t("سایر", "Other", "أخرى") },
        ],
      },
      { key: "message", type: "textarea", required: true, labels: t("پیام", "Message", "الرسالة") },
    ],
    texts: {
      fa: { title: "فرم تماس", submit_label: "ارسال پیام", success_message: "پیام شما ثبت شد. به‌زودی با شما تماس می‌گیریم." },
      en: { title: "Contact form", submit_label: "Send message", success_message: "Thanks — your message has been received. We’ll be in touch soon." },
      ar: { title: "نموذج التواصل", submit_label: "إرسال الرسالة", success_message: "تم استلام رسالتك. سنتواصل معك قريباً." },
    },
  },
  {
    key: "demo",
    name: "فرم درخواست دمو",
    fields: [
      fullName,
      { ...org, labels: t("نام سازمان / کسب‌وکار", "Company / business name", "اسم المؤسسة / النشاط التجاري") },
      phone,
      {
        key: "team_size", type: "select", labels: t("اندازهٔ تیم یا سازمان", "Team or organisation size", "حجم الفريق أو المؤسسة"),
        options: [
          { value: "lt10", labels: t("کمتر از ۱۰ نفر", "Fewer than 10", "أقل من 10") },
          { value: "10-50", labels: t("۱۰ تا ۵۰ نفر", "10–50", "10 إلى 50") },
          { value: "50-200", labels: t("۵۰ تا ۲۰۰ نفر", "50–200", "50 إلى 200") },
          { value: "200-1000", labels: t("۲۰۰ تا ۱٬۰۰۰ نفر", "200–1,000", "200 إلى 1,000") },
          { value: "gt1000", labels: t("بیش از ۱٬۰۰۰ نفر", "More than 1,000", "أكثر من 1,000") },
        ],
      },
      { key: "message", type: "textarea", labels: t("توضیحات (اختیاری)", "Notes (optional)", "ملاحظات (اختياري)") },
    ],
    texts: {
      fa: { submit_label: "درخواست دمو", success_message: "درخواست شما ثبت شد. برای هماهنگی دمو با شما تماس می‌گیریم." },
      en: { submit_label: "Request a demo", success_message: "Request received. We’ll contact you to schedule your demo." },
      ar: { submit_label: "اطلب عرضاً تجريبياً", success_message: "تم استلام طلبك. سنتواصل معك لتحديد موعد العرض." },
    },
  },
  {
    key: "project",
    name: "فرم درخواست پروژه",
    fields: [
      fullName, org, phone, email,
      {
        key: "project_type", type: "select", required: true, labels: t("نوع پروژه", "Project type", "نوع المشروع"),
        options: [
          { value: "web_app", labels: t("وب‌اپلیکیشن", "Web application", "تطبيق ويب") },
          { value: "internal_system", labels: t("سیستم مدیریت داخلی", "Internal management system", "نظام إدارة داخلي") },
          { value: "dashboard", labels: t("داشبورد مدیریتی", "Management dashboard", "لوحة معلومات إدارية") },
          { value: "integration", labels: t("API و یکپارچه‌سازی", "APIs and integration", "واجهات برمجية وتكامل") },
          { value: "existing", labels: t("توسعه یا پشتیبانی سامانهٔ موجود", "Extending or supporting an existing system", "تطوير أو دعم نظام قائم") },
          { value: "other", labels: t("سایر", "Other", "أخرى") },
        ],
      },
      {
        key: "message", type: "textarea", required: true, labels: t("شرح نیاز", "What do you need?", "وصف الاحتياج"),
        placeholders: {
          fa: "مسئله، کاربران سامانه، فرایند فعلی و زمان‌بندی مدنظر را بنویسید.",
          en: "Describe the problem, who will use the system, your current process and your timeline.",
          ar: "اكتب المشكلة ومستخدمي النظام والإجراء الحالي والجدول الزمني المتوقع.",
        },
      },
    ],
    texts: {
      fa: { submit_label: "ثبت درخواست پروژه", success_message: "درخواست شما ثبت شد. برای جلسهٔ شناخت مسئله با شما تماس می‌گیریم." },
      en: { submit_label: "Submit project request", success_message: "Request received. We’ll contact you to set up a discovery call." },
      ar: { submit_label: "إرسال طلب المشروع", success_message: "تم استلام طلبك. سنتواصل معك لترتيب جلسة لفهم الاحتياج." },
    },
  },
];
