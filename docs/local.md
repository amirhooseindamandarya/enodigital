# اجرای پروژه روی کامپیوتر خودتان (ویندوز، مک، لینوکس)

## پیش‌نیازها
1. **Node.js نسخهٔ ۲۰ یا ۲۲** — از [nodejs.org](https://nodejs.org) (نسخهٔ LTS) نصب کنید. بعد از نصب در ترمینال: `node -v`
2. **MySQL یا MariaDB** — ساده‌ترین راه روی ویندوز: **XAMPP** (فقط MySQL را Start کنید). روی مک: `brew install mysql` یا MAMP.
3. (اختیاری) **Git** برای دریافت سورس از گیت‌هاب.

## ۱. دریافت سورس
یا فایل `enodigital-source.zip` را باز کنید، یا:

```bash
git clone -b claude/busy-thompson-mt6agv https://github.com/amirhooseindamandarya/enodigital.git
```

```bash
cd enodigital
```

## ۲. نصب وابستگی‌ها

```bash
npm install
```

## ۳. ساخت پایگاه داده
در phpMyAdmin (XAMPP: `http://localhost/phpmyadmin`) یک پایگاه داده به نام `enodigital` با Collation **utf8mb4_unicode_ci** بسازید.
یا در ترمینال MySQL:

```sql
CREATE DATABASE enodigital CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## ۴. تنظیمات
فایل `.env.local` را در پوشهٔ پروژه بسازید:

```
APP_URL=http://localhost:3000
# XAMPP: کاربر root بدون رمز
DATABASE_URL=mysql://root:@127.0.0.1:3306/enodigital
# پیامک‌ها فقط در ترمینال چاپ می‌شوند (کد بازیابی رمز را از همان‌جا بخوانید)
SMS_DRIVER=log
```

در حالت توسعه، اگر `ZARINPAL_MERCHANT_ID` خالی باشد، یک **درگاه آزمایشی** فعال است: دکمهٔ «پرداخت موفق» یا «انصراف» نشان می‌دهد و پولی جابه‌جا نمی‌شود.

## ۵. ساخت جدول‌ها و اجرا

> **روش دیگر:** به‌جای `npm run db:setup` می‌توانید فایل `database/enodigital.sql` را در phpMyAdmin ← تب Import ایمپورت کنید.


```bash
npm run db:setup
```

```bash
npm run dev
```

سایت روی `http://localhost:3000` بالا می‌آید.

## ۶. ساخت مدیر و آزمایش
1. به `http://localhost:3000/admin/` بروید؛ صفحهٔ **راه‌اندازی** باز می‌شود. نام، موبایل و رمز مدیر کل را وارد کنید (در پایگاه داده ذخیره می‌شود).
2. **تنظیمات فروشگاه** ← «نرخ دلار» را وارد کنید (مثلاً `95000`).
3. **خدمات دیجیتال** ← یک دسته (مثلاً «طراحی سایت») و چند خدمت بسازید؛ یکی را دلاری قیمت بگذارید.
4. **محصولات و پلن‌ها** ← برای لیموسی چند پلن بسازید.
5. در پنجرهٔ ناشناس مرورگر به `http://localhost:3000/services/` بروید، ثبت‌نام کنید و یک خدمت بخرید.
6. سفارش را در پنل مدیریت ببینید.

صفحه‌های انگلیسی و عربی: `/en/` و `/ar/` · حساب مشتری: `/account/`

## ساخت نسخهٔ نهایی (مثل سرور)

```bash
npm run build
```

```bash
npm start
```

برای ساخت بستهٔ هاست cPanel: `npm run bundle:cpanel` ← `dist/enodigital-cpanel.zip`

## آزمون خودکار (اختیاری)
روی پایگاه دادهٔ **خالی** (بدون مدیر)، با یک ترمینال برای سرور و یکی برای آزمون:

```bash
npm run build && PAYMENT_MOCK=true SMS_DRIVER=log COOKIE_SECURE=false npm start > server.log
```

```bash
BASE_URL=http://localhost:3000 SERVER_LOG=server.log node tests/e2e.cjs
```

(نیاز به `npx playwright install chromium` دارد.)

## مشکلات رایج
- **`ER_ACCESS_DENIED`**: نام کاربری/رمز در `DATABASE_URL`. در XAMPP معمولاً `root` بدون رمز است: `mysql://root:@127.0.0.1:3306/enodigital`
- **`ECONNREFUSED`**: MySQL روشن نیست (در XAMPP روی Start بزنید) یا پورت آن ۳۳۰۶ نیست.
- **پورت ۳۰۰۰ اشغال است**: `npm run dev -- -p 3001` و `APP_URL` را هم عوض کنید.
- **حروف فارسی به‌شکل ؟؟؟**: پایگاه داده باید `utf8mb4_unicode_ci` باشد.
