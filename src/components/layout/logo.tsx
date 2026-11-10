import Image from "next/image";
import Link from "next/link";
import mark from "@/assets/brand/logo-mark.png";
import markWhite from "@/assets/brand/logo-mark-white.png";
import wordmark from "@/assets/brand/logo-wordmark.webp";
import wordmarkWhite from "@/assets/brand/logo-wordmark-white.webp";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/** لوگوی اِنو دیجیتال: نشانه + نوشتار (نسخهٔ روشن و تیره) */
export function Logo({ dark, className }: { dark?: boolean; className?: string }) {
  return (
    <Link href="/" aria-label={`${site.name}، صفحهٔ اصلی`} className={cn("flex shrink-0 items-center gap-2.5", className)} dir="ltr">
      <Image src={dark ? markWhite : mark} alt="" width={34} height={35} className="h-[34px] w-auto" priority />
      <Image src={dark ? wordmarkWhite : wordmark} alt={site.nameEn} width={140} height={39} className="h-[18px] w-auto sm:h-5" priority />
    </Link>
  );
}
