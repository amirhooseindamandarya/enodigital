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
  page.tsx                    صفحهٔ اصلی
  products/                   همهٔ محصولات + limoc / limofood / benefits
  services/custom-software/   توسعهٔ نرم‌افزار سفارشی
  projects/ about/ blog/ contact/
  sitemap.ts robots.ts not-found.tsx
src/lib/                      داده‌های ساخت‌یافته (مستقل از JSX)
  site.ts                     نام شرکت، لوگو، اطلاعات تماس، منو
  products.ts                 اطلاعات سه محصول
  content.ts                  خدمات، فرایند، پروژه‌ها، مقالات
  seo.tsx                     متادیتا و JSON-LD
src/components/
  layout/                     هدر (Mega Menu، منوی موبایل)، فوتر، لوگو
  home/                       بخش‌های صفحهٔ اصلی و انتخاب راهکار
  product/                    Heroهای اختصاصی و بلوک‌های صفحات محصول
  mockups/                    ماکاپ‌های مفهومی و تصاویر واقعی رفاهیات
  forms/lead-form.tsx         فرم تماس / دمو / درخواست پروژه
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

## انتشار

گردش‌کار `.github/workflows/deploy.yml` با هر push سایت را می‌سازد و روی GitHub Pages منتشر می‌کند.
در تنظیمات مخزن: **Settings → Pages → Source = GitHub Actions**.
برای فرم: **Settings → Secrets and variables → Actions → Variables → `FORM_ENDPOINT`**.

## محتوای قابل جایگزینی (TODO)

- نام نهایی شرکت، لوگو و اطلاعات تماس: `src/lib/site.ts`
- اسکرین‌شات واقعی لیموسی و لیموفود (فعلاً ماکاپ مفهومی با برچسب): `src/components/mockups/`
- نمونه‌کارهای واقعی و نتایج قابل‌استناد: `src/lib/content.ts` → `projects`
- داستان و تیم شرکت: `src/app/about/page.tsx`
