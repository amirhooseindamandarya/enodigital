import { Field, Input, Textarea } from "@/account/ui";
import type { L10n } from "@/server/db/schema";

const LANGS = [["fa", "فارسی"], ["en", "English"], ["ar", "العربية"]] as const;

/** فیلد سه‌زبانه */
export function L10nInput({ name, label, value, area, required }: { name: string; label: string; value?: Partial<L10n> | null; area?: boolean; required?: boolean }) {
  return (
    <fieldset className="grid gap-3 rounded-xl border border-line p-3 sm:grid-cols-3">
      <legend className="px-1 text-[13.5px] font-bold text-ink-2">{label}</legend>
      {LANGS.map(([k, t]) => (
        <Field key={k} label={t}>
          {area
            ? <Textarea name={`${name}_${k}`} defaultValue={value?.[k] ?? ""} dir={k === "en" ? "ltr" : "rtl"} className="min-h-[90px]" required={required && k === "fa"} />
            : <Input name={`${name}_${k}`} defaultValue={value?.[k] ?? ""} dir={k === "en" ? "ltr" : "rtl"} required={required && k === "fa"} />}
        </Field>
      ))}
    </fieldset>
  );
}
