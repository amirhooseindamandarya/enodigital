# وب‌سایت اِنو دیجیتال

وب‌سایت سه‌زبانهٔ (فارسی، انگلیسی، عربی) شرکت اِنو دیجیتال، کاملاً **کامپوننت‌بندی‌شده** و آمادهٔ اتصال به **CMS لیموسی** (Headless).

**فناوری:** Next.js 15 (App Router، خروجی ایستا) · React 19 · TypeScript · Tailwind CSS 4 · Radix · Motion · فونت Vazirmatn

## اجرا

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # خروجی ایستا در out/
npm run package    # بستهٔ ایمپورت CMS: dist/enodigital-site.zip + گزارش
```

## زبان‌ها و آدرس‌ها

| زبان | جهت | آدرس |
|---|---|---|
| فارسی (پیش‌فرض) | rtl | `/` · `/limoc/` · `/blog/<slug>/` |
| English | ltr | `/en/` · `/en/limoc/` |
| العربية | rtl | `/ar/` · `/ar/limoc/` |

هر صفحه `lang`/`dir`، canonical و hreflang درست دارد. آدرس‌های قدیمی (`/products/limoc/`، `/services/custom-software/`) به آدرس جدید منتقل می‌شوند.

## معماری

```
src/cms/            لایهٔ CMS: انواع دادهٔ بسته، فیلدها، زبان‌ها، حل محتوا، مسیریابی، منبع داده (site.ts)
src/sections/       انواع سکشن
  schemas.ts        تعریف ۳۲ نوع سکشن و گروه‌های سراسری (sectionTypes / globalGroups)
  render.tsx        نقشهٔ «کلید نوع ← کامپوننت»
  *.tsx             کامپوننت هر سکشن
src/site-content/   محتوای سایت در قالب بستهٔ لیموسی (صفحات، فرم‌ها، منوها، بلاگ، رسانه) — سه‌زبانه
src/app/[[...path]] یک مسیر برای همهٔ صفحات/زبان‌ها؛ صفحه از روی سکشن‌هایش ساخته می‌شود
public/media/       فایل‌های رسانه (همین پوشه به media/ بسته تبدیل می‌شود)
scripts/            ساخت بسته + اعتبارسنجی (build-package.ts)، پس‌پردازش build
```

**هر صفحه = فهرست مرتب سکشن‌ها.** هر سکشن `type` دارد (مثل `hero`، `faq`، `lead_form`) و `content` آن دقیقاً با فیلدهای همان نوع در `schemas.ts` جور است. افزودن نوع جدید: تعریف در `schemas.ts` + کامپوننت + ثبت در `render.tsx`.

## بستهٔ ایمپورت CMS

`npm run package` دادهٔ سایت را طبق «راهنمای ساخت بستهٔ سایت لیموسی — نسخهٔ ۱» به `dist/enodigital-site.zip` (شامل `site.json` و `media/`) تبدیل می‌کند و پیش از ساخت همهٔ موارد چک‌لیست را بررسی می‌کند: قالب کلیدها، وجود نوع سکشن و فیلدها، مقادیر select، ارجاع‌های رسانه/صفحه/فرم/دسته، slugها، تگ‌های richtext، متن ساختگی، طول meta_description و ترجمهٔ زبان پیش‌فرض. گزارش در `dist/package-report.md` نوشته می‌شود؛ با هر خطا بسته ساخته نمی‌شود.

کلید وب‌سایت: **`enodigital`** — کلیدها پس از نصب پایدارند و نباید عوض شوند.

## اتصال به API لیموسی (مرحلهٔ بعد)

فعلاً سایت از دادهٔ محلی (`src/site-content`) ساخته می‌شود. پس از نصب بسته در پنل، تابع `getSite()` در `src/cms/site.ts` داده را در زمان build از API می‌گیرد و هیچ کامپوننتی تغییر نمی‌کند.

## تنظیمات (`.env.example`)

| متغیر | کاربرد |
|---|---|
| `NEXT_PUBLIC_BASE_PATH` | مسیر پایه؛ برای GitHub Pages `/enodigital` |
| `NEXT_PUBLIC_SITE_URL` | آدرس کامل سایت برای canonical، hreflang و sitemap |
| `NEXT_PUBLIC_FORM_ENDPOINT` | نقطهٔ ارسال فرم‌ها؛ تا تنظیم نشود، پیام موفقیت ساختگی نمایش داده نمی‌شود |

## انتشار

گردش‌کار `.github/workflows/deploy.yml` با هر push سایت را می‌سازد و روی GitHub Pages منتشر می‌کند.
