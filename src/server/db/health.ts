import "server-only";
import { sql } from "drizzle-orm";
import { db } from "./index";

export type DbProblem = { code: string; title: string; fix: string[] };

/** بررسی اتصال و جدول‌های پایگاه داده؛ اگر مشکلی باشد، توضیح و راه‌حل فارسی برمی‌گرداند */
export async function dbProblem(): Promise<DbProblem | null> {
  if (!process.env.DATABASE_URL) return { code: "NO_URL", ...HINTS.NO_URL };
  try {
    await db.execute(sql`SELECT 1 FROM \`users\` LIMIT 1`);
    return null;
  } catch (e) {
    const err = (e as { cause?: { code?: string; sqlMessage?: string }; code?: string }) ?? {};
    const code = err.cause?.code ?? err.code ?? "UNKNOWN";
    console.error(`[db] بررسی پایگاه داده ناموفق: ${code}${err.cause?.sqlMessage ? ` — ${err.cause.sqlMessage}` : ""}`);
    return { code, ...(HINTS[code] ?? HINTS.UNKNOWN) };
  }
}

const HINTS: Record<string, { title: string; fix: string[] }> = {
  NO_URL: {
    title: "آدرس پایگاه داده (DATABASE_URL) تنظیم نشده است.",
    fix: [
      "روی کامپیوتر: فایل .env.local را در پوشهٔ اصلی پروژه بسازید و DATABASE_URL را در آن بنویسید، سپس npm run dev را دوباره اجرا کنید.",
      "روی هاست: فایل .env کنار app.js (یا Environment variables در Setup Node.js App) و بعد Restart.",
    ],
  },
  ECONNREFUSED: {
    title: "به سرور MySQL وصل نمی‌شود (سرور خاموش است یا آدرس/پورت اشتباه است).",
    fix: [
      "مطمئن شوید MySQL روشن است (در XAMPP جلوی MySQL دکمهٔ Start را بزنید).",
      "پورت را در DATABASE_URL بررسی کنید (معمولاً 3306).",
      "به‌جای localhost مقدار 127.0.0.1 را امتحان کنید (یا برعکس).",
    ],
  },
  ENOTFOUND: {
    title: "نام میزبان در DATABASE_URL پیدا نشد.",
    fix: ["قسمت بعد از @ در DATABASE_URL را بررسی کنید؛ معمولاً 127.0.0.1 یا localhost است."],
  },
  ETIMEDOUT: {
    title: "اتصال به پایگاه داده زمان‌بر شد و قطع شد.",
    fix: ["آدرس و پورت DATABASE_URL و فایروال را بررسی کنید."],
  },
  ER_ACCESS_DENIED_ERROR: {
    title: "نام کاربری یا رمز پایگاه داده درست نیست.",
    fix: [
      "نام کاربری و رمز را در DATABASE_URL بررسی کنید: mysql://کاربر:رمز@127.0.0.1:3306/نام_پایگاه_داده",
      "در XAMPP معمولاً کاربر root بدون رمز است: mysql://root:@127.0.0.1:3306/enodigital",
      "اگر رمز نویسه‌هایی مثل @ یا # دارد، آن‌ها را کدگذاری کنید (@ ← %40 و # ← %23).",
    ],
  },
  ER_DBACCESS_DENIED_ERROR: {
    title: "کاربر پایگاه داده به این پایگاه داده دسترسی ندارد.",
    fix: ["در cPanel ← MySQL Databases ← Add User To Database، کاربر را با ALL PRIVILEGES به پایگاه داده اضافه کنید."],
  },
  ER_BAD_DB_ERROR: {
    title: "پایگاه داده‌ای با این نام وجود ندارد.",
    fix: [
      "در phpMyAdmin پایگاه داده را بسازید (Collation: utf8mb4_unicode_ci) یا نام آن را در DATABASE_URL درست کنید.",
      "سپس npm run db:setup را اجرا کنید.",
    ],
  },
  ER_NO_SUCH_TABLE: {
    title: "جدول‌های پایگاه داده ساخته نشده‌اند.",
    fix: [
      "روی کامپیوتر: در پوشهٔ پروژه دستور npm run db:setup را اجرا کنید و صفحه را دوباره باز کنید.",
      "روی هاست: در Setup Node.js App دکمهٔ Restart را بزنید و خطوط [setup] را در stderr.log ببینید.",
    ],
  },
  UNKNOWN: {
    title: "پایگاه داده پاسخ درستی نداد.",
    fix: ["متن کامل خطا در ترمینالی که npm run dev در آن اجرا شده (یا stderr.log روی هاست) آمده است؛ آن را برای پشتیبانی بفرستید."],
  },
};
