import { cn } from "@/lib/utils";

export function SectionHeading({ eyebrow, title, lead, center, dark, className, eyebrowClass }: {
  eyebrow?: React.ReactNode; title: React.ReactNode; lead?: React.ReactNode; center?: boolean; dark?: boolean; className?: string; eyebrowClass?: string;
}) {
  return (
    <div className={cn("max-w-[700px]", center && "mx-auto text-center", className)}>
      {eyebrow && <p className={cn("eyebrow mb-4", dark ? "text-[#f5b82e]" : "text-amber-ink", center && "justify-center", eyebrowClass)}>{eyebrow}</p>}
      <h2 className="h-section">{title}</h2>
      {lead && <p className={cn("lead mt-4", dark && "text-white/65!")}>{lead}</p>}
    </div>
  );
}

export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[13px] font-semibold", className)}>{children}</span>;
}
