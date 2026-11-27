"use client";
import { ActionForm, Submit } from "./form";
import { forgotAction } from "./actions";
import { inputCls } from "./ui";
import { cn } from "@/lib/utils";

type T = Record<"phone" | "sendCode" | "code" | "newPassword" | "passwordHint" | "resetBtn" | "testCode", string>;

/** فرم دومرحله‌ای بازیابی رمز (ارسال کد ← کد + رمز جدید) */
export function ForgotForm({ locale, t }: { locale: string; t: T }) {
  return (
    <ActionForm
      action={forgotAction}
      render={(state) => {
        const verify = state?.data?.step === "verify";
        return (
          <>
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="step" value={verify ? "verify" : "send"} />
            <label className="block">
              <span className="mb-1.5 block text-[13.5px] font-bold text-ink-2">{t.phone}</span>
              <input name="phone" inputMode="tel" autoComplete="tel" dir="ltr" required defaultValue={state?.data?.phone} readOnly={verify}
                className={cn(inputCls, "h-12 text-start rtl:text-right", verify && "bg-paper")} placeholder="09xx xxx xxxx" />
            </label>
            {verify && (
              <>
                {state?.data?.devCode && <p className="rounded-xl bg-amber/15 p-3 text-[13.5px] text-amber-ink">{t.testCode} <b dir="ltr">{state.data.devCode}</b></p>}
                <label className="block">
                  <span className="mb-1.5 block text-[13.5px] font-bold text-ink-2">{t.code}</span>
                  <input name="code" inputMode="numeric" autoComplete="one-time-code" dir="ltr" required maxLength={6} className={cn(inputCls, "h-12 text-center tracking-[0.5em]")} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[13.5px] font-bold text-ink-2">{t.newPassword}</span>
                  <input name="password" type="password" autoComplete="new-password" dir="ltr" required minLength={8} className={cn(inputCls, "h-12")} />
                  <span className="mt-1 block text-[12.5px] text-ink-3">{t.passwordHint}</span>
                </label>
              </>
            )}
            <Submit className="w-full">{verify ? t.resetBtn : t.sendCode}</Submit>
          </>
        );
      }}
    />
  );
}
