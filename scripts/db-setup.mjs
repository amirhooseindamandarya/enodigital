/**
 * آماده‌سازی پایگاه داده: اجرای migrationها + دادهٔ اولیه (تکرارپذیر؛ اجرای دوباره چیزی را خراب نمی‌کند).
 *   node scripts/db-setup.mjs
 * متغیرها: DATABASE_URL (الزامی) · ADMIN_PHONE و ADMIN_PASSWORD و ADMIN_NAME (ساخت/ارتقای مدیر کل)
 */
import { randomBytes, scrypt as _scrypt } from "node:crypto";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

const url = process.env.DATABASE_URL;
if (!url) { console.error("DATABASE_URL تنظیم نشده است"); process.exit(1); }
const here = dirname(fileURLToPath(import.meta.url));
const sql = postgres(url, { max: 1, onnotice: () => {} });

const scrypt = promisify(_scrypt);
async function hash(pw) {
  const salt = randomBytes(16);
  const h = await scrypt(pw, salt, 64, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  return ["scrypt", 16384, 8, 1, salt.toString("base64"), h.toString("base64")].join("$");
}

try {
  await migrate(drizzle(sql), { migrationsFolder: join(here, "..", "drizzle") });
  console.log("✓ migrations");

  const products = [
    { key: "limoc", sort: 1, name: { fa: "لیموسی", en: "Limoc", ar: "ليموسي" }, description: { fa: "نرم‌افزار ابری فروش، مشتری، پروژه و پشتیبانی", en: "Cloud software for sales, customers, projects and support", ar: "برنامج سحابي للمبيعات والعملاء والمشاريع والدعم" } },
    { key: "limofood", sort: 2, name: { fa: "لیموفود", en: "LimoFood", ar: "ليموفود" }, description: { fa: "سامانهٔ سفارش‌گیری آنلاین رستوران و کافه", en: "Online ordering for restaurants and cafés", ar: "نظام الطلب الإلكتروني للمطاعم والمقاهي" } },
    { key: "benefits", sort: 3, name: { fa: "سامانهٔ رفاهیات", en: "Benefits Platform", ar: "منصة المزايا" }, description: { fa: "سامانهٔ بن الکترونیکی رفاهیات کارکنان", en: "Electronic employee-benefits vouchers", ar: "منصة القسائم الإلكترونية لمزايا الموظفين" } },
  ];
  for (const p of products) {
    await sql`insert into products (key, name, description, sort) values (${p.key}, ${JSON.stringify(p.name)}::jsonb, ${JSON.stringify(p.description)}::jsonb, ${p.sort}) on conflict (key) do nothing`;
  }
  console.log("✓ products");

  const phone = process.env.ADMIN_PHONE, password = process.env.ADMIN_PASSWORD;
  if (phone && password) {
    if (password.length < 8) throw new Error("ADMIN_PASSWORD باید حداقل ۸ نویسه باشد");
    const [u] = await sql`select id from users where phone = ${phone}`;
    if (u) await sql`update users set role = 'admin', status = 'active' where id = ${u.id}`;
    else await sql`insert into users (name, phone, password_hash, role) values (${process.env.ADMIN_NAME || "مدیر"}, ${phone}, ${await hash(password)}, 'admin')`;
    console.log(`✓ admin ${phone}`);
  }
} catch (e) {
  console.error(e);
  process.exitCode = 1;
} finally {
  await sql.end();
}
