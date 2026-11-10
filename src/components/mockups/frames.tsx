import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/utils";

export function BrowserFrame({ children, title, className, dark }: { children: React.ReactNode; title?: string; className?: string; dark?: boolean }) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border", dark ? "border-white/10 bg-navy-2" : "border-line bg-white", className)}>
      <div className={cn("flex h-9 items-center gap-1.5 border-b px-3.5", dark ? "border-white/10 bg-white/[0.03]" : "border-line bg-[#fbfcfe]")} dir="ltr">
        <i className="size-2.5 rounded-full bg-[#ff6b6b]/80" />
        <i className="size-2.5 rounded-full bg-[#ffca52]/90" />
        <i className="size-2.5 rounded-full bg-[#16b8a6]/80" />
        {title && <span dir="rtl" className={cn("ms-3 truncate rounded-md px-2.5 text-[11px] leading-5", dark ? "bg-white/5 text-white/50" : "border border-line bg-white text-ink-3")}>{title}</span>}
      </div>
      {children}
    </div>
  );
}

export function PhoneFrame({ children, className, screenClassName }: { children: React.ReactNode; className?: string; screenClassName?: string }) {
  return (
    <div className={cn("rounded-[2.2rem] bg-[#0a0f22] p-[7px] shadow-[var(--shadow-float)]", className)}>
      <div className={cn("relative aspect-[9/19] overflow-hidden rounded-[1.8rem] bg-white", screenClassName)}>
        <span aria-hidden className="absolute left-1/2 top-2 z-10 h-[18px] w-[72px] -translate-x-1/2 rounded-full bg-[#0a0f22]" />
        {children}
      </div>
    </div>
  );
}

export function Screenshot({ src, alt, className, priority, sizes }: { src: StaticImageData; alt: string; className?: string; priority?: boolean; sizes?: string }) {
  return <Image src={src} alt={alt} className={cn("block h-auto w-full", className)} priority={priority} sizes={sizes ?? "(max-width: 768px) 100vw, 60vw"} placeholder="empty" />;
}
