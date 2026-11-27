import type { L10n } from "@/server/db/schema";

export const fa = (v?: L10n | null) => v?.fa ?? "";
export const nFa = (n: number) => n.toLocaleString("fa-IR");

/** تاریخ برای input[type=date] به وقت تهران */
export function dateInput(d?: Date | null) {
  if (!d) return "";
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tehran", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

export const periodFa: Record<string, string> = { monthly: "ماهانه", quarterly: "سه‌ماهه", semiannual: "شش‌ماهه", yearly: "سالانه", one_time: "یک‌باره" };
export const orderStatusFa: Record<string, string> = { pending: "در انتظار پرداخت", paid: "پرداخت‌شده", completed: "تکمیل‌شده", cancelled: "لغوشده", failed: "ناموفق", refunded: "بازپرداخت‌شده" };
export const subStatusFa: Record<string, string> = { pending: "در انتظار فعال‌سازی", active: "فعال", expired: "منقضی", cancelled: "لغوشده", suspended: "معلق" };
export const ticketStatusFa: Record<string, string> = { open: "باز", answered: "پاسخ داده شد", customer_reply: "پاسخ مشتری", closed: "بسته" };
export const payStatusFa: Record<string, string> = { initiated: "آغازشده", paid: "موفق", failed: "ناموفق", cancelled: "انصراف" };
export const priorityFa: Record<string, string> = { low: "کم", normal: "عادی", high: "زیاد" };
export const roleFa: Record<string, string> = { customer: "مشتری", staff: "کارشناس", admin: "مدیر کل" };

export function pageOf(sp: { page?: string }, size = 30) {
  const page = Math.max(1, Number(sp.page) || 1);
  return { page, limit: size, offset: (page - 1) * size };
}
