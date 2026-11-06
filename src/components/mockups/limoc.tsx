import { cn } from "@/lib/utils";

/**
 * ماکاپ مفهومی داشبورد Limoc.
 * TODO: پس از دریافت اسکرین‌شات واقعی از محیط Limoc جایگزین شود.
 */
const stages = [
  { name: "سرنخ", count: "۱۲", deals: [{ t: "شرکت نمونه الف", v: "پیگیری تلفنی", w: 70 }, { t: "استودیو نمونه", v: "جلسهٔ معرفی", w: 45 }] },
  { name: "پیش‌فاکتور", count: "۷", deals: [{ t: "گروه نمونه ب", v: "ارسال شد", w: 60 }, { t: "مشاورین نمونه", v: "در انتظار پاسخ", w: 35 }] },
  { name: "مذاکره", count: "۴", deals: [{ t: "شرکت نمونه ج", v: "جلسهٔ دوم", w: 80 }] },
  { name: "قرارداد", count: "۳", deals: [{ t: "هلدینگ نمونه", v: "امضا شد", w: 100 }] },
];

export function LimocDashboard({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn("flex bg-white text-[11px] leading-5 text-ink", className)} aria-hidden>
      {!compact && (
        <aside className="hidden w-[132px] shrink-0 border-e border-line bg-paper p-3 sm:block">
          <div className="mb-4 flex items-center gap-1.5 font-extrabold text-[12px]"><i className="size-4 rounded-md bg-indigo" />Limoc</div>
          {["داشبورد", "مشتریان", "قیف فروش", "پیش‌فاکتورها", "پروژه‌ها", "تیکت‌ها", "گزارش‌ها"].map((x, i) => (
            <div key={x} className={cn("mb-0.5 rounded-md px-2 py-1", i === 2 ? "bg-indigo text-white" : "text-ink-2")}>{x}</div>
          ))}
        </aside>
      )}
      <div className="min-w-0 flex-1 p-3.5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[13px] font-extrabold">قیف فروش</p>
            <p className="text-[10px] text-ink-3">فرصت‌های فعال این ماه</p>
          </div>
          <span className="rounded-md bg-indigo px-2 py-1 text-[10px] font-bold text-white">+ فرصت جدید</span>
        </div>
        <div className="mb-3 grid grid-cols-3 gap-2">
          {[["فرصت‌های باز", "۲۶"], ["پیگیری امروز", "۸"], ["تیکت باز", "۵"]].map(([k, v]) => (
            <div key={k} className="rounded-lg border border-line p-2">
              <p className="text-[9.5px] text-ink-3">{k}</p>
              <p className="text-[15px] font-extrabold">{v}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {stages.map((s, si) => (
            <div key={s.name} className="rounded-lg bg-paper p-1.5">
              <div className="mb-1.5 flex items-center justify-between px-1 text-[10px] font-bold text-ink-2">
                <span>{s.name}</span><span className="rounded bg-white px-1 text-ink-3">{s.count}</span>
              </div>
              {s.deals.map((d) => (
                <div key={d.t} className="mb-1.5 rounded-md border border-line bg-white p-1.5 shadow-[0_1px_0_rgb(0_0_0/0.02)]">
                  <p className="truncate text-[10px] font-bold">{d.t}</p>
                  <p className="truncate text-[9px] text-ink-3">{d.v}</p>
                  <div className="mt-1 h-1 rounded-full bg-line"><div className={cn("h-1 rounded-full", si === 3 ? "bg-teal" : "bg-indigo")} style={{ width: `${d.w}%` }} /></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LimocCustomer({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white p-4 text-[11.5px] leading-6 text-ink", className)} aria-hidden>
      <div className="mb-3 flex items-center gap-2.5">
        <span className="grid size-9 place-items-center rounded-full bg-indigo/10 font-bold text-indigo">ن</span>
        <div><p className="text-[13px] font-extrabold">شرکت نمونه الف</p><p className="text-[10px] text-ink-3">مشتری · کارشناس: تیم فروش</p></div>
      </div>
      {[["تماس تلفنی", "دیروز", "معرفی خدمات و ارسال کاتالوگ"], ["جلسه", "امروز ۱۰:۰۰", "بررسی نیاز و دامنهٔ پروژه"], ["یادآوری", "فردا", "ارسال پیش‌فاکتور"]].map(([t, d, n], i) => (
        <div key={t} className="relative flex gap-3 pb-3 ps-1">
          <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", i === 2 ? "bg-sun" : "bg-indigo")} />
          <div><p className="font-bold">{t} <span className="font-normal text-ink-3">· {d}</span></p><p className="text-[10.5px] text-ink-2">{n}</p></div>
        </div>
      ))}
    </div>
  );
}

export function LimocTicket({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white p-4 text-[11.5px] leading-6 text-ink", className)} aria-hidden>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[13px] font-extrabold">تیکت #۱۰۴۲</p>
        <span className="rounded-full bg-sun/20 px-2 text-[10px] font-bold text-sun-700">اولویت بالا</span>
      </div>
      <p className="text-ink-2">مشکل در دسترسی کاربر جدید</p>
      <div className="mt-3 rounded-lg bg-paper p-2.5">
        <div className="mb-1 flex justify-between text-[10px] text-ink-3"><span>زمان باقی‌مانده تا SLA</span><span className="font-bold text-ink">۲ ساعت</span></div>
        <div className="h-1.5 rounded-full bg-line"><div className="h-1.5 w-2/3 rounded-full bg-indigo" /></div>
      </div>
    </div>
  );
}
