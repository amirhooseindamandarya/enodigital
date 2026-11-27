import { cn } from "@/lib/utils";
import type { Locale } from "@/cms/types";

/** ماکاپ‌های تزئینی لیموفود (منوی موبایل، کارت سفارش، تابلوی عملیات) به سه زبان */
const T = {
  fa: {
    store: "رستوران نمونه", open: "باز است · ارسال با پیک", initial: "ر", cur: "تومان", curShort: "ت",
    cats: ["پرفروش‌ها", "غذای اصلی", "سالاد", "نوشیدنی"], cart: "مشاهدهٔ سبد · ۱ قلم",
    items: [["برگر کلاسیک", "گوشت گوساله، پنیر چدار، سس مخصوص", "۳۸۵٬۰۰۰"], ["پاستا آلفردو", "مرغ، قارچ، سس خامه", "۳۲۰٬۰۰۰"], ["سالاد سزار", "کاهو، مرغ گریل، نان تست", "۲۴۵٬۰۰۰"], ["لیموناد تازه", "لیمو، نعناع", "۹۵٬۰۰۰"]],
    order: "سفارش #۲۱۸", lines: [["برگر کلاسیک × ۲", "۷۷۰٬۰۰۰"], ["لیموناد تازه × ۱", "۹۵٬۰۰۰"], ["کد تخفیف", "−۵۰٬۰۰۰"]], paid: "پرداخت آنلاین", total: "۸۱۵٬۰۰۰",
    status: { new: "سفارش جدید", prep: "در حال آماده‌سازی", send: "ارسال با پیک" },
    board: "سفارش‌های امروز", auto: "به‌روزرسانی خودکار", kpis: [["فروش امروز", "۱۸٫۴ م"], ["سفارش", "۴۶"]],
    cols: [["جدید", [["#۲۱۸", "۲ قلم · پرداخت شد"], ["#۲۱۹", "۴ قلم · پرداخت شد"]]], ["آماده‌سازی", [["#۲۱۵", "۳ قلم"], ["#۲۱۶", "۱ قلم"], ["#۲۱۷", "۲ قلم"]]], ["ارسال", [["#۲۱۲", "پیک: علی"], ["#۲۱۳", "پیک: رضا"]]], ["تحویل‌شده", [["#۲۱۰", "۱۲:۴۰"], ["#۲۱۱", "۱۲:۵۵"]]]],
  },
  en: {
    store: "Sample Kitchen", open: "Open · Delivery available", initial: "S", cur: "", curShort: "",
    cats: ["Popular", "Mains", "Salads", "Drinks"], cart: "View cart · 1 item",
    items: [["Classic burger", "Beef, cheddar, house sauce", "$14.50"], ["Pasta Alfredo", "Chicken, mushroom, cream", "$12.90"], ["Caesar salad", "Lettuce, grilled chicken, croutons", "$9.80"], ["Fresh lemonade", "Lemon, mint", "$3.90"]],
    order: "Order #218", lines: [["Classic burger × 2", "$29.00"], ["Fresh lemonade × 1", "$3.90"], ["Discount code", "−$2.00"]], paid: "Paid online", total: "$30.90",
    status: { new: "New order", prep: "Preparing", send: "Out for delivery" },
    board: "Today’s orders", auto: "Live updates", kpis: [["Sales today", "$1.8k"], ["Orders", "46"]],
    cols: [["New", [["#218", "2 items · paid"], ["#219", "4 items · paid"]]], ["Preparing", [["#215", "3 items"], ["#216", "1 item"], ["#217", "2 items"]]], ["Delivery", [["#212", "Courier: Ali"], ["#213", "Courier: Reza"]]], ["Delivered", [["#210", "12:40"], ["#211", "12:55"]]]],
  },
  ar: {
    store: "مطعم نموذجي", open: "مفتوح · التوصيل متاح", initial: "م", cur: "ر.س", curShort: "ر.س",
    cats: ["الأكثر طلباً", "أطباق رئيسية", "سلطات", "مشروبات"], cart: "عرض السلة · صنف واحد",
    items: [["برغر كلاسيك", "لحم بقري، جبن شيدر، صلصة خاصة", "54"], ["باستا ألفريدو", "دجاج، فطر، صلصة كريمة", "48"], ["سلطة سيزر", "خس، دجاج مشوي، خبز محمص", "36"], ["ليموناضة طازجة", "ليمون، نعناع", "15"]],
    order: "الطلب #218", lines: [["برغر كلاسيك × 2", "108"], ["ليموناضة طازجة × 1", "15"], ["رمز خصم", "−8"]], paid: "دفع إلكتروني", total: "115",
    status: { new: "طلب جديد", prep: "قيد التحضير", send: "قيد التوصيل" },
    board: "طلبات اليوم", auto: "تحديث تلقائي", kpis: [["مبيعات اليوم", "6.9 ألف"], ["الطلبات", "46"]],
    cols: [["جديد", [["#218", "صنفان · مدفوع"], ["#219", "4 أصناف · مدفوع"]]], ["التحضير", [["#215", "3 أصناف"], ["#216", "صنف واحد"], ["#217", "صنفان"]]], ["التوصيل", [["#212", "المندوب: علي"], ["#213", "المندوب: رضا"]]], ["تم التسليم", [["#210", "12:40"], ["#211", "12:55"]]]],
  },
} as const;

const swatches = ["from-[#ffe2b8] to-[#ffc98a]", "from-[#fff1c7] to-[#ffe08a]", "from-[#e5f6d8] to-[#c6eaa8]", "from-[#fff7c2] to-[#ffe96e]"];

export function LimoFoodMenu({ className, locale = "fa" }: { className?: string; locale?: Locale }) {
  const d = T[locale];
  return (
    <div className={cn("bg-[#fffaf1] pb-3 text-[11px] leading-5 text-ink", className)} aria-hidden>
      <div className="bg-gradient-to-b from-[#d7193a] to-[#b3102b] px-4 pb-4 pt-9">
        <div className="flex items-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-xl bg-white text-[16px] font-black text-sun-700 shadow-sm">{d.initial}</span>
          <div>
            <p className="text-[14px] font-extrabold text-white">{d.store}</p>
            <p className="text-[10px] text-white/75">{d.open}</p>
          </div>
        </div>
      </div>
      <div className="-mt-3 mx-3 flex gap-1.5 overflow-hidden rounded-xl bg-white p-1.5 shadow-sm">
        {d.cats.map((c, i) => <span key={c} className={cn("shrink-0 rounded-lg px-2.5 py-1 text-[10.5px] font-semibold", i === 0 ? "bg-navy text-white" : "text-ink-2")}>{c}</span>)}
      </div>
      <div className="mt-3 space-y-2 px-3">
        {d.items.map(([n, desc, p], i) => (
          <div key={n} className="flex gap-2.5 rounded-xl bg-white p-2 shadow-[0_1px_2px_rgb(0_0_0/0.04)]">
            <div className={cn("size-14 shrink-0 rounded-lg bg-gradient-to-br", swatches[i])} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-extrabold">{n}</p>
              <p className="truncate text-[9.5px] text-ink-3">{desc}</p>
              <div className="mt-1 flex items-center justify-between">
                <span className="font-bold">{p} {d.cur && <span className="text-[9px] font-normal text-ink-3">{d.cur}</span>}</span>
                {i === 0 ? <span className="flex items-center gap-1.5 rounded-lg bg-sun/25 px-1.5 font-bold text-sun-700"><b>−</b>1<b>+</b></span>
                  : <span className="grid size-6 place-items-center rounded-lg bg-navy text-[13px] font-bold text-white">+</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mx-3 mt-3 flex items-center justify-between rounded-xl bg-navy px-3 py-2.5 text-white">
        <span className="font-bold">{d.cart}</span>
        <span className="font-extrabold">{d.items[0][2]} {d.curShort}</span>
      </div>
    </div>
  );
}

export function OrderCard({ className, status = "new", locale = "fa" }: { className?: string; status?: "new" | "prep" | "send"; locale?: Locale }) {
  const d = T[locale];
  const cls = { new: "bg-sun/25 text-sun-700", prep: "bg-amber/15 text-amber-ink", send: "bg-teal/12 text-teal-700" }[status];
  return (
    <div className={cn("rounded-2xl border border-line bg-white p-3.5 text-[11.5px] leading-6 text-ink", className)} aria-hidden>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[13px] font-extrabold">{d.order}</p>
        <span className={cn("rounded-full px-2 text-[10px] font-bold", cls)}>{d.status[status]}</span>
      </div>
      <div className="space-y-0.5 text-ink-2">
        {d.lines.map(([a, b], i) => <p key={a} className={cn("flex justify-between", i === 2 && "text-teal-700")}><span>{a}</span><span>{b}</span></p>)}
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-dashed border-line-2 pt-2">
        <span className="text-ink-3">{d.paid}</span>
        <span className="text-[13px] font-extrabold">{d.total} {d.curShort}</span>
      </div>
    </div>
  );
}

const dots = ["bg-sun", "bg-amber", "bg-teal", "bg-ink-3"];

export function LimoFoodBoard({ className, locale = "fa" }: { className?: string; locale?: Locale }) {
  const d = T[locale];
  return (
    <div className={cn("bg-white p-3.5 text-[11px] leading-5 text-ink", className)} aria-hidden>
      <div className="mb-3 flex items-center justify-between">
        <div><p className="text-[13px] font-extrabold">{d.board}</p><p className="text-[10px] text-ink-3">{d.auto}</p></div>
        <div className="flex gap-1.5">
          {d.kpis.map(([k, v]) => <span key={k} className="rounded-lg border border-line px-2 py-1 text-[10px] text-ink-3">{k} <b className="text-ink">{v}</b></span>)}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {d.cols.map(([title, orders], i) => (
          <div key={title} className="rounded-lg bg-paper p-1.5">
            <p className="mb-1.5 flex items-center gap-1.5 px-1 text-[10px] font-bold text-ink-2"><i className={cn("size-1.5 rounded-full", dots[i])} />{title}</p>
            {orders.map(([id, m]) => (
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
