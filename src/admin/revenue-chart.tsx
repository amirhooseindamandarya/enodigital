/* نمودار ستونی درآمد روزانه (یک سری؛ عنوان نام سری است، بدون راهنما) */
import { fmtToman, toToman } from "@/lib/money";

export function RevenueChart({ data }: { data: { day: string; label: string; amount: number }[] }) {
  const max = Math.max(...data.map((d) => d.amount), 1);
  // بالای محور: نزدیک‌ترین عدد «گرد» بزرگ‌تر از بیشینه
  const mag = 10 ** Math.floor(Math.log10(max));
  const top = Math.ceil(max / mag) * mag;
  return (
    <figure>
      <div className="relative h-48">
        {[0.5, 1].map((f) => (
          <div key={f} aria-hidden className="absolute inset-x-0 border-t border-dashed border-line" style={{ bottom: `${f * 100}%` }}>
            <span className="absolute -top-2.5 start-0 bg-white pe-1 text-[11px] text-ink-3">{toToman(top * f).toLocaleString("fa-IR")}</span>
          </div>
        ))}
        <div className="absolute inset-x-0 bottom-0 top-0 flex items-end gap-[2px] ps-14">
          {data.map((d) => (
            <div key={d.day} className="group relative flex h-full flex-1 items-end">
              <div className="w-full rounded-t-[4px] bg-navy transition-colors group-hover:bg-amber" style={{ height: `${d.amount ? Math.max(2, (d.amount / top) * 100) : 0}%` }} />
              {/* راهنمای شناور؛ ناحیهٔ لمس کل ستون است */}
              <div role="tooltip" className="pointer-events-none absolute bottom-full start-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 text-[12px] text-white shadow-lg group-hover:block rtl:translate-x-1/2">
                {d.label}: <b>{fmtToman(d.amount)}</b>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div aria-hidden className="mt-2 flex gap-[2px] ps-14 text-[10.5px] text-ink-3">
        {data.map((d, i) => <span key={d.day} className="flex-1 text-center">{i % 2 === 0 ? d.label : ""}</span>)}
      </div>
      <table className="sr-only">
        <caption>درآمد روزانه</caption>
        <tbody>{data.map((d) => <tr key={d.day}><th scope="row">{d.label}</th><td>{fmtToman(d.amount)}</td></tr>)}</tbody>
      </table>
    </figure>
  );
}
