/* اجزای نمایشی حساب کاربری و پنل مدیریت (سمت سرور) */
import Link from "next/link";
import { cn } from "@/lib/utils";

export const inputCls = "block w-full rounded-xl border border-line-2 bg-white px-4 text-[15px] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink-3/70 focus:border-amber focus:shadow-[0_0_0_4px_rgb(245_168_0/0.15)] disabled:bg-paper disabled:text-ink-3";

export function Field({ label, hint, children, className }: { label: string; hint?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-[13.5px] font-bold text-ink-2">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[12.5px] leading-6 text-ink-3">{hint}</span>}
    </label>
  );
}

export function Input({ className, ltr, ...p }: React.InputHTMLAttributes<HTMLInputElement> & { ltr?: boolean }) {
  return <input {...p} dir={ltr ? "ltr" : p.dir} className={cn(inputCls, "h-12", ltr && "text-start [font-feature-settings:normal] rtl:text-right", className)} />;
}
export function Textarea({ className, ...p }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...p} className={cn(inputCls, "min-h-[120px] resize-y py-3 leading-7", className)} />;
}
export function Select({ className, ...p }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...p} className={cn(inputCls, "h-12", className)} />;
}

export function Card({ title, action, children, className, pad = true }: { title?: React.ReactNode; action?: React.ReactNode; children: React.ReactNode; className?: string; pad?: boolean }) {
  return (
    <section className={cn("rounded-2xl border border-line bg-white", pad && "p-5 sm:p-6", className)}>
      {(title || action) && (
        <div className={cn("mb-4 flex items-center justify-between gap-3", !pad && "px-5 pt-5 sm:px-6")}>
          {title && <h2 className="text-[16.5px] font-extrabold">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function PageTitle({ title, lead, action }: { title: string; lead?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-[24px] font-extrabold leading-tight sm:text-[28px]">{title}</h1>
        {lead && <p className="mt-1.5 text-[14.5px] text-ink-3">{lead}</p>}
      </div>
      {action}
    </div>
  );
}

const tones = {
  green: "bg-teal/10 text-teal-700 ring-teal/20",
  amber: "bg-amber/15 text-amber-ink ring-amber/25",
  red: "bg-[#e5484d]/10 text-[#c8333a] ring-[#e5484d]/20",
  gray: "bg-paper text-ink-3 ring-line",
  blue: "bg-[#2c62b5]/10 text-[#2c62b5] ring-[#2c62b5]/20",
} as const;
export type Tone = keyof typeof tones;

export function Badge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return <span className={cn("inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-[12px] font-bold ring-1", tones[tone])}>{children}</span>;
}

export const orderTone: Record<string, Tone> = { pending: "amber", paid: "blue", completed: "green", cancelled: "gray", failed: "red", refunded: "gray" };
export const subTone: Record<string, Tone> = { pending: "amber", active: "green", expired: "red", cancelled: "gray", suspended: "red" };
export const ticketTone: Record<string, Tone> = { open: "amber", answered: "green", customer_reply: "amber", closed: "gray" };
export const payTone: Record<string, Tone> = { initiated: "gray", paid: "green", failed: "red", cancelled: "gray" };

export function Empty({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="grid place-items-center gap-4 rounded-2xl border border-dashed border-line-2 bg-white px-6 py-12 text-center text-[15px] text-ink-3">
      <p>{children}</p>
      {action}
    </div>
  );
}

export function Btn({ href, children, variant = "primary", className, size = "md" }: { href: string; children: React.ReactNode; variant?: "primary" | "dark" | "outline" | "ghost"; className?: string; size?: "sm" | "md" }) {
  return (
    <Link href={href} className={cn("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-bold transition-colors",
      size === "sm" ? "h-9 px-3.5 text-[13.5px]" : "h-11 px-5 text-[14.5px]",
      variant === "primary" && "bg-amber text-navy hover:bg-[#ffb81f]",
      variant === "dark" && "bg-navy text-white hover:bg-navy-3",
      variant === "outline" && "border border-line-2 bg-white text-ink hover:border-ink-3",
      variant === "ghost" && "text-ink-2 hover:bg-paper hover:text-ink",
      className)}>{children}</Link>
  );
}

export function Stat({ label, value, tone = "gray", href }: { label: string; value: React.ReactNode; tone?: Tone; href?: string }) {
  const inner = (
    <>
      <span className="text-[13px] font-bold text-ink-3">{label}</span>
      <span className="mt-2 flex items-center gap-2 text-[26px] font-extrabold leading-none text-ink">{value}<i className={cn("size-2 rounded-full", tone === "green" ? "bg-teal" : tone === "amber" ? "bg-amber" : tone === "red" ? "bg-[#e5484d]" : tone === "blue" ? "bg-[#2c62b5]" : "bg-line-2")} /></span>
    </>
  );
  const cls = "flex flex-col rounded-2xl border border-line bg-white p-5 transition-shadow";
  return href ? <Link href={href} className={cn(cls, "hover:shadow-[var(--shadow-soft)]")}>{inner}</Link> : <div className={cls}>{inner}</div>;
}

/** جدول ساده و واکنش‌گرا */
export function Table({ head, children, empty }: { head: React.ReactNode[]; children: React.ReactNode; empty?: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-white">
      <table className="w-full min-w-[640px] border-collapse text-[14px]">
        <thead className="bg-paper text-[12.5px] font-bold text-ink-3">
          <tr>{head.map((h, i) => <th key={i} scope="col" className="px-4 py-3 text-start font-bold">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
      {empty}
    </div>
  );
}
export const td = "px-4 py-3.5 align-middle";

export function AuthCard({ title, lead, children, footer }: { title: string; lead?: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <div className="w-full max-w-[440px]">
      <div className="rounded-3xl border border-line bg-white p-7 shadow-[var(--shadow-soft)] sm:p-9">
        <h1 className="text-[24px] font-extrabold">{title}</h1>
        {lead && <p className="mt-1.5 text-[14.5px] leading-7 text-ink-3">{lead}</p>}
        <div className="mt-7">{children}</div>
      </div>
      {footer && <p className="mt-5 text-center text-[14.5px] text-ink-2">{footer}</p>}
    </div>
  );
}
