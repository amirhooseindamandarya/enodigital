"use client";
import { Printer } from "lucide-react";

export function PrintButton({ label }: { label: string }) {
  return (
    <button type="button" onClick={() => window.print()} className="inline-flex h-11 items-center gap-2 rounded-xl bg-navy px-5 text-[14.5px] font-bold text-white hover:bg-navy-3">
      <Printer className="size-4" aria-hidden />{label}
    </button>
  );
}
