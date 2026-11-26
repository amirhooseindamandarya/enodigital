import Link from "next/link";
import { cn } from "@/lib/utils";

export type LogoData = { name: string; nameEn: string; mark?: string; markWhite?: string; word?: string; wordWhite?: string };

/** لوگو: نشانه + نوشتار (تصاویر از گروه سراسری «برند») */
export function Logo({ data, href, dark, className, label }: { data: LogoData; href: string; dark?: boolean; className?: string; label: string }) {
  const mark = dark ? data.markWhite ?? data.mark : data.mark;
  const word = dark ? data.wordWhite ?? data.word : data.word;
  return (
    <Link href={href} aria-label={label} className={cn("flex shrink-0 items-center gap-2.5", className)} dir="ltr">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {mark && <img src={mark} alt="" width={34} height={35} className="h-[34px] w-auto" />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {word ? <img src={word} alt={data.nameEn} width={140} height={39} className="h-[18px] w-auto sm:h-5" /> : <span className="font-extrabold">{data.name}</span>}
    </Link>
  );
}
