import Link from "next/link";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/** لوگوی موقت — با فایل لوگوی نهایی جایگزین شود (src/lib/site.ts) */
export function Logo({ dark, className }: { dark?: boolean; className?: string }) {
  return (
    <Link href="/" aria-label={`${site.name}، صفحهٔ اصلی`} className={cn("flex items-center gap-2.5 text-[18px] font-extrabold", dark ? "text-white" : "text-ink", className)}>
      <span aria-hidden className="relative grid size-9 place-items-center overflow-hidden rounded-[11px] bg-gradient-to-br from-indigo to-violet font-[system-ui] text-[18px] font-bold text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.25)]">
        {site.logoMark}
      </span>
      {site.name}
    </Link>
  );
}
