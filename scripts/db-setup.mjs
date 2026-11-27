/**
 * آماده‌سازی پایگاه داده (MySQL 8 / MariaDB 10.5+): اجرای migrationها + دادهٔ اولیه.
 * تکرارپذیر است؛ اجرای دوباره چیزی را خراب نمی‌کند.
 *   node scripts/db-setup.mjs
 * متغیرها: DATABASE_URL (الزامی، مثل mysql://user:pass@localhost:3306/db)
 *          ADMIN_PHONE و ADMIN_PASSWORD و ADMIN_NAME (ساخت/ارتقای مدیر کل؛ اختیاری)
 */
import { randomBytes, scrypt as _scrypt } from "node:crypto";
import { promisify } from "node:util";
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
  const scrypt = promisify(_scrypt);
  const hash = async (pw) => {
    const salt = randomBytes(16);
    const h = await scrypt(pw, salt, 64, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
    return ["scrypt", 16384, 8, 1, salt.toString("base64"), h.toString("base64")].join("$");
  };
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

    const phone = process.env.ADMIN_PHONE, password = process.env.ADMIN_PASSWORD;
    if (phone && password) {
      if (password.length < 8) throw new Error("ADMIN_PASSWORD باید حداقل ۸ نویسه باشد");
      const [rows] = await conn.execute("SELECT `id` FROM `users` WHERE `phone` = ?", [phone]);
      if (rows.length) await conn.execute("UPDATE `users` SET `role` = 'admin', `status` = 'active' WHERE `id` = ?", [rows[0].id]);
      else await conn.execute(
        "INSERT INTO `users` (`name`, `phone`, `password_hash`, `role`, `status`, `locale`, `created_at`, `updated_at`) VALUES (?, ?, ?, 'admin', 'active', 'fa', ?, ?)",
        [process.env.ADMIN_NAME || "مدیر", phone, await hash(password), now, now],
      );
      log(`✓ admin ${phone}`);
    }
  } finally {
    await conn.end();
  }
}

// اجرای مستقیم: node scripts/db-setup.mjs
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  setupDatabase().catch((e) => { console.error(e); process.exit(1); });
}
