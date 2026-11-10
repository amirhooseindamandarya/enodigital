import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

export function SectionHeading({ eyebrow, title, lead, center, dark, className, eyebrowClass }: {
  eyebrow?: React.ReactNode; title: React.ReactNode; lead?: React.ReactNode; center?: boolean; dark?: boolean; className?: string; eyebrowClass?: string;
}) {
  return (
    <div className={cn("max-w-[700px]", center && "mx-auto text-center", className)}>
      {eyebrow && (
        <Reveal y={8}>
          <p className={cn("eyebrow mb-4", dark ? "text-[#f5b82e]" : "text-amber-ink", center && "justify-center", eyebrowClass)}>
            <span aria-hidden className={cn("h-px w-6 bg-current opacity-60", center && "hidden sm:inline-block")} />{eyebrow}
          </p>
        </Reveal>
      )}
      <Reveal delay={0.05}><h2 className="h-section">{title}</h2></Reveal>
      {lead && <Reveal delay={0.12}><p className={cn("lead mt-4", dark && "text-white/65!")}>{lead}</p></Reveal>}
    </div>
  );
}

export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[13px] font-semibold", className)}>{children}</span>;
}
