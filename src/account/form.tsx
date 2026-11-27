"use client";
import { startTransition, useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ActionState = { error?: string; ok?: string; data?: Record<string, string | undefined> } | null;
type Action = (prev: ActionState, fd: FormData) => Promise<ActionState>;

/** فرم با اکشن سرور، پیام خطا/موفقیت و حالت در حال ارسال */
export function ActionForm({ action, children, className, render, resetOnOk, id }: {
  action: Action; children?: React.ReactNode; className?: string; resetOnOk?: boolean; id?: string;
  /** برای فرم‌های چندمرحله‌ای: محتوای فرم بر اساس نتیجهٔ قبلی */
  render?: (state: ActionState) => React.ReactNode;
}) {
  const [state, formAction] = useActionState(action, null);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => { if (state?.ok && resetOnOk) ref.current?.reset(); }, [state, resetOnOk]);
  return (
    <form ref={ref} id={id} action={formAction} className={cn("grid gap-4", className)} noValidate
      // ارسال دستی تا React پس از خطا فیلدها را پاک نکند (پاک‌سازی فقط با resetOnOk)
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget, (e.nativeEvent as SubmitEvent).submitter);
        startTransition(() => formAction(fd));
      }}>
      {render ? render(state) : children}
      <Notice state={state} />
    </form>
  );
}

export function Notice({ state }: { state: ActionState }) {
  if (!state?.error && !state?.ok?.trim()) return null;
  return (
    <p role={state.error ? "alert" : "status"} className={cn("flex items-start gap-2 rounded-xl p-3 text-[14px] leading-7", state.error ? "bg-[#e5484d]/8 text-[#c8333a]" : "bg-teal/10 text-teal-700")}>
      {state.error ? <AlertCircle className="mt-1 size-4 shrink-0" aria-hidden /> : <CheckCircle2 className="mt-1 size-4 shrink-0" aria-hidden />}
      {state.error ?? state.ok}
    </p>
  );
}

export function Submit({ children, className, variant = "primary", name, value, confirm }: { children: React.ReactNode; className?: string; variant?: "primary" | "dark" | "outline" | "danger"; name?: string; value?: string; confirm?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" name={name} value={value} disabled={pending}
      onClick={(e) => { if (confirm && !window.confirm(confirm)) e.preventDefault(); }}
      className={cn("inline-flex h-12 items-center justify-center gap-2 rounded-xl px-5 text-[15px] font-bold transition-colors disabled:opacity-60",
        variant === "primary" && "bg-amber text-navy hover:bg-[#ffb81f]",
        variant === "dark" && "bg-navy text-white hover:bg-navy-3",
        variant === "outline" && "border border-line-2 bg-white text-ink hover:border-ink-3",
        variant === "danger" && "border border-[#e5484d]/30 bg-white text-[#c8333a] hover:bg-[#e5484d]/5",
        className)}>
      {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}
