/**
 * فایل شروع برنامه در cPanel (Setup Node.js App → Application startup file: app.js)
 *  ۱. همهٔ خروجی‌ها را در logs/app.log (کنار همین فایل) هم می‌نویسد
 *  ۲. تنظیمات را از .env می‌خواند
 *  ۳. نسخهٔ Node.js و فایل‌ها را بررسی می‌کند
 *  ۴. جدول‌های پایگاه داده را می‌سازد/به‌روز می‌کند
 *  ۵. سرور سایت را اجرا می‌کند
 * اگر برنامه نتواند شروع شود، به‌جای خطای ۵۰۰ علت را در مرورگر نشان می‌دهد.
 */
const fs = require("fs");
const path = require("path");
const http = require("http");

/* ---------------- لاگ در فایل ---------------- */
const LOG_DIR = path.join(__dirname, "logs");
const LOG_FILE = path.join(LOG_DIR, "app.log");
try {
  fs.mkdirSync(LOG_DIR, { recursive: true });
  // بزرگ‌تر از ۵ مگابایت: نسخهٔ قبلی نگه داشته و فایل تازه شروع می‌شود
  if (fs.existsSync(LOG_FILE) && fs.statSync(LOG_FILE).size > 5 * 1024 * 1024) fs.renameSync(LOG_FILE, LOG_FILE + ".old");
} catch {}
const stamp = () => new Date().toISOString().replace("T", " ").slice(0, 19);
for (const stream of [process.stdout, process.stderr]) {
  const write = stream.write.bind(stream);
  stream.write = (chunk, ...rest) => {
    try { fs.appendFileSync(LOG_FILE, String(chunk).split("\n").map((l) => (l ? `[${stamp()}] ${l}` : l)).join("\n")); } catch {}
    return write(chunk, ...rest);
  };
}
process.on("uncaughtException", (e) => console.error("[uncaught]", e && e.stack ? e.stack : e));
process.on("unhandledRejection", (e) => console.error("[unhandled]", e && e.stack ? e.stack : e));
console.log(`---- شروع برنامه · Node ${process.version} · ${process.platform} · pid ${process.pid}`);

/* ---------------- نمایش خطا در مرورگر ---------------- */
function showProblem(title, steps, detail) {
  console.error(`[startup] ${title}${detail ? `\n${detail}` : ""}`);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const html = `<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>برنامه اجرا نشد</title>
<style>body{font-family:Tahoma,system-ui,sans-serif;background:#f6f7fb;color:#14213d;margin:0;padding:24px}main{max-width:720px;margin:40px auto;background:#fff;border:1px solid #e5e7ef;border-radius:20px;padding:28px}h1{font-size:20px;line-height:1.8;margin:6px 0 16px}p.k{color:#c8333a;font-weight:bold;font-size:13px;margin:0}ol{line-height:2}pre{direction:ltr;text-align:left;background:#f6f7fb;border-radius:12px;padding:12px;white-space:pre-wrap;word-break:break-word;font-size:12.5px;max-height:320px;overflow:auto}small{color:#667}</style></head>
<body><main><p class="k">سایت اِنو دیجیتال اجرا نشد</p><h1>${esc(title)}</h1><ol>${steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
${detail ? `<pre>${esc(detail)}</pre>` : ""}<small>پس از رفع مشکل، در Setup Node.js App روی Restart بزنید. گزارش کامل: ${esc(LOG_FILE)}</small></main></body></html>`;
  // همان پورتی که سرور اصلی باید روی آن اجرا می‌شد (cPanel/Passenger آن را تعیین می‌کند)
  http.createServer((_, res) => { res.writeHead(503, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" }); res.end(html); })
    .listen(process.env.PORT || 3000, () => console.error("[startup] صفحهٔ راهنمای خطا در حال نمایش است"));
}

/* ---------------- تنظیمات ---------------- */
const envFile = path.join(__dirname, ".env");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!m || line.trim().startsWith("#")) continue;
    let v = m[2];
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (process.env[m[1]] === undefined) process.env[m[1]] = v;
  }
  console.log("[startup] تنظیمات از .env خوانده شد");
} else {
  console.log("[startup] فایل .env پیدا نشد (از Environment variables استفاده می‌شود)");
}
process.env.NODE_ENV = "production";
process.env.NEXT_TELEMETRY_DISABLED = "1";
if (!process.env.HOSTNAME || !/^[\d.:]+$|^localhost$/.test(process.env.HOSTNAME)) process.env.HOSTNAME = "0.0.0.0";

(async () => {
  /* ---------------- بررسی‌های پیش از شروع ---------------- */
  const [maj, min] = process.versions.node.split(".").map(Number);
  if (maj < 18 || (maj === 18 && min < 18)) {
    return showProblem(`نسخهٔ Node.js (${process.version}) قدیمی است؛ دست‌کم ۱۸٫۱۸ لازم است.`, [
      "در cPanel به Setup Node.js App بروید و روی ویرایش (مداد) برنامه بزنید.",
      "در «Node.js version» بالاترین نسخه (۲۰ یا ۲۲) را انتخاب کنید و Save کنید.",
      "روی Restart بزنید.",
    ]);
  }
  const server = path.join(__dirname, "server", "server.js");
  if (!fs.existsSync(server) || !fs.existsSync(path.join(__dirname, "server", ".next"))) {
    return showProblem("فایل‌های برنامه کامل نیستند (پوشهٔ server ناقص است).", [
      "فایل zip را دوباره آپلود و در همان پوشه Extract کنید (گزینهٔ جایگزینی فایل‌ها).",
      "مطمئن شوید Application root در Setup Node.js App دقیقاً پوشه‌ای است که app.js در آن است.",
    ]);
  }
  if (!process.env.DATABASE_URL) {
    console.error("[startup] DATABASE_URL تنظیم نشده است؛ سایت بالا می‌آید ولی حساب کاربری و پنل مدیریت کار نمی‌کنند. فایل .env.example را به .env تغییر نام دهید و پر کنید.");
  } else {
    try {
      const { setupDatabase } = await import("./server/scripts/db-setup.mjs");
      await setupDatabase({ log: (m) => console.log("[setup]", m) });
    } catch (e) {
      console.error("[setup] آماده‌سازی پایگاه داده ناموفق بود:", e && (e.code || e.message) ? `${e.code ?? ""} ${e.message}` : e);
      console.error("[setup] سایت بالا می‌آید؛ علت را در /admin/ هم می‌بینید.");
    }
  }

  /* ---------------- شروع سرور ---------------- */
  try {
    require(server);
    console.log("[startup] سرور سایت اجرا شد");
  } catch (e) {
    const detail = e && e.stack ? e.stack.split("\n").slice(0, 12).join("\n") : String(e);
    const mem = /memory|ENOMEM|heap/i.test(detail);
    showProblem(mem ? "حافظهٔ کافی برای اجرای برنامه نیست." : "سرور سایت هنگام شروع با خطا متوقف شد.", mem
      ? ["از پشتیبانی هاست بخواهید سهمیهٔ حافظهٔ (RAM) حساب را دست‌کم به ۱ گیگابایت برسانند.", "سپس Restart بزنید."]
      : ["متن خطای زیر را برای پشتیبانی فنی بفرستید.", "اگر تازه به‌روزرسانی کرده‌اید، zip را دوباره کامل Extract کنید و Restart بزنید."], detail);
  }
})();
