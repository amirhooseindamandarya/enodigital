/**
 * ساخت بستهٔ آمادهٔ آپلود برای «Setup Node.js App» در cPanel.
 *   npm run bundle:cpanel     →  dist/enodigital-cpanel.zip
 *
 * ساختار بسته (ریشهٔ برنامه در cPanel):
 *   app.js            فایل شروع (Application startup file)
 *   package.json      بدون وابستگی؛ «Run NPM Install» لازم نیست
 *   .env.example      الگوی تنظیمات (به .env تغییر نام دهید)
 *   server/           خروجی standalone نکست + node_modules لازم + migrationها
 * cPanel اجازهٔ پوشهٔ node_modules در ریشهٔ برنامه را نمی‌دهد؛ برای همین همه‌چیز در server/ است.
 */
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { zipSync } from "fflate";

const ROOT = process.cwd();
const OUT = join(ROOT, "dist", "cpanel");
const APP = join(OUT, "enodigital");

if (!process.argv.includes("--no-build")) {
  // صفحات روی خود سرور ساخته می‌شوند تا آدرس دامنه از APP_URL همان سرور خوانده شود
  execSync("npx next build", { stdio: "inherit", env: { ...process.env, PRERENDER: "0", NEXT_TELEMETRY_DISABLED: "1" } });
}
if (!existsSync(join(ROOT, ".next/standalone/server.js"))) throw new Error("خروجی standalone پیدا نشد");

rmSync(OUT, { recursive: true, force: true });
mkdirSync(APP, { recursive: true });
const S = join(APP, "server");
cpSync(join(ROOT, ".next/standalone"), S, { recursive: true });
cpSync(join(ROOT, ".next/static"), join(S, ".next/static"), { recursive: true });
cpSync(join(ROOT, "public"), join(S, "public"), { recursive: true });
cpSync(join(ROOT, "drizzle"), join(S, "drizzle"), { recursive: true });
mkdirSync(join(S, "scripts"), { recursive: true });
cpSync(join(ROOT, "scripts/db-setup.mjs"), join(S, "scripts/db-setup.mjs"));
// migrator دریزل در خروجی standalone ردیابی نمی‌شود
cpSync(join(ROOT, "node_modules/drizzle-orm"), join(S, "node_modules/drizzle-orm"), { recursive: true });
for (const f of [".env", ".env.local", ".env.production"]) rmSync(join(S, f), { force: true });
// کش صفحه‌هایی که ممکن است هنگام آزمون محلی ساخته شده باشند (آدرس دامنهٔ اشتباه دارند)
for (const d of [".next/cache", ".next/server/route-cache"]) rmSync(join(S, d), { recursive: true, force: true });
rmSync(join(S, "logs"), { recursive: true, force: true });

// فایل شروع: لاگ در logs/app.log، بررسی نسخهٔ Node، migration و نمایش علت خطا در مرورگر
cpSync(join(ROOT, "scripts/cpanel-app.js"), join(APP, "app.js"));

writeFileSync(join(APP, "package.json"), JSON.stringify({
  name: "enodigital",
  version: JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")).version,
  private: true,
  description: "اِنو دیجیتال — سایت، حساب مشتری و پنل مدیریت",
  main: "app.js",
  scripts: { start: "node app.js" },
  engines: { node: ">=18.18" },
  dependencies: {},
}, null, 2) + "\n");

writeFileSync(join(APP, ".env.example"), `# این فایل را به .env تغییر نام دهید و مقادیر را پر کنید (یا همین‌ها را در «Environment variables» در cPanel وارد کنید)

# آدرس کامل سایت (با https و بدون / در انتها)
APP_URL=https://example.com

# پایگاه داده MySQL که در cPanel ساخته‌اید
# mysql://کاربر:رمز@localhost:3306/نام_پایگاه_داده   (اگر رمز نویسهٔ خاص دارد، URL-encode کنید)
DATABASE_URL=mysql://cpuser_eno:PASSWORD@localhost:3306/cpuser_eno

# مدیر کل این‌جا تعریف نمی‌شود: بعد از اجرای برنامه به https://دامنه/admin/setup/ بروید
# و شماره و رمز مدیر را بسازید (در پایگاه داده ذخیره می‌شود)

# درگاه زرین‌پال
ZARINPAL_MERCHANT_ID=
ZARINPAL_SANDBOX=false

# پیامک کاوه‌نگار (اختیاری)
SMS_DRIVER=kavenegar
KAVENEGAR_API_KEY=
KAVENEGAR_TEMPLATE_OTP=
KAVENEGAR_TEMPLATE_ORDER=
KAVENEGAR_TEMPLATE_TICKET=

# تعداد اتصال هم‌زمان به پایگاه داده (روی هاست اشتراکی کم نگه دارید)
DATABASE_POOL=5
`);

cpSync(join(ROOT, "docs/cpanel.md"), join(APP, "INSTALL-FA.md"));

/* ---------------- zip ---------------- */
const files = {};
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else files[relative(OUT, p).split("\\").join("/")] = [readFileSync(p), { level: /\.(png|webp|woff2|jpg|gif|zip)$/.test(name) ? 0 : 6 }];
  }
};
walk(OUT);
const zipPath = join(ROOT, "dist", "enodigital-cpanel.zip");
writeFileSync(zipPath, zipSync(files));
const mb = (statSync(zipPath).size / 1024 / 1024).toFixed(1);
console.log(`✓ ${zipPath} (${mb} MB، ${Object.keys(files).length} فایل)`);
