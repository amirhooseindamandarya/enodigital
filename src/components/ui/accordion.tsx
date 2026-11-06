"use client";
import * as A from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function FaqList({ items, className, dark }: { items: { q: string; a: string }[]; className?: string; dark?: boolean }) {
  return (
    <A.Root type="single" collapsible defaultValue="item-0" className={cn("divide-y", dark ? "divide-white/10 border-y border-white/10" : "divide-line border-y border-line", className)}>
      {items.map((it, i) => (
        <A.Item key={it.q} value={`item-${i}`}>
          <A.Header>
            <A.Trigger className="group flex w-full items-center justify-between gap-6 py-5 text-start text-[16.5px] font-bold sm:text-[17.5px]">
              {it.q}
              <ChevronDown aria-hidden className={cn("size-5 shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-180", dark ? "text-white/50" : "text-ink-3")} />
            </A.Trigger>
          </A.Header>
          <A.Content className="overflow-hidden data-[state=closed]:animate-[acc-up_.25s_ease] data-[state=open]:animate-[acc-down_.3s_ease]">
            <p className={cn("max-w-3xl pb-6", dark ? "text-white/65" : "text-ink-2")}>{it.a}</p>
          </A.Content>
        </A.Item>
      ))}
    </A.Root>
  );
}
