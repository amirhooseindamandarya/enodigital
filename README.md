# وب‌سایت اِنو دیجیتال

وب‌سایت معرفی شرکت و سه محصول آن: **سامانهٔ بن الکترونیکی رفاهیات**، **لیموجت** (خرید آنلاین مواد غذایی) و **لیموسی**.

نشانی: https://amirhooseindamandarya.github.io/enodigital/

سایت ایستا (HTML/CSS/JS بدون build)، راست‌چین، مینیمال و واکنش‌گرا. فونت **وزیرمتن** داخل خود سایت میزبانی می‌شود (بدون وابستگی به Google Fonts یا CDN خارجی).

## ساختار

```
index.html                 صفحهٔ اصلی
products/refah.html        سامانهٔ بن الکترونیکی رفاهیات
products/limoojet.html     لیموجت
products/limoc.html        لیموسی
404.html                   صفحهٔ خطا
sitemap.xml, robots.txt    سئو
assets/css/style.css       سیستم طراحی
assets/js/main.js          منو، انیمیشن نمایش، فرم
assets/fonts/              وزیرمتن (متغیر، مجوز OFL)
assets/img/                تصاویر واقعی سامانه (WebP)، آیکون‌ها، تصویر اشتراک‌گذاری
```

## سئو

- عنوان و توضیح متا اختصاصی برای هر صفحه، canonical، Open Graph و Twitter Card
- دادهٔ ساختاریافته (JSON-LD): Organization، WebSite، FAQPage، SoftwareApplication، BreadcrumbList
- sitemap.xml و robots.txt
- متن جایگزین (alt) توصیفی برای همهٔ تصاویر، بارگذاری تنبل تصاویر پایین صفحه

اگر دامنهٔ اختصاصی وصل شد، آدرس `amirhooseindamandarya.github.io/enodigital` را در همهٔ فایل‌ها (canonical، og، sitemap، robots و 404) با دامنهٔ جدید جایگزین کنید.

## اجرای محلی

```bash
python3 -m http.server 8000
```

## کارهای باقی‌مانده (در کد با `TODO` مشخص شده‌اند)

- محتوا و اسکرین‌شات واقعی **لیموسی** و **لیموجت**
- اطلاعات تماس، لوگو و رنگ برند
- اتصال فرم درخواست دمو به بک‌اند
