"use client";

import { useId, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Paperclip } from "lucide-react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type Variant = "contact" | "demo" | "project";

const PROJECT_TYPES = ["وب‌اپلیکیشن", "سیستم مدیریت داخلی", "داشبورد مدیریتی", "API و یکپارچه‌سازی", "توسعه یا پشتیبانی سامانهٔ موجود", "سایر"];
const TOPICS = ["لیموسی", "لیموفود", "سامانهٔ رفاهیات", "نرم‌افزار سفارشی", "سایر"];
const MAX_FILE = 10 * 1024 * 1024;
const FILE_TYPES = ".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.zip";

type Errors = Partial<Record<"name" | "contact" | "message" | "file" | "type", string>>;

const persianDigits = (s: string) => s.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
const isPhone = (v: string) => /^(\+98|0098|0)?9\d{9}$|^0\d{10}$/.test(persianDigits(v).replace(/[\s-]/g, ""));
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

/**
 * فرم سرنخ (تماس / دمو / درخواست پروژه).
 * ارسال به NEXT_PUBLIC_FORM_ENDPOINT با POST و multipart/form-data انجام می‌شود.
 * اگر نقطهٔ اتصال تنظیم نشده باشد، فرم پیام موفقیت ساختگی نشان نمی‌دهد.
 */
export function LeadForm({ variant = "contact", product, dark, submitLabel }: { variant?: Variant; product?: string; dark?: boolean; submitLabel?: string }) {
  const uid = useId();
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error" | "unconfigured">("idle");
  const [fileName, setFileName] = useState("");

  const validate = (fd: FormData): Errors => {
    const e: Errors = {};
    const name = String(fd.get("name") ?? "").trim();
    const contact = String(fd.get("contact") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();
    if (name.length < 2) e.name = "لطفاً نام خود را وارد کنید.";
    if (!contact) e.contact = "شمارهٔ تماس یا ایمیل را وارد کنید.";
    else if (!isPhone(contact) && !isEmail(contact)) e.contact = "شمارهٔ موبایل/تلفن یا ایمیل معتبر وارد کنید.";
    if (variant === "project" && !fd.get("projectType")) e.type = "نوع پروژه را انتخاب کنید.";
    if (variant !== "demo" && message.length < 10) e.message = "لطفاً نیاز خود را در چند جمله توضیح دهید.";
    const file = fd.get("attachment");
    if (file instanceof File && file.size > 0) {
      if (file.size > MAX_FILE) e.file = "حجم فایل باید کمتر از ۱۰ مگابایت باشد.";
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      if (!FILE_TYPES.includes(`.${ext}`)) e.file = "فرمت فایل پشتیبانی نمی‌شود.";
    }
    return e;
  };

  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const form = ev.currentTarget;
    const fd = new FormData(form);
    const e = validate(fd);
    setErrors(e);
    if (Object.keys(e).length) {
      const first = form.querySelector<HTMLElement>(`[name="${Object.keys(e)[0] === "type" ? "projectType" : Object.keys(e)[0] === "file" ? "attachment" : Object.keys(e)[0]}"]`);
      first?.focus();
      return;
    }
    if (!site.formEndpoint) { setState("unconfigured"); return; }
    setState("sending");
    try {
      fd.append("formType", variant);
      fd.append("page", window.location.pathname);
      const res = await fetch(site.formEndpoint, { method: "POST", body: fd, headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(String(res.status));
      setState("sent");
      form.reset();
      setFileName("");
    } catch {
      setState("error");
    }
  };

  const label = cn("mb-1.5 block text-[13.5px] font-semibold", dark ? "text-white/75" : "text-ink-2");
  const input = (err?: string) => cn(
    "block w-full rounded-xl border px-4 text-[15px] outline-none transition-[border-color,box-shadow,background] duration-200",
    dark
      ? "border-white/12 bg-white/[0.05] text-white placeholder:text-white/35 focus:border-[#f5b82e] focus:bg-white/[0.08]"
      : "border-line-2 bg-white text-ink placeholder:text-ink-3 focus:border-amber focus:shadow-[0_0_0_4px_rgb(245_168_0/0.18)]",
    err && (dark ? "border-[#ff8a8a]" : "border-[#e5484d]"),
  );
  const errText = cn("mt-1.5 flex items-center gap-1 text-[13px]", dark ? "text-[#ffb0b0]" : "text-[#c8333a]");
  const Err = ({ id, msg }: { id: string; msg?: string }) => msg ? <p id={id} className={errText}><AlertCircle className="size-3.5" aria-hidden />{msg}</p> : null;

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-4" aria-describedby={`${uid}-status`}>
      {product && <input type="hidden" name="product" value={product} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-name`} className={label}>نام و نام خانوادگی *</label>
          <input id={`${uid}-name`} name="name" autoComplete="name" className={cn(input(errors.name), "h-12")} aria-invalid={!!errors.name} aria-describedby={errors.name ? `${uid}-name-e` : undefined} />
          <Err id={`${uid}-name-e`} msg={errors.name} />
        </div>
        <div>
          <label htmlFor={`${uid}-org`} className={label}>{variant === "demo" ? "نام سازمان / کسب‌وکار" : "سازمان یا شرکت"}</label>
          <input id={`${uid}-org`} name="organization" autoComplete="organization" className={cn(input(), "h-12")} />
        </div>
      </div>

      <div className={cn("grid gap-4", variant !== "contact" && "sm:grid-cols-2")}>
        <div>
          <label htmlFor={`${uid}-contact`} className={label}>شمارهٔ تماس یا ایمیل *</label>
          <input id={`${uid}-contact`} name="contact" inputMode="email" autoComplete="tel" dir="ltr" className={cn(input(errors.contact), "h-12 text-right")} aria-invalid={!!errors.contact} aria-describedby={errors.contact ? `${uid}-contact-e` : undefined} placeholder="09xx xxx xxxx" />
          <Err id={`${uid}-contact-e`} msg={errors.contact} />
        </div>
        {variant === "project" && (
          <div>
            <label htmlFor={`${uid}-type`} className={label}>نوع پروژه *</label>
            <select id={`${uid}-type`} name="projectType" defaultValue="" className={cn(input(errors.type), "h-12 appearance-none")} aria-invalid={!!errors.type} aria-describedby={errors.type ? `${uid}-type-e` : undefined}>
              <option value="" disabled>انتخاب کنید</option>
              {PROJECT_TYPES.map((t) => <option key={t} className="text-ink">{t}</option>)}
            </select>
            <Err id={`${uid}-type-e`} msg={errors.type} />
          </div>
        )}
        {variant === "demo" && (
          <div>
            <label htmlFor={`${uid}-size`} className={label}>اندازهٔ تیم یا سازمان</label>
            <select id={`${uid}-size`} name="teamSize" defaultValue="" className={cn(input(), "h-12 appearance-none")}>
              <option value="">انتخاب کنید</option>
              {["کمتر از ۱۰ نفر", "۱۰ تا ۵۰ نفر", "۵۰ تا ۲۰۰ نفر", "۲۰۰ تا ۱٬۰۰۰ نفر", "بیش از ۱٬۰۰۰ نفر"].map((t) => <option key={t} className="text-ink">{t}</option>)}
            </select>
          </div>
        )}
      </div>

      {variant === "contact" && (
        <fieldset>
          <legend className={label}>موضوع</legend>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((t, i) => (
              <label key={t} className="cursor-pointer">
                <input type="radio" name="topic" value={t} defaultChecked={i === 0} className="peer sr-only" />
                <span className={cn("inline-flex h-10 items-center rounded-full border px-4 text-[14px] font-semibold transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-amber",
                  dark ? "border-white/15 text-white/70 peer-checked:border-white peer-checked:bg-white peer-checked:text-navy" : "border-line-2 text-ink-2 peer-checked:border-navy peer-checked:bg-navy peer-checked:text-white")}>{t}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div>
        <label htmlFor={`${uid}-msg`} className={label}>{variant === "project" ? "شرح نیاز *" : variant === "demo" ? "توضیحات (اختیاری)" : "پیام *"}</label>
        <textarea id={`${uid}-msg`} name="message" rows={variant === "demo" ? 3 : 5} maxLength={3000} className={cn(input(errors.message), "resize-y py-3 leading-7")} aria-invalid={!!errors.message} aria-describedby={errors.message ? `${uid}-msg-e` : undefined}
          placeholder={variant === "project" ? "مسئله، کاربران سامانه، فرایند فعلی و زمان‌بندی مدنظر را بنویسید." : ""} />
        <Err id={`${uid}-msg-e`} msg={errors.message} />
      </div>

      {variant === "project" && (
        <div>
          <span className={label}>فایل پیوست (اختیاری)</span>
          <label htmlFor={`${uid}-file`} className={cn("flex h-12 cursor-pointer items-center gap-2 rounded-xl border border-dashed px-4 text-[14px] transition-colors",
            dark ? "border-white/20 text-white/60 hover:border-white/40" : "border-line-2 text-ink-3 hover:border-ink-3", errors.file && "border-[#e5484d]")}>
            <Paperclip className="size-4 shrink-0" aria-hidden />
            <span className="truncate">{fileName || "انتخاب فایل — PDF، Word، Excel، تصویر یا ZIP، حداکثر ۱۰ مگابایت"}</span>
          </label>
          <input id={`${uid}-file`} name="attachment" type="file" accept={FILE_TYPES} className="sr-only" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")} aria-describedby={errors.file ? `${uid}-file-e` : undefined} />
          <Err id={`${uid}-file-e`} msg={errors.file} />
        </div>
      )}

      <button type="submit" disabled={state === "sending"}
        className={cn("mt-1 inline-flex h-13 items-center justify-center gap-2 rounded-xl px-6 text-[15.5px] font-bold transition-colors disabled:opacity-60",
          dark ? "bg-white text-navy hover:bg-paper" : "bg-amber text-navy hover:bg-[#ffb81f]")}>
        {state === "sending" && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {submitLabel ?? (variant === "project" ? "ثبت درخواست پروژه" : variant === "demo" ? "درخواست دمو" : "ارسال پیام")}
      </button>

      <div id={`${uid}-status`} role="status" aria-live="polite">
        {state === "sent" && (
          <p className={cn("flex items-start gap-2 rounded-xl p-3 text-[14px]", dark ? "bg-teal/15 text-[#7fe9dc]" : "bg-teal/10 text-teal-700")}>
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />درخواست شما ثبت شد. به‌زودی با شما تماس می‌گیریم.
          </p>
        )}
        {state === "error" && (
          <p className={cn("flex items-start gap-2 rounded-xl p-3 text-[14px]", dark ? "bg-[#ff6b6b]/10 text-[#ffb0b0]" : "bg-[#e5484d]/8 text-[#c8333a]")}>
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />ارسال با خطا مواجه شد. لطفاً دوباره تلاش کنید.
          </p>
        )}
        {state === "unconfigured" && (
          <p className={cn("flex items-start gap-2 rounded-xl p-3 text-[14px] leading-7", dark ? "bg-amber/10 text-amber" : "bg-amber/15 text-amber-ink")}>
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
            اطلاعات فرم معتبر است، اما ارسال آنلاین هنوز به سرور متصل نشده و پیامی ارسال نشد.
            {site.contact.phone || site.contact.email ? ` لطفاً از طریق ${site.contact.phone || site.contact.email} با ما تماس بگیرید.` : ""}
          </p>
        )}
      </div>
    </form>
  );
}
