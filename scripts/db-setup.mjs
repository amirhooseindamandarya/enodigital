/**
 * آماده‌سازی پایگاه داده (MySQL 8 / MariaDB 10.5+): اجرای migrationها + دادهٔ اولیه.
 * تکرارپذیر است؛ اجرای دوباره چیزی را خراب نمی‌کند.
 *   node scripts/db-setup.mjs
 * متغیرها: DATABASE_URL (الزامی، مثل mysql://user:pass@localhost:3306/db)
 */
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";

export async function setupDatabase({ log = console.log } = {}) {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL تنظیم نشده است");
  const here = dirname(fileURLToPath(import.meta.url));
  const conn = await mysql.createConnection({ uri: url, timezone: "Z", charset: "utf8mb4_unicode_ci", multipleStatements: false });
  try {
    // برای متن فارسی: پیش‌فرض پایگاه داده utf8mb4 (جدول‌های جدید از آن پیروی می‌کنند)
    try {
      await conn.query("ALTER DATABASE CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    } catch (e) {
      log(`! تغییر charset پایگاه داده ممکن نشد (${e.code ?? e.message}); مطمئن شوید پایگاه داده utf8mb4 است`);
    }
    await migrate(drizzle(conn), { migrationsFolder: join(here, "..", "drizzle") });
    log("✓ migrations");

    const now = new Date();
    const products = [
      { key: "limoc", sort: 1, name: { fa: "لیموسی", en: "Limoc", ar: "ليموسي" }, description: { fa: "نرم‌افزار ابری فروش، مشتری، پروژه و پشتیبانی", en: "Cloud software for sales, customers, projects and support", ar: "برنامج سحابي للمبيعات والعملاء والمشاريع والدعم" } },
      { key: "limofood", sort: 2, name: { fa: "لیموفود", en: "LimoFood", ar: "ليموفود" }, description: { fa: "سامانهٔ سفارش‌گیری آنلاین رستوران و کافه", en: "Online ordering for restaurants and cafés", ar: "نظام الطلب الإلكتروني للمطاعم والمقاهي" } },
      { key: "benefits", sort: 3, name: { fa: "سامانهٔ رفاهیات", en: "Benefits Platform", ar: "منصة المزايا" }, description: { fa: "سامانهٔ بن الکترونیکی رفاهیات کارکنان", en: "Electronic employee-benefits vouchers", ar: "منصة القسائم الإلكترونية لمزايا الموظفين" } },
    ];
    for (const p of products) {
      await conn.execute(
        "INSERT IGNORE INTO `products` (`key`, `name`, `description`, `sort`, `active`, `created_at`, `updated_at`) VALUES (?, ?, ?, ?, 1, ?, ?)",
        [p.key, JSON.stringify(p.name), JSON.stringify(p.description), p.sort, now, now],
      );
    }
    log("✓ products");

    // مدیر کل در پایگاه داده نگه‌داری می‌شود و در اولین ورود از صفحهٔ /admin/setup/ ساخته می‌شود
    const [admins] = await conn.query("SELECT COUNT(*) AS c FROM `users` WHERE `role` = 'admin'");
    log(Number(admins[0].c) ? "✓ admin" : "! هنوز مدیر کل ساخته نشده؛ به /admin/setup/ بروید");
  } finally {
    await conn.end();
  }
}

// اجرای مستقیم: node scripts/db-setup.mjs (متغیرها از محیط، یا از .env.local / .env در پوشهٔ جاری)
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  for (const f of [".env.local", ".env"]) {
    if (!existsSync(f)) continue;
    for (const line of readFileSync(f, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
      if (!m || line.trim().startsWith("#")) continue;
      const v = m[2].replace(/^(['"])(.*)\1$/, "$2");
      if (process.env[m[1]] === undefined) process.env[m[1]] = v;
    }
  }
  setupDatabase().catch((e) => { console.error(e); process.exit(1); });
}
