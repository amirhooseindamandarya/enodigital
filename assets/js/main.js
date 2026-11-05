/* اِنو دیجیتال — اسکریپت‌های سایت */
(() => {
  "use strict";

  /* ---------- ماکاپ‌های محصولات (یک بار تعریف، همه‌جا استفاده) ---------- */
  const side = (name, color, items, on) => `
    <aside class="app-side" aria-hidden="true">
      <div class="app-brand"><i style="background:${color}"></i>${name}</div>
      ${items.map((t, i) => `<a class="${i === on ? "on" : ""}" style="${i === on ? `background:${color}` : ""}">${t}</a>`).join("")}
      <div class="skel" style="width:70%"></div><div class="skel" style="width:50%"></div><div class="skel" style="width:62%"></div>
    </aside>`;

  const MOCKS = {
    limoc: () => `
      ${side("لیموسی", "var(--limoc)", ["پیشخوان", "گزارش‌ها", "مشتریان", "تنظیمات"], 0)}
      <div class="app-main">
        <div class="app-top">
          <div><h4>پیشخوان</h4><span class="muted">خلاصهٔ عملکرد این هفته</span></div>
          <span class="mini-btn" style="background:var(--limoc)">+ مورد جدید</span>
        </div>
        <div class="kpis">
          <div class="kpi"><span>شاخص اول</span><b>۱٬۲۴۸</b><em>▲ ۱۲٪</em></div>
          <div class="kpi"><span>شاخص دوم</span><b>۸۶٪</b><em>▲ ۴٪</em></div>
          <div class="kpi"><span>شاخص سوم</span><b>۳۴۲</b><em>▲ ۹٪</em></div>
        </div>
        <div class="bars">${[38, 52, 46, 64, 58, 76, 70, 88, 81, 94].map((h, i) => `<i style="height:${h}%;animation-delay:${i * 60}ms"></i>`).join("")}</div>
        <div class="rows">
          <div class="row"><span>عنوان</span><span>تاریخ</span><span>وضعیت</span></div>
          <div class="row"><b>مورد نمونهٔ ۱</b><span>۱۴ آبان</span><span class="chip ok">تکمیل</span></div>
          <div class="row"><b>مورد نمونهٔ ۲</b><span>۱۴ آبان</span><span class="chip wait">در جریان</span></div>
        </div>
      </div>`,

    jet: () => `
      ${side("لیموجت", "var(--jet)", ["فروشگاه", "سفارش‌ها", "تخفیف‌ها", "آدرس‌ها"], 0)}
      <div class="app-main">
        <div class="app-top">
          <span class="search">جست‌وجوی کالا…</span>
          <span class="chip info">🛵 ارسال امروز</span>
        </div>
        <div class="cats"><span class="on">میوه و سبزی</span><span>لبنیات</span><span>پروتئینی</span><span>نان و غلات</span><span>خشکبار</span></div>
        <div class="shop">
          <div class="goods">
            ${[["🍋", "لیموترش تازه", "۸۹٬۰۰۰", "#fff7d6"], ["🍅", "گوجه‌فرنگی", "۴۲٬۰۰۰", "#ffe4e1"], ["🥒", "خیار گلخانه‌ای", "۳۸٬۰۰۰", "#e7f8e9"],
               ["🍎", "سیب قرمز", "۶۵٬۰۰۰", "#ffe8e8"], ["🥛", "شیر کم‌چرب", "۳۲٬۰۰۰", "#eef4ff"], ["🧀", "پنیر سفید", "۹۸٬۰۰۰", "#fff6e5"]]
              .map(([e, n, p, bg]) => `<div class="good"><div class="ph" style="background:${bg}">${e}</div><b>${n}</b><div class="pr"><span>${p} ت</span><span class="add">+</span></div></div>`).join("")}
          </div>
          <div class="cart">
            <h5>🧺 سبد خرید</h5>
            <div class="li"><span>لیموترش × ۲</span><span>۱۷۸٬۰۰۰</span></div>
            <div class="li"><span>خیار × ۱</span><span>۳۸٬۰۰۰</span></div>
            <div class="li"><span>شیر × ۳</span><span>۹۶٬۰۰۰</span></div>
            <hr><div class="li"><span>هزینهٔ ارسال</span><span>رایگان</span></div>
            <div class="total"><span>جمع</span><span>۳۱۲٬۰۰۰ ت</span></div>
            <span class="mini-btn" style="background:var(--jet);text-align:center">ثبت سفارش</span>
          </div>
        </div>
      </div>`,

    refah: () => `
      ${side("رفاه سازمانی", "var(--refah)", ["کیف اعتبار", "خدمات رفاهی", "درخواست‌ها", "گزارش منابع انسانی"], 0)}
      <div class="app-main">
        <div class="app-top">
          <div><h4>سلام، همکار گرامی 👋</h4><span class="muted">اعتبار رفاهی سال ۱۴۰۵</span></div>
          <span class="chip gray">واحد منابع انسانی</span>
        </div>
        <div class="wallet">
          <div><span>اعتبار باقی‌مانده</span><b>۱۸٬۶۰۰٬۰۰۰ ریال</b><div class="meter"><i></i></div></div>
          <span class="mini-btn" style="background:rgba(255,255,255,.22)">استفاده از اعتبار</span>
        </div>
        <div class="services">
          <div class="svc"><i>🛡️</i>بیمه تکمیلی</div>
          <div class="svc"><i>💳</i>وام و تسهیلات</div>
          <div class="svc"><i>🛒</i>خرید با تخفیف</div>
          <div class="svc"><i>✈️</i>سفر و اقامت</div>
          <div class="svc"><i>🏋️</i>ورزش و سلامت</div>
        </div>
        <div class="rows">
          <div class="row"><span>درخواست</span><span>تاریخ</span><span>وضعیت</span></div>
          <div class="row"><b>تسهیلات قرض‌الحسنه</b><span>۱۲ آبان</span><span class="chip ok">تأیید شد</span></div>
          <div class="row"><b>بلیت سفر مشهد</b><span>۱۰ آبان</span><span class="chip wait">در انتظار</span></div>
        </div>
      </div>`,
  };

  document.querySelectorAll("[data-mock]").forEach((el) => {
    const fn = MOCKS[el.dataset.mock];
    if (fn) el.innerHTML = fn();
  });

  /* ---------- هدر ---------- */
  const header = document.querySelector(".site-header");
  const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const burger = document.querySelector(".burger");
  if (burger) {
    burger.addEventListener("click", () => {
      const open = document.body.classList.toggle("nav-open");
      burger.setAttribute("aria-expanded", String(open));
    });
    document.querySelectorAll(".nav-links a").forEach((a) =>
      a.addEventListener("click", () => {
        document.body.classList.remove("nav-open");
        burger.setAttribute("aria-expanded", "false");
      })
    );
  }
  document.querySelectorAll(".has-menu > button").forEach((btn) =>
    btn.addEventListener("click", () => {
      const li = btn.parentElement;
      const open = li.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    })
  );

  /* ---------- تب‌های هیرو ---------- */
  const tabs = document.querySelectorAll(".tab");
  let auto;
  const select = (tab) => {
    tabs.forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
    document.querySelectorAll(".hero-stage .app").forEach((p) => p.classList.toggle("active", p.id === tab.getAttribute("aria-controls")));
  };
  tabs.forEach((t) => t.addEventListener("click", () => { clearInterval(auto); select(t); }));
  if (tabs.length && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let i = 0;
    auto = setInterval(() => { i = (i + 1) % tabs.length; select(tabs[i]); }, 6000);
  }

  /* ---------- نمایش هنگام اسکرول ---------- */
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12 })
    : null;
  document.querySelectorAll(".reveal").forEach((el) => (io ? io.observe(el) : el.classList.add("in")));

  /* ---------- مسیر خط‌چین بین فصل‌ها ---------- */
  const journey = document.querySelector(".journey");
  const drawPath = () => {
    if (!journey) return;
    const holder = journey.querySelector(".journey-path");
    const nodes = [...journey.querySelectorAll(".ch-node")];
    if (!holder || nodes.length < 2 || getComputedStyle(holder).display === "none") return;
    const box = journey.getBoundingClientRect();
    const pts = nodes.map((n) => {
      const r = n.getBoundingClientRect();
      const ch = n.closest(".chapter").getBoundingClientRect();
      return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top, top: ch.top - box.top, bottom: ch.bottom - box.top, c: getComputedStyle(n).color };
    });
    const R = 48;
    let d = `M ${pts[0].x} 0 L ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i];
      const gy = (a.bottom + b.top) / 2, s = Math.sign(b.x - a.x) || 1;
      d += ` L ${a.x} ${gy - R} Q ${a.x} ${gy} ${a.x + s * R} ${gy} L ${b.x - s * R} ${gy} Q ${b.x} ${gy} ${b.x} ${gy + R} L ${b.x} ${b.y}`;
    }
    const last = pts[pts.length - 1];
    d += ` L ${last.x} ${box.height}`;
    const stops = pts.map((p, i) => `<stop offset="${(p.y / box.height) * 100}%" stop-color="${p.c}"/>`).join("");
    holder.innerHTML = `<svg width="${box.width}" height="${box.height}" viewBox="0 0 ${box.width} ${box.height}" fill="none" aria-hidden="true">
      <defs><linearGradient id="jg" x1="0" y1="0" x2="0" y2="${box.height}" gradientUnits="userSpaceOnUse">${stops}</linearGradient></defs>
      <path d="${d}" stroke="#cdd3e2" stroke-width="2" stroke-dasharray="2 7" stroke-linecap="round"/>
      <path class="jp" d="${d}" stroke="url(#jg)" stroke-width="3" stroke-linecap="round"/>
    </svg>`;
    const p = holder.querySelector(".jp");
    const len = p.getTotalLength();
    p.style.strokeDasharray = len;
    const update = () => {
      const r = journey.getBoundingClientRect();
      const prog = Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height));
      p.style.strokeDashoffset = len * (1 - prog);
    };
    update();
    window.removeEventListener("scroll", journey._upd);
    journey._upd = update;
    window.addEventListener("scroll", update, { passive: true });
  };
  if (journey) {
    window.addEventListener("load", drawPath);
    let t;
    window.addEventListener("resize", () => { clearTimeout(t); t = setTimeout(drawPath, 150); });
    drawPath();
  }

  /* ---------- فرم تماس ---------- */
  // TODO: اتصال به بک‌اند/سرویس ارسال فرم. فعلاً فقط پیام موفقیت نمایش داده می‌شود.
  document.querySelectorAll("form.form").forEach((f) =>
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!f.reportValidity()) return;
      f.querySelector(".form-note")?.classList.add("show");
      f.reset();
    })
  );

  /* ---------- سال جاری در فوتر ---------- */
  const y = document.querySelector("[data-year]");
  if (y) y.textContent = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric" }).format(new Date());
})();
