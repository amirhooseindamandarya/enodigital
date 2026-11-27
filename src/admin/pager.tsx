import Link from "next/link";

/** صفحه‌بندی ساده با حفظ فیلترهای جاری */
export function Pager({ page, hasNext, base, query }: { page: number; hasNext: boolean; base: string; query: Record<string, string | undefined> }) {
  if (page === 1 && !hasNext) return null;
  const href = (p: number) => `${base}?${new URLSearchParams({ ...Object.fromEntries(Object.entries(query).filter(([, v]) => v)), page: String(p) } as Record<string, string>)}`;
  const cls = "inline-flex h-10 items-center rounded-xl border border-line-2 bg-white px-4 text-[14px] font-bold hover:border-ink-3";
  return (
    <div className="mt-4 flex items-center justify-between">
      {page > 1 ? <Link href={href(page - 1)} className={cls}>صفحهٔ قبل</Link> : <span />}
      <span className="text-[13.5px] text-ink-3">صفحهٔ {page.toLocaleString("fa-IR")}</span>
      {hasNext ? <Link href={href(page + 1)} className={cls}>صفحهٔ بعد</Link> : <span />}
    </div>
  );
}

/** فرم فیلتر (GET) */
export function Filters({ children }: { children: React.ReactNode }) {
  return <form method="get" className="mb-4 flex flex-wrap items-end gap-2 rounded-2xl border border-line bg-white p-3">{children}<button type="submit" className="h-11 rounded-xl bg-navy px-5 text-[14px] font-bold text-white">اعمال</button></form>;
}
