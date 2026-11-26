"use client";
/**
 * فرم عمومی: هر فرم تعریف‌شده در CMS را با فیلدها و متن‌های همان زبان رندر می‌کند.
 * ارسال: POST (JSON) به NEXT_PUBLIC_FORM_ENDPOINT. تا تنظیم نشود، پیام موفقیت ساختگی نمایش داده نمی‌شود.
 */
import { useId, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import type { ResolvedForm } from "@/cms/resolve";
import type { Locale } from "@/cms/types";
import { ui } from "@/cms/i18n";
import { cn } from "@/lib/utils";

const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "";
const normDigits = (s: string) => s.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
const isPhone = (v: string) => /^\+?\d{7,15}$/.test(normDigits(v).replace(/[\s\-()]/g, ""));
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

export function CmsForm({ form, locale, dark, submitLabel, context, fallbackContact }: { form: ResolvedForm; locale: Locale; dark?: boolean; submitLabel?: string; context?: string; fallbackContact?: string }) {
  const uid = useId();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error" | "unconfigured">("idle");

  const validate = (fd: FormData) => {
    const e: Record<string, string> = {};
    for (const f of form.fields) {
      const v = String(fd.get(f.key) ?? "").trim();
      if (f.type === "checkbox") { if (f.required && !fd.get(f.key)) e[f.key] = ui("required", locale); continue; }
      if (!v) { if (f.required) e[f.key] = ui("required", locale); continue; }
      if (f.type === "phone" && !isPhone(v)) e[f.key] = ui("invalidPhone", locale);
      if (f.type === "email" && !isEmail(v)) e[f.key] = ui("invalidEmail", locale);
    }
    return e;
  };

  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const el = ev.currentTarget;
    const fd = new FormData(el);
    const e = validate(fd);
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) { el.querySelector<HTMLElement>(`[name="${first}"]`)?.focus(); return; }
    if (!ENDPOINT) { setState("unconfigured"); return; }
    setState("sending");
    try {
      const data: Record<string, unknown> = {};
      for (const f of form.fields) data[f.key] = f.type === "checkbox" ? !!fd.get(f.key) : normDigits(String(fd.get(f.key) ?? "").trim());
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ form: form.key, locale, page: window.location.pathname, context, data }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState("sent");
      el.reset();
    } catch {
      setState("error");
    }
  };

  const label = cn("mb-1.5 block text-[13.5px] font-semibold", dark ? "text-white/75" : "text-ink-2");
  const input = (err?: string) => cn(
    "block w-full rounded-xl border px-4 text-[15px] outline-none transition-[border-color,box-shadow,background] duration-200",
    dark ? "border-white/12 bg-white/[0.05] text-white placeholder:text-white/35 focus:border-[#f5b82e] focus:bg-white/[0.08]"
      : "border-line-2 bg-white text-ink placeholder:text-ink-3 focus:border-amber focus:shadow-[0_0_0_4px_rgb(245_168_0/0.18)]",
    err && (dark ? "border-[#ff8a8a]" : "border-[#e5484d]"),
  );
  const Err = ({ k }: { k: string }) => errors[k] ? <p id={`${uid}-${k}-e`} className={cn("mt-1.5 flex items-center gap-1 text-[13px]", dark ? "text-[#ffb0b0]" : "text-[#c8333a]")}><AlertCircle className="size-3.5" aria-hidden />{errors[k]}</p> : null;
  const aria = (k: string) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${uid}-${k}-e` : undefined });
  const short = (t: string) => ["text", "email", "phone", "number", "select"].includes(t);

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2" aria-describedby={`${uid}-status`}>
      {form.fields.map((f) => {
        const id = `${uid}-${f.key}`;
        const lbl = `${f.label}${f.required ? " *" : ""}`;
        const wrap = cn(!short(f.type) && "sm:col-span-2");
        if (f.type === "textarea") return (
          <div key={f.key} className={wrap}>
            <label htmlFor={id} className={label}>{lbl}</label>
            <textarea id={id} name={f.key} rows={4} maxLength={3000} placeholder={f.placeholder} className={cn(input(errors[f.key]), "resize-y py-3 leading-7")} {...aria(f.key)} />
            <Err k={f.key} />
          </div>
        );
        if (f.type === "select") return (
          <div key={f.key} className={wrap}>
            <label htmlFor={id} className={label}>{lbl}</label>
            <select id={id} name={f.key} defaultValue="" className={cn(input(errors[f.key]), "h-12 appearance-none")} {...aria(f.key)}>
              <option value="">{ui("choose", locale)}</option>
              {f.options.map((o) => <option key={o.value} value={o.value} className="text-ink">{o.label}</option>)}
            </select>
            <Err k={f.key} />
          </div>
        );
        if (f.type === "checkbox") return (
          <div key={f.key} className="sm:col-span-2">
            <label className={cn("flex items-center gap-2 text-[14px]", dark ? "text-white/75" : "text-ink-2")}>
              <input type="checkbox" name={f.key} value="1" className="size-4 accent-[var(--color-amber)]" {...aria(f.key)} />{lbl}
            </label>
            <Err k={f.key} />
          </div>
        );
        const ltr = f.type === "phone" || f.type === "email";
        return (
          <div key={f.key} className={wrap}>
            <label htmlFor={id} className={label}>{lbl}</label>
            <input id={id} name={f.key} type={f.type === "phone" ? "tel" : f.type === "email" ? "email" : f.type === "number" ? "number" : "text"}
              autoComplete={f.type === "phone" ? "tel" : f.type === "email" ? "email" : f.key.includes("name") ? "name" : f.key.includes("org") ? "organization" : undefined}
              dir={ltr ? "ltr" : undefined} placeholder={f.placeholder}
              className={cn(input(errors[f.key]), "h-12", ltr && "text-start rtl:text-right")} {...aria(f.key)} />
            <Err k={f.key} />
          </div>
        );
      })}

      <button type="submit" disabled={state === "sending"}
        className={cn("mt-1 inline-flex h-13 items-center justify-center gap-2 rounded-xl px-6 text-[15.5px] font-bold transition-colors disabled:opacity-60 sm:col-span-2",
          dark ? "bg-white text-navy hover:bg-paper" : "bg-amber text-navy hover:bg-[#ffb81f]")}>
        {state === "sending" && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {submitLabel || form.submitLabel}
      </button>

      <div id={`${uid}-status`} role="status" aria-live="polite" className="sm:col-span-2">
        {state === "sent" && <p className={cn("flex items-start gap-2 rounded-xl p-3 text-[14px]", dark ? "bg-teal/15 text-[#7fe9dc]" : "bg-teal/10 text-teal-700")}><CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />{form.successMessage}</p>}
        {state === "error" && <p className={cn("flex items-start gap-2 rounded-xl p-3 text-[14px]", dark ? "bg-[#ff6b6b]/10 text-[#ffb0b0]" : "bg-[#e5484d]/8 text-[#c8333a]")}><AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />{ui("sendError", locale)}</p>}
        {state === "unconfigured" && (
          <p className={cn("flex items-start gap-2 rounded-xl p-3 text-[14px] leading-7", dark ? "bg-amber/10 text-amber" : "bg-amber/15 text-amber-ink")}>
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>{ui("unconfigured", locale)}{fallbackContact ? <> {ui("orReach", locale)} <span dir="ltr">{fallbackContact}</span></> : null}</span>
          </p>
        )}
      </div>
    </form>
  );
}
