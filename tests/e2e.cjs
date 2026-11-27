/**
 * آزمون سرتاسری فروش اشتراک (Playwright).
 * پیش‌نیاز: سرور با PAYMENT_MOCK=true و SMS_DRIVER=log، مدیر 09120000001 / admin-pass-123 (ADMIN_* در db:setup)
 *   BASE_URL=http://localhost:3000 SERVER_LOG=server.log node tests/e2e.cjs
 */
const { chromium } = require('playwright');
const fs = require('fs');
const BASE = process.env.BASE_URL || 'http://localhost:3000';
const SHOTS = process.env.SHOTS_DIR || require('path').join(__dirname, '..', 'dist', 'e2e-shots');
fs.mkdirSync(SHOTS, { recursive: true });
const LOG = process.env.SERVER_LOG || '';
let step = 0;
const ok = (m) => console.log(`✓ ${++step}. ${m}`);
const must = (cond, m) => { if (!cond) throw new Error('FAILED: ' + m); ok(m); };
const phone = '0912' + String(Date.now()).slice(-7);

(async () => {
  const b = await chromium.launch();
  const admin = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  const cust = await (await b.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();
  const errs = [];
  const patch = (p) => { const w = p.waitForURL.bind(p); p.waitForURL = (u, o = {}) => w(u, { waitUntil: 'commit', ...o }).then(() => p.waitForLoadState('domcontentloaded')).then(() => p.waitForTimeout(300)); p.on('pageerror', (e) => errs.push(e.message)); return p; };
  for (const p of [admin, cust]) patch(p);
  const shot = (p, n) => p.screenshot({ path: `${SHOTS}/${n}.png`, fullPage: true });

  // ---- مدیر: ورود، پلن، کوپن
  await admin.goto(BASE + '/admin/');
  must(admin.url().includes('/admin/login'), 'admin redirects to login');
  await admin.fill('input[name=identifier]', '09120000001'); await admin.fill('input[name=password]', 'wrong-pass');
  await admin.click('button[type=submit]'); await admin.waitForSelector('[role=alert]');
  must(true, 'wrong admin password rejected');
  await admin.fill('input[name=password]', 'admin-pass-123'); await admin.click('button[type=submit]');
  await admin.waitForURL(BASE + '/admin/'); must(true, 'admin login');
  await admin.goto(BASE + '/admin/products/'); await admin.click('text=لیموسی');
  await admin.waitForURL(/\/admin\/products\/\d+\//);
  const addPlan = async (fa, en, ar, price, period, days, hl, feats) => {
    const f = admin.locator('form', { has: admin.locator('button:has-text("افزودن پلن")') });
    await f.locator('input[name=name_fa]').fill(fa); await f.locator('input[name=name_en]').fill(en); await f.locator('input[name=name_ar]').fill(ar);
    await f.locator('input[name=price]').fill(price); await f.locator('select[name=period]').selectOption(period); await f.locator('input[name=durationDays]').fill(days);
    await f.locator('textarea[name=features_fa]').fill(feats[0]); await f.locator('textarea[name=features_en]').fill(feats[1]); await f.locator('textarea[name=features_ar]').fill(feats[2]);
    if (hl) await f.locator('input[name=highlighted]').check();
    await f.locator('button:has-text("افزودن پلن")').click(); await admin.waitForSelector('text=پلن اضافه شد'); await admin.reload();
  };
  await addPlan('پایه', 'Basic', 'الأساسية', '490000', 'monthly', '30', false, ['تا ۳ کاربر\nقیف فروش و پیش‌فاکتور', 'Up to 3 users\nPipeline and quotes', 'حتى 3 مستخدمين\nمسار المبيعات وعروض الأسعار']);
  await addPlan('حرفه‌ای', 'Pro', 'الاحترافية', '1490000', 'monthly', '30', true, ['تا ۱۰ کاربر\nپشتیبانی با SLA\nپرتال مشتریان', 'Up to 10 users\nSLA support\nCustomer portal', 'حتى 10 مستخدمين\nدعم وفق SLA\nبوابة العملاء']);
  must(await admin.locator('text=حرفه‌ای').count() > 0, 'admin created two Limoc plans');
  await admin.goto(BASE + '/admin/coupons/');
  await admin.fill('input[name=code]', 'OFF20'); await admin.fill('input[name=value]', '20'); await admin.click('button:has-text("ساخت کد تخفیف")');
  await admin.waitForSelector('text=کد تخفیف ساخته شد'); await admin.reload(); must(await admin.locator('text=OFF20').count() > 0, 'coupon OFF20 created');

  // ---- سایت: پلن‌ها روی صفحهٔ محصول
  await cust.goto(BASE + '/limoc/'); await cust.waitForSelector('#pricing >> text=حرفه‌ای');
  must(true, 'Limoc page shows live plans'); await cust.locator('#pricing').screenshot({ path: `${SHOTS}/pricing-section.png` });
  await cust.goto(BASE + '/en/pricing/'); await cust.waitForSelector('text=Pro'); must(await cust.locator('text=Buy now').count() >= 2, 'English pricing page lists plans');
  await cust.goto(BASE + '/limoc/'); await cust.waitForSelector('#pricing >> text=حرفه‌ای');
  await cust.locator('#pricing li', { hasText: 'حرفه‌ای' }).locator('a').click();
  await cust.waitForURL(/\/account\/login\//); must(cust.url().includes('next='), 'buy → login with return path');

  // ---- ثبت‌نام
  await cust.click('text=ثبت‌نام'); await cust.waitForURL(/register/);
  await cust.fill('input[name=name]', 'سارا احمدی'); await cust.fill('input[name=phone]', 'abc'); await cust.fill('input[name=password]', 'secret-123');
  await cust.click('button[type=submit]'); await cust.waitForSelector('[role=alert]'); must(true, 'invalid phone rejected');
  await cust.fill('input[name=phone]', phone.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d])); // ارقام فارسی
  await cust.click('button[type=submit]'); await cust.waitForURL(/\/account\/checkout\//);
  must(true, 'registered (Persian digits) and returned to checkout');

  // ---- تسویه با کوپن و پرداخت آزمایشی
  await cust.fill('input[name=coupon]', 'nope'); await cust.click('button:has-text("اعمال")'); await cust.waitForSelector('text=کد تخفیف معتبر نیست');
  must(true, 'invalid coupon message');
  await cust.fill('input[name=coupon]', 'off20'); await cust.click('button:has-text("اعمال")'); await cust.waitForSelector('text=کد تخفیف اعمال شد');
  const totalText = await cust.locator('dl >> text=مبلغ قابل پرداخت').locator('..').textContent();
  // 1,490,000 − 20% = 1,192,000 + 10% = 1,311,200
  must(totalText.includes('۱٬۳۱۱٬۲۰۰'), `total with coupon+VAT = 1,311,200 (${totalText.trim()})`);
  await shot(cust, 'checkout');
  await cust.click('button:has-text("ثبت سفارش و پرداخت")'); await cust.waitForSelector('[role=alert]'); must(true, 'terms checkbox required');
  await cust.check('input[name=agree]'); await cust.click('button:has-text("ثبت سفارش و پرداخت")');
  await cust.waitForURL(/\/api\/payments\/mock\//); must(true, 'redirected to (mock) gateway');
  await cust.click('#pay-ok'); await cust.waitForURL(/\/account\/orders\/\d+\/\?pay=ok/);
  must(await cust.locator('text=پرداخت با موفقیت انجام شد').count() === 1, 'payment verified → success message');
  must(await cust.locator('text=پرداخت‌شده').count() >= 1, 'order status paid');
  const orderUrl = cust.url().split('?')[0];
  await shot(cust, 'order-paid');
  await cust.goto(orderUrl + 'invoice/'); must(await cust.locator('text=صورت‌حساب فروش').count() === 1, 'sales invoice renders'); await shot(cust, 'invoice');

  // ---- اشتراک
  await cust.goto(BASE + '/account/subscriptions/');
  must(await cust.locator('text=فعال').count() >= 1 && await cust.locator('text=در حال آماده‌سازی').count() === 1, 'subscription active, access pending');
  await cust.goto(BASE + '/account/'); await shot(cust, 'dashboard');

  // ---- مدیر: سفارش، اشتراک، دسترسی
  await admin.goto(BASE + '/admin/'); must(await admin.locator('text=درآمد ۳۰ روز اخیر').count() === 1, 'admin dashboard'); await shot(admin, 'admin-dashboard');
  await admin.goto(BASE + '/admin/subscriptions/'); await admin.locator('tbody tr').first().locator('a').first().click();
  await admin.waitForURL(/\/admin\/subscriptions\/\d+\//);
  await admin.fill('input[name=accessUrl]', 'https://demo.limoc.example/workspace'); await admin.fill('textarea[name=accessNote]', 'نام کاربری: sara');
  await admin.click('button:has-text("ذخیره")'); await admin.waitForSelector('text=ذخیره شد.'); must(true, 'admin set access details');
  await cust.goto(BASE + '/account/subscriptions/'); must(await cust.locator('a:has-text("ورود به سرویس")').count() === 1, 'customer sees access link');
  const endBefore = await cust.locator('dd').nth(1).textContent();

  // ---- تمدید
  await cust.click('text=تمدید'); await cust.waitForURL(/checkout\/\?plan=\d+&renew=\d+/);
  must(await cust.locator('h1:has-text("تمدید اشتراک")').count() === 1, 'renew checkout');
  await cust.check('input[name=agree]'); await cust.click('button:has-text("ثبت سفارش و پرداخت")');
  await cust.waitForURL(/mock/); await cust.click('#pay-ok'); await cust.waitForURL(/pay=ok/);
  await cust.goto(BASE + '/account/subscriptions/');
  const endAfter = await cust.locator('dd').nth(1).textContent();
  must(endBefore !== endAfter && await cust.locator('article').count() === 1, `renewal extended same subscription (${endBefore} → ${endAfter})`);

  // ---- انصراف از پرداخت
  await cust.goto(BASE + '/account/checkout/?product=limoc'); await cust.click('text=پایه'); await cust.waitForURL(/plan=/);
  await cust.check('input[name=agree]'); await cust.click('button:has-text("ثبت سفارش و پرداخت")');
  await cust.waitForURL(/mock/); await cust.click('#pay-cancel'); await cust.waitForURL(/pay=cancelled/);
  must(await cust.locator('text=پرداخت انجام نشد').count() === 1 && await cust.locator('button:has-text("تلاش دوباره")').count() === 1, 'cancelled payment → retry available');
  await cust.click('button:has-text("لغو سفارش")').catch(() => {});
  cust.once('dialog', (d) => d.accept());
  await cust.click('button:has-text("لغو سفارش")'); await cust.waitForLoadState('networkidle');
  must(await cust.locator('text=لغوشده').count() >= 1, 'pending order cancelled by customer');

  // ---- تیکت
  await cust.goto(BASE + '/account/tickets/new/');
  await cust.fill('input[name=subject]', 'راه‌اندازی فضای کاری'); await cust.fill('textarea[name=body]', 'لطفاً کاربر دوم را هم اضافه کنید.');
  await cust.click('button:has-text("ارسال")'); await cust.waitForURL(/tickets\/\d+\//); must(true, 'customer opened ticket');
  const ticketUrl = cust.url();
  await admin.goto(BASE + '/admin/tickets/'); await admin.click('text=راه‌اندازی فضای کاری');
  await admin.fill('textarea[name=body]', 'انجام شد؛ کاربر دوم اضافه شد.'); await admin.click('button:has-text("ارسال / ذخیره")');
  await admin.waitForSelector('text=پاسخ ارسال شد'); must(true, 'admin replied');
  await cust.goto(ticketUrl); must(await cust.locator('text=کاربر دوم اضافه شد').count() === 1 && await cust.locator('text=پاسخ داده شد').count() >= 1, 'customer sees staff reply');
  await shot(cust, 'ticket');

  // ---- پروفایل و صورت‌حساب رسمی
  await cust.goto(BASE + '/account/profile/');
  await cust.fill('input[name=company]', 'شرکت نمونه'); await cust.fill('input[name=nationalId]', '۱۰۱۰۰۰۰۰۰۰۱');
  await cust.click('button:has-text("ذخیره")'); await cust.waitForSelector('text=تغییرات ذخیره شد'); must(true, 'profile billing saved');

  // ---- زبان انگلیسی و عربی
  await cust.goto(BASE + '/en/account/');
  must(await cust.locator('html[lang=en][dir=ltr]').count() === 1 && await cust.locator('text=Active subscriptions').count() === 1, 'English account (ltr)');
  await shot(cust, 'dashboard-en');
  await cust.goto(BASE + '/ar/account/orders/'); must(await cust.locator('html[lang=ar][dir=rtl]').count() === 1 && await cust.locator('h1:has-text("الطلبات")').count() === 1, 'Arabic orders page');

  // ---- امنیت دسترسی
  await cust.goto(BASE + '/admin/'); must(cust.url().includes('/admin/login'), 'customer cannot open admin');
  const other = patch(await (await b.newContext()).newPage());
  await other.goto(orderUrl); must(other.url().includes('/account/login'), 'order page requires login');
  const res = await other.goto(BASE + '/account/login/?next=https://evil.example/');
  must(res.status() === 200, 'login page with external next renders (redirect sanitized server-side)');

  // ---- بازیابی رمز (کد از لاگ سرور)
  await other.goto(BASE + '/account/forgot/'); await other.fill('input[name=phone]', phone); await other.click('button[type=submit]');
  await other.waitForSelector('input[name=code]');
  await new Promise((r) => setTimeout(r, 300));
  const code = !LOG ? null : [...fs.readFileSync(LOG, 'utf8').matchAll(new RegExp(`\\[sms:otp\\] → ${phone}: (\\d{6})`, 'g'))].pop()?.[1];
  must(!!code, 'OTP sent (log driver)');
  await other.fill('input[name=code]', '000000'); await other.fill('input[name=password]', 'new-secret-456'); await other.click('button[type=submit]');
  await other.waitForSelector('text=کد تأیید نادرست'); must(true, 'wrong OTP rejected');
  await other.fill('input[name=code]', code); await other.click('button[type=submit]'); await other.waitForURL(BASE + '/account/');
  must(true, 'password reset + signed in');
  await cust.goto(BASE + '/account/'); must(cust.url().includes('/login'), 'other sessions revoked after reset');

  // ---- مدیر: پرداخت دستی
  await other.goto(BASE + '/account/checkout/?product=limoc'); await other.click('text=پایه'); await other.check('input[name=agree]');
  await other.click('button:has-text("ثبت سفارش و پرداخت")'); await other.waitForURL(/mock/);
  const oid = new URL(other.url()).searchParams.get('callback').match(/order=(\d+)/)[1];
  await admin.goto(`${BASE}/admin/orders/${oid}/`); await admin.selectOption('select[name=status]', 'paid'); await admin.click('button:has-text("ذخیره")');
  await admin.waitForSelector('text=ذخیره شد.'); await admin.reload();
  must(await admin.locator('text=اشتراک‌های ایجادشده').count() === 1, 'manual payment confirmation activated subscription');
  await shot(admin, 'admin-order');
  await admin.goto(BASE + '/admin/customers/'); await shot(admin, 'admin-customers');
  await admin.goto(BASE + '/admin/audit/'); must(await admin.locator('tbody tr').count() > 3, 'audit log records actions');

  console.log('page errors:', errs.length ? errs : 'none');
  await b.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
