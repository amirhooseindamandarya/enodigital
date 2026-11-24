"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ExternalLink, FileText, ImagePlus, Plus, RotateCcw, Save, Trash2, X } from "lucide-react";
import { explainError, prepareImage, uploadFile } from "./github";
import type { Article, ArticleBlock, Project } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Badge, Btn, Card, Field, Input, Select, Textarea, Toggle, move, slugError, useContentFile, type SaveResult, type Session } from "./ui";

export type Notify = (msg: string, tone?: "ok" | "err") => void;

/* ============================================================ */
/* نوار ذخیره                                                    */
/* ============================================================ */
function SaveBar({ dirty, saving, invalid, onSave, onReset }: { dirty: boolean; saving: boolean; invalid?: string; onSave: () => void; onReset: () => void }) {
  return (
    <div className={cn("sticky bottom-4 z-20 mt-6 flex flex-col gap-3 rounded-2xl border bg-white/95 p-3 shadow-[var(--shadow-lift)] backdrop-blur transition-all sm:flex-row sm:items-center sm:justify-between sm:ps-5",
      dirty ? "border-amber/40 opacity-100" : "pointer-events-none translate-y-2 border-line opacity-0")} aria-hidden={!dirty}>
      <p className="text-[14px] font-semibold text-ink-2">{invalid ? <span className="text-sun">{invalid}</span> : "تغییرات ذخیره‌نشده دارید."}</p>
      <div className="flex gap-2">
        <Btn variant="ghost" onClick={onReset} disabled={saving}><RotateCcw aria-hidden />لغو تغییرات</Btn>
        <Btn onClick={onSave} loading={saving} disabled={!!invalid}><Save aria-hidden />ذخیره و انتشار</Btn>
      </div>
    </div>
  );
}

function useLeaveGuard(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);
}

function LoadState({ error, onRetry }: { error: string; onRetry: () => void }) {
  if (!error) return <div className="grid gap-4">{[0, 1, 2].map((i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-line/60" />)}</div>;
  return (
    <Card>
      <p className="font-bold text-sun">{error}</p>
      <Btn variant="outline" className="mt-4" onClick={onRetry}>تلاش دوباره</Btn>
    </Card>
  );
}

const report = (notify: Notify) => (r: SaveResult) =>
  r.ok ? notify("ذخیره شد. سایت تا چند دقیقهٔ دیگر به‌روز می‌شود.") : notify(r.error, "err");

/* ============================================================ */
/* تنظیمات سایت                                                  */
/* ============================================================ */
export type Settings = {
  tagline: string;
  legalTagline: string;
  description: string;
  contact: { phone: string; email: string; address: string; hours: string };
  social: { instagram: string; linkedin: string; telegram: string; whatsapp: string };
};

export function SettingsEditor({ session, notify, onDirty }: { session: Session; notify: Notify; onDirty: (d: boolean) => void }) {
  const f = useContentFile<Settings>(session, "settings.json");
  useLeaveGuard(f.dirty);
  useEffect(() => onDirty(f.dirty), [f.dirty, onDirty]);
  if (!f.data) return <LoadState error={f.error} onRetry={f.reload} />;
  const d = f.data;
  const set = (patch: Partial<Settings>) => f.setData({ ...d, ...patch });
  const setC = (k: keyof Settings["contact"], v: string) => set({ contact: { ...d.contact, [k]: v } });
  const setS = (k: keyof Settings["social"], v: string) => set({ social: { ...d.social, [k]: v } });
  const emailBad = d.contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.contact.email);

  return (
    <div className="grid gap-5">
      <Card title="اطلاعات تماس" desc="در فوتر و صفحهٔ تماس نمایش داده می‌شوند. فیلدهای خالی در سایت دیده نمی‌شوند.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="تلفن"><Input ltr inputMode="tel" value={d.contact.phone} onChange={(e) => setC("phone", e.target.value)} placeholder="021 1234 5678" /></Field>
          <Field label="ایمیل" error={emailBad ? "ایمیل معتبر نیست" : ""}><Input ltr type="email" value={d.contact.email} onChange={(e) => setC("email", e.target.value)} placeholder="info@example.com" /></Field>
          <Field label="نشانی" className="sm:col-span-2"><Input value={d.contact.address} onChange={(e) => setC("address", e.target.value)} placeholder="تهران، ..." /></Field>
          <Field label="ساعات پاسخ‌گویی" className="sm:col-span-2"><Input value={d.contact.hours} onChange={(e) => setC("hours", e.target.value)} placeholder="شنبه تا چهارشنبه، ۹ تا ۱۷" /></Field>
        </div>
      </Card>

      <Card title="شبکه‌های اجتماعی" desc="نام کاربری یا آدرس کامل را وارد کنید. برای واتساپ شمارهٔ کامل با کد کشور (مثل 98912...).">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="اینستاگرام"><Input ltr value={d.social.instagram} onChange={(e) => setS("instagram", e.target.value)} placeholder="enodigital" /></Field>
          <Field label="لینکدین"><Input ltr value={d.social.linkedin} onChange={(e) => setS("linkedin", e.target.value)} placeholder="enodigital" /></Field>
          <Field label="تلگرام"><Input ltr value={d.social.telegram} onChange={(e) => setS("telegram", e.target.value)} placeholder="enodigital" /></Field>
          <Field label="واتساپ"><Input ltr inputMode="tel" value={d.social.whatsapp} onChange={(e) => setS("whatsapp", e.target.value)} placeholder="989120000000" /></Field>
        </div>
      </Card>

      <Card title="معرفی شرکت" desc="متن‌های کوتاهی که در فوتر و نتایج جست‌وجو استفاده می‌شوند.">
        <div className="grid gap-4">
          <Field label="شعار"><Input value={d.tagline} onChange={(e) => set({ tagline: e.target.value })} /></Field>
          <Field label="عنوان حقوقی (زیر لوگو)"><Input value={d.legalTagline} onChange={(e) => set({ legalTagline: e.target.value })} /></Field>
          <Field label="توضیح سایت برای موتورهای جست‌وجو" hint={`${d.description.length.toLocaleString("fa-IR")} نویسه؛ بهتر است بین ۱۲۰ تا ۱۶۰ باشد.`}>
            <Textarea value={d.description} onChange={(e) => set({ description: e.target.value })} />
          </Field>
        </div>
      </Card>

      <SaveBar dirty={f.dirty} saving={f.saving} invalid={emailBad ? "ایمیل معتبر نیست" : !d.tagline.trim() ? "شعار نمی‌تواند خالی باشد" : ""}
        onReset={f.reset} onSave={async () => report(notify)(await f.save("پنل مدیریت: به‌روزرسانی تنظیمات سایت"))} />
    </div>
  );
}

/* ============================================================ */
/* چیدمان فهرست + جزئیات (مشترک پروژه‌ها و مقالات)              */
/* ============================================================ */
function ListDetail<T>({ items, selected, onSelect, title, getTitle, getPublished, onAdd, addLabel, children }: {
  items: T[]; selected: number; onSelect: (i: number) => void; title: string; getTitle: (t: T) => string; getPublished: (t: T) => boolean; onAdd: () => void; addLabel: string; children: React.ReactNode;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-[300px_1fr] lg:items-start">
      <aside className="rounded-2xl border border-line bg-white p-3 lg:sticky lg:top-24">
        <div className="flex items-center justify-between px-2 pb-3 pt-1">
          <p className="text-[13.5px] font-bold text-ink-3">{title} ({items.length.toLocaleString("fa-IR")})</p>
          <Btn variant="outline" className="h-8 px-2.5 text-[13px]" onClick={onAdd}><Plus aria-hidden />{addLabel}</Btn>
        </div>
        {items.length === 0 ? <p className="px-2 pb-3 text-[14px] text-ink-3">هنوز موردی ثبت نشده است.</p> : (
          <ul className="grid gap-1">
            {items.map((it, i) => (
              <li key={i}>
                <button type="button" onClick={() => onSelect(i)} aria-current={i === selected}
                  className={cn("flex w-full items-start gap-2 rounded-xl px-3 py-2.5 text-start transition-colors", i === selected ? "bg-amber/10 ring-1 ring-amber/30" : "hover:bg-paper")}>
                  <FileText className="mt-1 size-4 shrink-0 text-ink-3" aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 text-[14px] font-bold leading-6">{getTitle(it) || "بدون عنوان"}</span>
                    <span className="mt-1 block">{getPublished(it) ? <Badge tone="green">منتشرشده</Badge> : <Badge tone="gray">پیش‌نویس</Badge>}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function ItemToolbar({ index, count, onMove, onDelete, viewHref, published, onPublished }: { index: number; count: number; onMove: (to: number) => void; onDelete: () => void; viewHref?: string; published: boolean; onPublished: (v: boolean) => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white p-3 ps-5">
      <Toggle checked={published} onChange={onPublished} label={published ? "منتشرشده (در سایت دیده می‌شود)" : "پیش‌نویس (در سایت دیده نمی‌شود)"} />
      <div className="flex flex-wrap gap-1.5">
        <Btn variant="ghost" className="px-2.5" onClick={() => onMove(index - 1)} disabled={index === 0} aria-label="انتقال به بالا" title="انتقال به بالا"><ArrowUp aria-hidden /></Btn>
        <Btn variant="ghost" className="px-2.5" onClick={() => onMove(index + 1)} disabled={index === count - 1} aria-label="انتقال به پایین" title="انتقال به پایین"><ArrowDown aria-hidden /></Btn>
        {viewHref && <a href={viewHref} target="_blank" rel="noopener" className="inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-[14px] font-bold text-ink-2 hover:bg-paper"><ExternalLink className="size-4" aria-hidden />مشاهده</a>}
        <Btn variant="danger" onClick={onDelete}><Trash2 aria-hidden />حذف</Btn>
      </div>
    </div>
  );
}

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const splitTags = (s: string) => s.split(/[,،]/).map((t) => t.trim()).filter(Boolean);

/* ============================================================ */
/* بارگذاری تصویر پروژه                                          */
/* ============================================================ */
function ImageUpload({ session, value, slug, onChange, notify }: { session: Session; value?: string; slug: string; onChange: (path: string) => void; notify: Notify }) {
  const [busy, setBusy] = useState(false);
  /** پیش‌نمایش محلی تصاویری که تازه بارگذاری شده‌اند و هنوز روی سایت منتشر نشده‌اند */
  const [local, setLocal] = useState<Record<string, string>>({});
  const preview = value ? local[value] ?? `${base}${value}` : "";

  const pick = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try {
      const img = await prepareImage(file);
      const path = `/uploads/projects/${slug || "project"}-${Date.now().toString(36)}.webp`;
      await uploadFile(session.cfg, session.token, `public${path}`, img.base64, `پنل مدیریت: بارگذاری تصویر پروژهٔ ${slug}`);
      setLocal((m) => ({ ...m, [path]: img.url }));
      onChange(path);
      notify(`تصویر بارگذاری شد (${Math.round(img.blob.size / 1024).toLocaleString("fa-IR")} کیلوبایت). برای اعمال، «ذخیره و انتشار» را بزنید.`);
    } catch (e) {
      notify(explainError(e), "err");
    } finally { setBusy(false); }
  };

  return (
    <div className="grid gap-3 sm:grid-cols-[220px_1fr] sm:items-center">
      <div className="grid aspect-[16/10] place-items-center overflow-hidden rounded-xl border border-dashed border-line-2 bg-paper">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {preview ? <img src={preview} alt="" className="size-full object-cover object-top" /> : <ImagePlus className="size-7 text-ink-3" aria-hidden />}
      </div>
      <div>
        <div className="flex flex-wrap gap-2">
          <label className={cn("inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-line-2 bg-white px-4 text-[14px] font-bold hover:border-ink-3", busy && "pointer-events-none opacity-60")}>
            <ImagePlus className="size-4" aria-hidden />{busy ? "در حال بارگذاری…" : value ? "تعویض تصویر" : "انتخاب تصویر"}
            <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" disabled={busy} onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ""; }} />
          </label>
          {value && <Btn variant="ghost" onClick={() => onChange("")} disabled={busy}><X aria-hidden />حذف تصویر</Btn>}
        </div>
        <p className="mt-2 text-[12.5px] leading-6 text-ink-3">PNG، JPG یا WebP. تصویر خودکار کوچک و به WebP تبدیل می‌شود. اسکرین‌شات افقی بهترین نتیجه را دارد. اگر تصویر اختصاصی انتخاب شود، به‌جای «تصویر آماده» نمایش داده می‌شود.</p>
      </div>
    </div>
  );
}

/* ============================================================ */
/* پروژه‌ها                                                      */
/* ============================================================ */
export function ProjectsEditor({ session, notify, onDirty }: { session: Session; notify: Notify; onDirty: (d: boolean) => void }) {
  const f = useContentFile<Project[]>(session, "projects.json");
  const [sel, setSel] = useState(0);
  const [tagText, setTagText] = useState<string | null>(null);
  useLeaveGuard(f.dirty);
  useEffect(() => onDirty(f.dirty), [f.dirty, onDirty]);

  const invalid = useMemo(() => {
    if (!f.data) return "";
    for (const [i, p] of f.data.entries()) {
      const err = slugError(p.slug, f.data.filter((_, j) => j !== i).map((x) => x.slug)) || (!p.name.trim() ? "عنوان لازم است" : "");
      if (err) return `«${p.name || "بدون عنوان"}»: ${err}`;
    }
    return "";
  }, [f.data]);

  if (!f.data) return <LoadState error={f.error} onRetry={f.reload} />;
  const list = f.data;
  const i = Math.min(sel, list.length - 1);
  const p = list[i];
  const update = (patch: Partial<Project>) => f.setData(list.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const select = (n: number) => { setSel(n); setTagText(null); };

  const add = () => {
    let n = list.length + 1;
    while (list.some((x) => x.slug === `project-${n}`)) n++;
    f.setData([...list, { slug: `project-${n}`, name: "", published: false, problem: "", solution: "", result: "", image: "", link: "", tags: [] }]);
    select(list.length);
  };

  return (
    <>
      <ListDetail items={list} selected={i} onSelect={select} title="پروژه‌ها" addLabel="جدید" onAdd={add} getTitle={(x) => x.name} getPublished={(x) => x.published}>
        {p ? (
          <div className="grid gap-4">
            <ItemToolbar index={i} count={list.length} published={p.published} onPublished={(v) => update({ published: v })}
              onMove={(to) => { f.setData(move(list, i, to)); setSel(to); }}
              onDelete={() => { if (confirm(`پروژهٔ «${p.name || "بدون عنوان"}» حذف شود؟`)) { f.setData(list.filter((_, j) => j !== i)); select(Math.max(0, i - 1)); } }}
              viewHref={`${base}/projects/`} />
            <Card title="مشخصات پروژه" desc="نمونه‌کار با ساختار «مسئله، راهکار، نتیجه» معرفی می‌شود. اولین پروژهٔ منتشرشده در صفحهٔ اصلی هم نمایش داده می‌شود.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="عنوان *" className="sm:col-span-2"><Input value={p.name} onChange={(e) => update({ name: e.target.value })} placeholder="مثلاً: سامانهٔ مدیریت سفارش‌های شرکت ..." /></Field>
                <Field label="نامک (slug) *" error={slugError(p.slug, list.filter((_, j) => j !== i).map((x) => x.slug))}><Input ltr value={p.slug} onChange={(e) => update({ slug: e.target.value.toLowerCase() })} /></Field>
                <Field label="برچسب‌ها" hint="با ویرگول جدا کنید؛ مثل: Laravel، React، سازمانی">
                  <Input value={tagText ?? p.tags.join("، ")} onChange={(e) => { setTagText(e.target.value); update({ tags: splitTags(e.target.value) }); }} onBlur={() => setTagText(null)} />
                </Field>
                <Field label="مسئله" className="sm:col-span-2"><Textarea value={p.problem} onChange={(e) => update({ problem: e.target.value })} placeholder="کارفرما با چه مشکلی روبه‌رو بود؟" /></Field>
                <Field label="راهکار" className="sm:col-span-2"><Textarea value={p.solution} onChange={(e) => update({ solution: e.target.value })} placeholder="چه چیزی ساختیم و چطور؟" /></Field>
                <Field label="نتیجه" className="sm:col-span-2"><Textarea value={p.result} onChange={(e) => update({ result: e.target.value })} placeholder="نتیجهٔ قابل‌استناد؛ مثلاً کاهش زمان پردازش از ۳ روز به ۲ ساعت" /></Field>
                <div className="sm:col-span-2">
                  <span className="mb-1.5 block text-[13.5px] font-bold text-ink-2">تصویر اختصاصی</span>
                  <ImageUpload session={session} value={p.upload} slug={p.slug} notify={notify} onChange={(v) => update({ upload: v || undefined })} />
                </div>
                <Field label="تصویر آماده" hint={p.upload ? "تا وقتی تصویر اختصاصی دارید، این گزینه استفاده نمی‌شود." : undefined}>
                  <Select value={p.image ?? ""} onChange={(e) => update({ image: e.target.value as Project["image"] })}>
                    <option value="">بدون تصویر</option>
                    <option value="benefits">سامانهٔ رفاهیات (داشبورد)</option>
                    <option value="limoc">لیموسی (Kanban فروش)</option>
                    <option value="limofood">لیموفود (صفحهٔ فروشگاه)</option>
                  </Select>
                </Field>
                <Field label="پیوند «مشاهدهٔ جزئیات»" hint="مسیر داخلی مثل /products/benefits/ یا آدرس کامل؛ خالی = بدون دکمه">
                  <Input ltr value={p.link ?? ""} onChange={(e) => update({ link: e.target.value })} placeholder="/products/benefits/" />
                </Field>
              </div>
            </Card>
          </div>
        ) : <Card><p className="text-ink-3">برای شروع، یک پروژهٔ جدید اضافه کنید.</p></Card>}
      </ListDetail>
      <SaveBar dirty={f.dirty} saving={f.saving} invalid={invalid} onReset={() => { f.reset(); setTagText(null); }}
        onSave={async () => report(notify)(await f.save("پنل مدیریت: به‌روزرسانی پروژه‌ها"))} />
    </>
  );
}

/* ============================================================ */
/* مقالات                                                        */
/* ============================================================ */

/** بدنهٔ مقاله ←→ متن ساده: «## » تیتر، «- » آیتم فهرست، خط خالی = پاراگراف جدید */
export function blocksToText(blocks: ArticleBlock[]) {
  return blocks.map((b) => (b.h ? `## ${b.h}` : b.list ? b.list.map((x) => `- ${x}`).join("\n") : b.p ?? "")).join("\n\n");
}

export function textToBlocks(text: string): ArticleBlock[] {
  const out: ArticleBlock[] = [];
  let para: string[] = [];
  let list: string[] | null = null;
  const flush = () => {
    if (para.length) out.push({ p: para.join(" ") });
    if (list?.length) out.push({ list });
    para = []; list = null;
  };
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) { flush(); continue; }
    if (line.startsWith("## ")) { flush(); out.push({ h: line.slice(3).trim() }); continue; }
    if (/^[-•*] /.test(line)) { if (para.length) { out.push({ p: para.join(" ") }); para = []; } (list ??= []).push(line.slice(2).trim()); continue; }
    if (list) flush();
    para.push(line);
  }
  flush();
  return out;
}

const estimateMinutes = (text: string) => Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 200));

export function ArticlesEditor({ session, notify, onDirty }: { session: Session; notify: Notify; onDirty: (d: boolean) => void }) {
  const f = useContentFile<Article[]>(session, "articles.json");
  const [sel, setSel] = useState(0);
  /** متن خام در حال ویرایش (تا فاصله‌ها و خطوط خالی حین تایپ حذف نشوند) */
  const [draft, setDraft] = useState<string | null>(null);
  useLeaveGuard(f.dirty);
  useEffect(() => onDirty(f.dirty), [f.dirty, onDirty]);

  const invalid = useMemo(() => {
    if (!f.data) return "";
    for (const [i, a] of f.data.entries()) {
      const err = slugError(a.slug, f.data.filter((_, j) => j !== i).map((x) => x.slug))
        || (!a.title.trim() ? "عنوان لازم است" : a.published && a.body.length === 0 ? "مقالهٔ منتشرشده نمی‌تواند بدون متن باشد" : "");
      if (err) return `«${a.title || "بدون عنوان"}»: ${err}`;
    }
    return "";
  }, [f.data]);

  if (!f.data) return <LoadState error={f.error} onRetry={f.reload} />;
  const list = f.data;
  const i = Math.min(sel, list.length - 1);
  const a = list[i];
  const update = (patch: Partial<Article>) => f.setData(list.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const select = (n: number) => { setSel(n); setDraft(null); };
  const bodyText = draft ?? (a ? blocksToText(a.body) : "");

  const add = () => {
    let n = list.length + 1;
    while (list.some((x) => x.slug === `article-${n}`)) n++;
    f.setData([{ slug: `article-${n}`, title: "", excerpt: "", category: "", readMinutes: 3, published: false, body: [] }, ...list]);
    select(0);
  };

  return (
    <>
      <ListDetail items={list} selected={i} onSelect={select} title="مقالات" addLabel="جدید" onAdd={add} getTitle={(x) => x.title} getPublished={(x) => x.published}>
        {a ? (
          <div className="grid gap-4">
            <ItemToolbar index={i} count={list.length} published={a.published} onPublished={(v) => update({ published: v })}
              onMove={(to) => { f.setData(move(list, i, to)); select(to); }}
              onDelete={() => { if (confirm(`مقالهٔ «${a.title || "بدون عنوان"}» حذف شود؟`)) { f.setData(list.filter((_, j) => j !== i)); select(Math.max(0, i - 1)); } }}
              viewHref={a.published ? `${base}/blog/${a.slug}/` : undefined} />
            <Card title="مشخصات مقاله">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="عنوان *" className="sm:col-span-2"><Input value={a.title} onChange={(e) => update({ title: e.target.value })} /></Field>
                <Field label="نامک (slug) *" hint="آدرس مقاله: /blog/نامک/ — تغییر آن آدرس قبلی را از کار می‌اندازد." error={slugError(a.slug, list.filter((_, j) => j !== i).map((x) => x.slug))}>
                  <Input ltr value={a.slug} onChange={(e) => update({ slug: e.target.value.toLowerCase() })} />
                </Field>
                <Field label="دسته‌بندی"><Input value={a.category} onChange={(e) => update({ category: e.target.value })} placeholder="مثلاً: CRM و فروش" /></Field>
                <Field label="خلاصه" hint="در کارت مقاله و نتایج جست‌وجو نمایش داده می‌شود." className="sm:col-span-2"><Textarea value={a.excerpt} onChange={(e) => update({ excerpt: e.target.value })} className="min-h-[80px]" /></Field>
              </div>
            </Card>
            <Card title="متن مقاله">
              <div className="mb-3 flex flex-wrap gap-x-5 gap-y-1 rounded-xl bg-paper px-4 py-2.5 text-[13px] text-ink-2">
                <span><code className="ltr font-bold text-ink">## </code> در ابتدای خط = تیتر</span>
                <span><code className="ltr font-bold text-ink">- </code> در ابتدای خط = آیتم فهرست</span>
                <span>یک خط خالی = پاراگراف جدید</span>
              </div>
              <Textarea value={bodyText} className="min-h-[420px] text-[15.5px] leading-8"
                onChange={(e) => { setDraft(e.target.value); update({ body: textToBlocks(e.target.value) }); }} />
              <div className="mt-4 flex flex-wrap items-end gap-3">
                <Field label="زمان مطالعه (دقیقه)" className="w-40"><Input type="number" min={1} value={a.readMinutes} onChange={(e) => update({ readMinutes: Math.max(1, Number(e.target.value) || 1) })} /></Field>
                <Btn variant="outline" onClick={() => update({ readMinutes: estimateMinutes(bodyText) })}>محاسبهٔ خودکار</Btn>
              </div>
            </Card>
          </div>
        ) : <Card><p className="text-ink-3">برای شروع، یک مقالهٔ جدید اضافه کنید.</p></Card>}
      </ListDetail>
      <SaveBar dirty={f.dirty} saving={f.saving} invalid={invalid} onReset={() => { f.reset(); setDraft(null); }}
        onSave={async () => report(notify)(await f.save("پنل مدیریت: به‌روزرسانی مقالات"))} />
    </>
  );
}
