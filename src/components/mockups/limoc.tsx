import kanban from "@/assets/screens/limoc-kanban.webp";
import quote from "@/assets/screens/limoc-quote.webp";
import ticket from "@/assets/screens/limoc-ticket.webp";
import portal from "@/assets/screens/limoc-portal.webp";
import project from "@/assets/screens/limoc-project.webp";

/** تصاویر واقعی لیموسی (فضای کاری دمو با دادهٔ نمونه) */
export const limocScreens = {
  kanban: { src: kanban, alt: "نمای Kanban فروش در لیموسی: معاملات در مراحل مذاکره، پیشنهاد ارسال‌شده، برنده و ازدست‌رفته" },
  quote: { src: quote, alt: "صدور پیش‌فاکتور در لیموسی: اقلام از کاتالوگ، تخفیف، مالیات، جمع‌بندی مالی و ارسال به مشتری" },
  ticket: { src: ticket, alt: "تیکت پشتیبانی در لیموسی: مکاتبات، تغییر وضعیت، مسئول تیکت، مهلت پاسخ و تاریخچهٔ وضعیت" },
  portal: { src: portal, alt: "پرتال مشتریان لیموسی: تیکت‌های باز، فاکتورها، ماندهٔ قابل پرداخت و وضعیت پشتیبانی" },
  project: { src: project, alt: "ویرایش پروژه در لیموسی: شرکت طرف قرارداد، قرارداد، مدیر پروژه و مبنای پورسانت" },
};
