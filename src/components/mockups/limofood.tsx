import { cn } from "@/lib/utils";
import storeImg from "@/assets/screens/limofood-store.webp";
import menuImg from "@/assets/screens/limofood-menu.webp";

/** تصاویر واقعی LimoFood (صفحهٔ فروشگاه نمونه روی پلتفرم) */
export const limofoodScreens = {
  store: { src: storeImg, alt: "صفحهٔ فروشگاه در LimoFood: بنر فروشگاه، اطلاعات، منوی فروشگاه و دسته‌بندی محصولات" },
  menu: { src: menuImg, alt: "منوی آنلاین فروشگاه در LimoFood: دسته‌بندی محصولات، قیمت‌ها و افزودن به سبد" },
};

/**
 * ماکاپ‌های مفهومی LimoFood (منوی موبایلی، کارت سفارش، تابلوی عملیات).
 * TODO: اسکرین‌شات واقعی پنل مدیریت سفارش‌ها و منوی موبایل جایگزین شود.
 */
const items = [
  { n: "برگر کلاسیک", d: "گوشت گوساله، پنیر چدار، سس مخصوص", p: "۳۸۵٬۰۰۰", c: "from-[#ffe2b8] to-[#ffc98a]" },
  { n: "پاستا آلفردو", d: "مرغ، قارچ، سس خامه", p: "۳۲۰٬۰۰۰", c: "from-[#fff1c7] to-[#ffe08a]" },
  { n: "سالاد سزار", d: "کاهو، مرغ گریل، نان تست", p: "۲۴۵٬۰۰۰", c: "from-[#e5f6d8] to-[#c6eaa8]" },
  { n: "لیموناد تازه", d: "لیمو، نعناع", p: "۹۵٬۰۰۰", c: "from-[#fff7c2] to-[#ffe96e]" },
];

export function LimoFoodMenu({ className }: { className?: string }) {
  return (
    <div className={cn("bg-[#fffaf1] pb-3 text-[11px] leading-5 text-ink", className)} aria-hidden>
      <div className="bg-gradient-to-b from-[#ffca52] to-[#ffb648] px-4 pb-4 pt-9">
        <div className="flex items-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-xl bg-white text-[16px] font-black text-sun-700 shadow-sm">ر</span>
          <div>
            <p className="text-[14px] font-extrabold text-navy">رستوران نمونه</p>
            <p className="text-[10px] text-navy/70">باز است · ارسال با پیک</p>
          </div>
        </div>
      </div>
      <div className="-mt-3 mx-3 flex gap-1.5 overflow-hidden rounded-xl bg-white p-1.5 shadow-sm">
        {["پرفروش‌ها", "غذای اصلی", "سالاد", "نوشیدنی"].map((c, i) => (
          <span key={c} className={cn("shrink-0 rounded-lg px-2.5 py-1 text-[10.5px] font-semibold", i === 0 ? "bg-navy text-white" : "text-ink-2")}>{c}</span>
        ))}
      </div>
      <div className="mt-3 space-y-2 px-3">
        {items.map((it, i) => (
          <div key={it.n} className="flex gap-2.5 rounded-xl bg-white p-2 shadow-[0_1px_2px_rgb(0_0_0/0.04)]">
            <div className={cn("size-14 shrink-0 rounded-lg bg-gradient-to-br", it.c)} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-extrabold">{it.n}</p>
              <p className="truncate text-[9.5px] text-ink-3">{it.d}</p>
              <div className="mt-1 flex items-center justify-between">
                <span className="font-bold">{it.p} <span className="text-[9px] font-normal text-ink-3">تومان</span></span>
                {i === 0 ? (
                  <span className="flex items-center gap-1.5 rounded-lg bg-sun/25 px-1.5 font-bold text-sun-700"><b>−</b>۱<b>+</b></span>
                ) : (
                  <span className="grid size-6 place-items-center rounded-lg bg-navy text-[13px] font-bold text-white">+</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mx-3 mt-3 flex items-center justify-between rounded-xl bg-navy px-3 py-2.5 text-white">
        <span className="font-bold">مشاهدهٔ سبد · ۱ قلم</span>
        <span className="font-extrabold">۳۸۵٬۰۰۰ ت</span>
      </div>
    </div>
  );
}

export function OrderCard({ className, status = "new" }: { className?: string; status?: "new" | "prep" | "send" }) {
  const s = {
    new: { t: "سفارش جدید", c: "bg-sun/25 text-sun-700" },
    prep: { t: "در حال آماده‌سازی", c: "bg-indigo/10 text-indigo" },
    send: { t: "ارسال با پیک", c: "bg-teal/12 text-teal-700" },
  }[status];
  return (
    <div className={cn("rounded-2xl border border-line bg-white p-3.5 text-[11.5px] leading-6 text-ink", className)} aria-hidden>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[13px] font-extrabold">سفارش #۲۱۸</p>
        <span className={cn("rounded-full px-2 text-[10px] font-bold", s.c)}>{s.t}</span>
      </div>
      <div className="space-y-0.5 text-ink-2">
        <p className="flex justify-between"><span>برگر کلاسیک × ۲</span><span>۷۷۰٬۰۰۰</span></p>
        <p className="flex justify-between"><span>لیموناد تازه × ۱</span><span>۹۵٬۰۰۰</span></p>
        <p className="flex justify-between text-teal-700"><span>کد تخفیف</span><span>−۵۰٬۰۰۰</span></p>
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-dashed border-line-2 pt-2">
        <span className="text-ink-3">پرداخت آنلاین</span>
        <span className="text-[13px] font-extrabold">۸۱۵٬۰۰۰ ت</span>
      </div>
    </div>
  );
}

const cols = [
  { t: "جدید", c: "bg-sun", orders: [["#۲۱۸", "۲ قلم · پرداخت شد"], ["#۲۱۹", "۴ قلم · پرداخت شد"]] },
  { t: "آماده‌سازی", c: "bg-indigo", orders: [["#۲۱۵", "۳ قلم"], ["#۲۱۶", "۱ قلم"], ["#۲۱۷", "۲ قلم"]] },
  { t: "ارسال", c: "bg-teal", orders: [["#۲۱۲", "پیک: علی"], ["#۲۱۳", "پیک: رضا"]] },
  { t: "تحویل‌شده", c: "bg-ink-3", orders: [["#۲۱۰", "۱۲:۴۰"], ["#۲۱۱", "۱۲:۵۵"]] },
];

export function LimoFoodBoard({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white p-3.5 text-[11px] leading-5 text-ink", className)} aria-hidden>
      <div className="mb-3 flex items-center justify-between">
        <div><p className="text-[13px] font-extrabold">سفارش‌های امروز</p><p className="text-[10px] text-ink-3">به‌روزرسانی خودکار</p></div>
        <div className="flex gap-1.5">
          {[["فروش امروز", "۱۸٫۴ م"], ["سفارش", "۴۶"]].map(([k, v]) => (
            <span key={k} className="rounded-lg border border-line px-2 py-1 text-[10px] text-ink-3">{k} <b className="text-ink">{v}</b></span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {cols.map((c) => (
          <div key={c.t} className="rounded-lg bg-paper p-1.5">
            <p className="mb-1.5 flex items-center gap-1.5 px-1 text-[10px] font-bold text-ink-2"><i className={cn("size-1.5 rounded-full", c.c)} />{c.t}</p>
            {c.orders.map(([id, m]) => (
              <div key={id} className="mb-1.5 rounded-md border border-line bg-white p-1.5">
                <p className="text-[10.5px] font-bold">{id}</p>
                <p className="truncate text-[9.5px] text-ink-3">{m}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
