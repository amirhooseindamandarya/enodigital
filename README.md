# وب‌سایت اِنو دیجیتال

وب‌سایت شرکتی فارسی (RTL) برای یک شرکت توسعهٔ نرم‌افزار با دو حوزه: محصولات آماده (لیموسی، لیموفود، سامانهٔ رفاهیات) و توسعهٔ نرم‌افزار سفارشی.

**فناوری:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · کامپوننت‌های سبک shadcn (Radix) · Lucide · Motion · فونت Vazirmatn (میزبانی داخلی)

## اجرا

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # خروجی ایستا در out/
```

## ساختار

```
src/app/                      صفحات (App Router)
  (site)/                     صفحات عمومی سایت (با هدر و فوتر)
  admin/                      پنل مدیریت محتوا
  page.tsx                    صفحهٔ اصلی
  products/                   همهٔ محصولات + limoc / limofood / benefits
  services/custom-software/   توسعهٔ نرم‌افزار سفارشی
  projects/ about/ blog/ contact/
  sitemap.ts robots.ts not-found.tsx
src/content/                  محتوای قابل ویرایش از پنل مدیریت
  settings.json               اطلاعات تماس، شبکه‌های اجتماعی، شعار
  projects.json               نمونه‌کارها
  articles.json               مقالات
src/lib/                      داده‌های ساخت‌یافته (مستقل از JSX)
  site.ts                     نام شرکت و منو (+ خواندن settings.json)
  products.ts                 اطلاعات سه محصول
  content.ts                  خدمات و فرایند (+ خواندن پروژه‌ها و مقالات)
  seo.tsx                     متادیتا و JSON-LD
src/components/
  layout/                     هدر (Mega Menu، منوی موبایل)، فوتر، لوگو
  home/                       بخش‌های صفحهٔ اصلی و انتخاب راهکار
  product/                    Heroهای اختصاصی و بلوک‌های صفحات محصول
  mockups/                    ماکاپ‌های مفهومی و تصاویر واقعی رفاهیات
  forms/lead-form.tsx         فرم تماس / دمو / درخواست پروژه
  admin/                      پنل مدیریت (ورود، ویرایشگرها، ارتباط با GitHub)
  ui/ motion/                 دکمه، آکاردئون، آیکون، انیمیشن نمایش
src/assets/screens/           اسکرین‌شات‌های واقعی سامانهٔ رفاهیات (دادهٔ آزمایشی)
```

## تنظیمات (`.env.example`)

| متغیر | کاربرد |
|---|---|
| `NEXT_PUBLIC_BASE_PATH` | مسیر پایه؛ برای GitHub Pages `/enodigital`، برای دامنهٔ اختصاصی خالی |
| `NEXT_PUBLIC_SITE_URL` | آدرس کامل سایت برای canonical و sitemap |
| `NEXT_PUBLIC_FORM_ENDPOINT` | نقطهٔ اتصال API فرم‌ها (POST، `multipart/form-data`) |

فرم‌ها اعتبارسنجی کامل دارند. تا `NEXT_PUBLIC_FORM_ENDPOINT` تنظیم نشود، **هیچ پیام موفقیت ساختگی نمایش داده نمی‌شود** و کاربر مطلع می‌شود که ارسال آنلاین فعال نیست. فیلدهای ارسالی: `name`, `organization`, `contact`, `topic`/`projectType`/`teamSize`, `message`, `attachment`, `product`, `formType`, `page`.

## پنل مدیریت (`/admin`)

سایت ایستاست و سرور ندارد؛ برای همین پنل مدیریت تغییرات را مستقیم به‌صورت commit در مخزن GitHub ذخیره می‌کند و گردش‌کار انتشار سایت را چند دقیقه بعد به‌روز می‌کند.

- **چه چیزهایی قابل ویرایش است:** پروژه‌ها (افزودن، ویرایش، حذف، ترتیب، پیش‌نویس/انتشار)، مقالات (با ویرایشگر متن ساده: `## ` تیتر، `- ` فهرست) و تنظیمات سایت (تلفن، ایمیل، نشانی، ساعات کاری، شبکه‌های اجتماعی، شعار).
- **ورود:** با یک توکن Fine-grained گیت‌هاب. در GitHub: Settings → Developer settings → Fine-grained tokens → مخزن `enodigital` را انتخاب کنید؛ مجوز **Contents: Read and write** و (برای دیدن وضعیت انتشار) **Actions: Read-only**.
- توکن فقط در مرورگر خود کاربر نگه داشته می‌شود (پیش‌فرض تا بستن مرورگر). هر کس توکن داشته باشد می‌تواند محتوا را تغییر دهد؛ آن را به اشتراک نگذارید و برای هر نفر توکن جدا بسازید.
- پیام‌های فرم تماس در این پنل نیستند؛ آن‌ها به `NEXT_PUBLIC_FORM_ENDPOINT` ارسال می‌شوند.

## انتشار

گردش‌کار `.github/workflows/deploy.yml` با هر push سایت را می‌سازد و روی GitHub Pages منتشر می‌کند.
در تنظیمات مخزن: **Settings → Pages → Source = GitHub Actions**.
برای فرم: **Settings → Secrets and variables → Actions → Variables → `FORM_ENDPOINT`**.

## محتوای قابل جایگزینی (TODO)

- نام نهایی شرکت و لوگو: `src/lib/site.ts`
- اسکرین‌شات واقعی لیموسی و لیموفود (فعلاً ماکاپ مفهومی با برچسب): `src/components/mockups/`
- نمونه‌کارها، مقالات و اطلاعات تماس: از پنل مدیریت (`/admin`)
- داستان و تیم شرکت: `src/app/about/page.tsx`
