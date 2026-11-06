/* اِنو دیجیتال — اسکریپت‌های سایت (بدون وابستگی خارجی) */
(() => {
  "use strict";
  document.documentElement.classList.remove("no-js");

  /* هدر: خط زیرین هنگام اسکرول */
  const header = document.querySelector(".site-header");
  const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 4);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* منوی موبایل */
  const burger = document.querySelector(".burger");
  const closeNav = () => {
    document.body.classList.remove("nav-open");
    burger && burger.setAttribute("aria-expanded", "false");
  };
  if (burger) {
    burger.addEventListener("click", () => {
      const open = document.body.classList.toggle("nav-open");
      burger.setAttribute("aria-expanded", String(open));
    });
    document.querySelectorAll(".nav-links a").forEach((a) => a.addEventListener("click", closeNav));
    addEventListener("keydown", (e) => e.key === "Escape" && closeNav());
  }

  /* نمایش نرم هنگام اسکرول */
  const items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add("in"));
  }

  /* فرم درخواست دمو
     TODO: اتصال به بک‌اند یا سرویس ارسال فرم. فعلاً فقط پیام تأیید نمایش داده می‌شود. */
  document.querySelectorAll("form.form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      form.querySelector(".form-note")?.classList.add("show");
      form.reset();
    });
  });

  /* سال شمسی در فوتر */
  document.querySelectorAll("[data-year]").forEach((el) => {
    try { el.textContent = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric" }).format(new Date()); } catch (_) {}
  });
})();
