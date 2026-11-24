"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { explainError, readJson, writeJson, type RepoConfig } from "./github";

export type Session = { cfg: RepoConfig; token: string };

/* ---------------- فیلدهای فرم ---------------- */
const inputCls =
  "w-full rounded-xl border border-line-2 bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink-3/70 focus:border-amber focus:shadow-[0_0_0_4px_rgb(245_168_0/0.15)]";

export function Field({ label, hint, error, children, className }: { label: string; hint?: React.ReactNode; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-[13.5px] font-bold text-ink-2">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-[12.5px] font-semibold text-sun">{error}</span> : hint && <span className="mt-1 block text-[12.5px] leading-6 text-ink-3">{hint}</span>}
    </label>
  );
}

export function Input({ ltr, className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { ltr?: boolean }) {
  return <input {...props} dir={ltr ? "ltr" : props.dir} className={cn(inputCls, "h-11", ltr && "text-left [font-feature-settings:normal]", className)} />;
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(inputCls, "min-h-[96px] resize-y leading-7", className)} />;
}

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(inputCls, "h-11", className)} />;
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="inline-flex items-center gap-3 text-[14.5px] font-semibold">
      <span className={cn("relative h-6 w-11 rounded-full transition-colors", checked ? "bg-teal-700" : "bg-line-2")}>
        <span className={cn("absolute top-0.5 size-5 rounded-full bg-white shadow transition-[inset-inline-start]", checked ? "start-[22px]" : "start-0.5")} />
      </span>
      {label}
    </button>
  );
}

export function Btn({ variant = "primary", loading, className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "dark" | "outline" | "danger" | "ghost"; loading?: boolean }) {
  return (
    <button
      type="button"
      {...props}
      disabled={props.disabled || loading}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 text-[14px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-4",
        variant === "primary" && "bg-amber text-navy hover:bg-[#ffb81f]",
        variant === "dark" && "bg-navy text-white hover:bg-navy-3",
        variant === "outline" && "border border-line-2 bg-white text-ink hover:border-ink-3",
        variant === "danger" && "border border-sun/30 bg-white text-sun hover:bg-sun/5",
        variant === "ghost" && "text-ink-2 hover:bg-paper hover:text-ink",
        className,
      )}
    >
      {loading && <Loader2 className="animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

export function Card({ title, desc, children, className }: { title?: string; desc?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl border border-line bg-white p-5 sm:p-7", className)}>
      {title && <h2 className="text-[17px] font-extrabold">{title}</h2>}
      {desc && <p className="mt-1 text-[13.5px] leading-6 text-ink-3">{desc}</p>}
      <div className={cn(title && "mt-5")}>{children}</div>
    </section>
  );
}

export function Badge({ tone, children }: { tone: "green" | "gray" | "amber" | "red"; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11.5px] font-bold",
      tone === "green" && "bg-teal/10 text-teal-700", tone === "gray" && "bg-paper text-ink-3 ring-1 ring-line",
      tone === "amber" && "bg-amber/15 text-amber-ink", tone === "red" && "bg-sun/10 text-sun")}>{children}</span>
  );
}

/* ---------------- بارگذاری و ذخیرهٔ یک فایل محتوا ---------------- */
export type SaveResult = { ok: true } | { ok: false; error: string };

export function useContentFile<T>(session: Session, file: string) {
  const [data, setData] = useState<T | null>(null);
  const [saved, setSaved] = useState<string>("");
  const [sha, setSha] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setError("");
    try {
      const r = await readJson<T>(session.cfg, session.token, file);
      setData(r.data);
      setSaved(JSON.stringify(r.data));
      setSha(r.sha);
    } catch (e) {
      setError(explainError(e));
    }
  }, [session, file]);

  useEffect(() => { load(); }, [load]);

  const dirty = data !== null && JSON.stringify(data) !== saved;

  const save = useCallback(async (message: string): Promise<SaveResult> => {
    if (data === null) return { ok: false, error: "داده‌ای بارگذاری نشده است" };
    setSaving(true);
    try {
      const newSha = await writeJson(session.cfg, session.token, file, data, sha, message);
      setSha(newSha);
      setSaved(JSON.stringify(data));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: explainError(e) };
    } finally {
      setSaving(false);
    }
  }, [data, session, file, sha]);

  const reset = useCallback(() => setData(JSON.parse(saved)), [saved]);

  return { data, setData, dirty, save, saving, error, reload: load, reset };
}

/* ---------------- ابزارهای متنی ---------------- */
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugError(slug: string, others: string[]) {
  if (!slug) return "نامک (slug) لازم است";
  if (!SLUG_RE.test(slug)) return "فقط حروف کوچک انگلیسی، عدد و خط تیره؛ مثل my-new-post";
  if (others.includes(slug)) return "این نامک تکراری است";
  return "";
}

export function move<T>(list: T[], from: number, to: number) {
  if (to < 0 || to >= list.length) return list;
  const next = list.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}
