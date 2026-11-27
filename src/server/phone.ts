/** یکسان‌سازی ارقام فارسی/عربی و شمارهٔ تلفن */
export const latinDigits = (s: string) =>
  s.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));

/** موبایل ایران ← 09xxxxxxxxx؛ شمارهٔ خارجی ← +xxxxxxxx؛ نامعتبر ← null */
export function normalizePhone(input: string): string | null {
  let s = latinDigits(input).replace(/[\s\-()]/g, "");
  if (/^(\+98|0098|98)9\d{9}$/.test(s)) s = "0" + s.slice(-10);
  if (/^9\d{9}$/.test(s)) s = "0" + s;
  if (/^09\d{9}$/.test(s)) return s;
  if (/^(\+|00)[1-9]\d{7,14}$/.test(s)) return "+" + s.replace(/^(\+|00)/, "");
  return null;
}

export const normalizeEmail = (e: string) => {
  const v = e.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? v : null;
};
