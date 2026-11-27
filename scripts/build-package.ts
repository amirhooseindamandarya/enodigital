/**
 * ساخت «بستهٔ سایت لیموسی» (site.zip) از دادهٔ سایت + اعتبارسنجی کامل طبق چک‌لیست راهنما.
 * اجرا: npm run package   →   dist/enodigital-site.zip  و  dist/package-report.md
 */
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { zipSync, strToU8 } from "fflate";
import { localSite } from "@/site-content";
import { implementedTypes } from "@/sections/render";
import type { FieldDef, SiteData } from "@/cms/types";

const ROOT = process.cwd();
const site: SiteData = JSON.parse(JSON.stringify(localSite)); // حذف undefined‌ها
const errors: string[] = [];
const warnings: string[] = [];
const err = (where: string, msg: string) => errors.push(`${where}: ${msg}`);
const warn = (where: string, msg: string) => warnings.push(`${where}: ${msg}`);

/* ---------------- قواعد کلید (بخش ۴ راهنما) ---------------- */
const KEY = /^[a-z][a-z0-9_-]*$/;
const FIELD_KEY = /^[a-z][a-zA-Z0-9_-]*$/;
const FORM_FIELD_KEY = /^[a-z][a-z0-9_]{0,49}$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const LANG = /^[a-z]{2}$/;
const IMG_EXT = [".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif"];
const ALLOWED_TAGS = new Set(["p", "br", "strong", "em", "u", "ul", "ol", "li", "h2", "h3", "h4", "a", "blockquote"]);
const FORM_TYPES = new Set(["text", "textarea", "email", "phone", "number", "select", "checkbox"]);

const langs = Object.keys(site.languages);
const defaults = langs.filter((l) => site.languages[l].default);
const DEF = defaults[0];

/* ---------------- سراسری ---------------- */
if (site.format !== "limoc-site") err("format", "باید limoc-site باشد");
if (site.version !== 1) err("version", "باید 1 باشد");
if (!KEY.test(site.website.key)) err("website.key", `قالب نامعتبر: ${site.website.key}`);
if (defaults.length !== 1) err("languages", `دقیقاً یک زبان پیش‌فرض لازم است (الان ${defaults.length})`);
for (const l of langs) if (!LANG.test(l)) err("languages", `کد زبان دوحرفی نیست: ${l}`);

/* ---------------- رسانه ---------------- */
const mediaRefs = new Set<string>();
const zipFiles: Record<string, Uint8Array> = {};
for (const m of site.media) {
  const w = `media[${m.ref}]`;
  if (!KEY.test(m.ref)) err(w, "قالب ref نامعتبر");
  if (mediaRefs.has(m.ref)) err(w, "ref تکراری");
  mediaRefs.add(m.ref);
  const name = basename(m.file);
  if (!m.file.startsWith("media/")) err(w, "فایل باید در پوشهٔ media/ باشد");
  if (!/^[a-z0-9][a-z0-9._-]*$/.test(name)) err(w, `نام فایل باید انگلیسی، کوچک و بدون فاصله باشد: ${name}`);
  if (!IMG_EXT.includes(extname(name).toLowerCase())) err(w, `فرمت مجاز نیست: ${name}`);
  const src = join(ROOT, "public", m.file);
  if (!existsSync(src)) { err(w, `فایل پیدا نشد: public/${m.file}`); continue; }
  if (statSync(src).size > 5 * 1024 * 1024) err(w, "حجم بیش از ۵ مگابایت");
  zipFiles[m.file] = readFileSync(src);
  if (m.alt && !m.alt[DEF as "fa"]) warn(w, "متن جایگزین در زبان پیش‌فرض خالی است");
}

const pageKeys = new Set(site.pages.map((p) => p.key));
const formKeys = new Set(site.forms.map((f) => f.key));
const catKeys = new Set(site.blog.categories.map((c) => c.key));
const postSlugs = new Set(site.blog.posts.map((p) => p.slug));

/* ---------------- بررسی متن ---------------- */
const LOREM = /lorem ipsum|متن نمونه|متن آزمایشی|dolor sit amet/i;
function checkText(where: string, s: string, rich = false) {
  if (LOREM.test(s)) err(where, "متن ساختگی (lorem/متن نمونه)");
  if (/<\s*(script|style|iframe)/i.test(s) || /\son[a-z]+\s*=/i.test(s)) err(where, "تگ یا رویداد غیرمجاز");
  if (rich) {
    for (const [, tag] of s.matchAll(/<\/?\s*([a-zA-Z0-9]+)/g)) if (!ALLOWED_TAGS.has(tag.toLowerCase())) err(where, `تگ غیرمجاز <${tag}>`);
    if (/\s(style|class)\s*=/i.test(s)) err(where, "صفت style/class مجاز نیست");
  } else if (/<[a-z][^>]*>/i.test(s)) warn(where, "HTML در فیلد متنی ساده");
}

/* ---------------- اعتبارسنجی مقدار بر اساس فیلد ---------------- */
function validateValue(where: string, f: FieldDef, v: unknown) {
  if (v === undefined || v === null || v === "") {
    if (f.required) err(where, "فیلد الزامی خالی است");
    // پنل گروهِ خالی را هم با فیلدهای الزامی‌اش می‌سنجد
    if (f.type === "group") validateObject(where, f.children ?? [], {});
    return;
  }
  if (f.translatable) {
    if (typeof v !== "object" || Array.isArray(v)) return err(where, "فیلد ترجمه‌پذیر باید {fa:…, en:…} باشد");
    const o = v as Record<string, unknown>;
    for (const k of Object.keys(o)) if (!langs.includes(k)) err(where, `زبان تعریف‌نشده: ${k}`);
    if (!o[DEF]) err(where, `مقدار زبان پیش‌فرض (${DEF}) خالی است`);
    for (const l of langs) if (typeof o[l] === "string") checkText(`${where}.${l}`, o[l] as string, f.type === "richtext");
    for (const l of langs) if (!o[l]) warn(where, `ترجمهٔ ${l} خالی است`);
    return;
  }
  switch (f.type) {
    case "text": case "textarea": case "url": case "email": case "phone": case "color": case "date": case "datetime":
      if (typeof v !== "string") err(where, "باید رشته باشد");
      else if (f.type === "url" && !/^https?:\/\//.test(v)) err(where, "آدرس کامل (https://…) لازم است");
      else checkText(where, v);
      break;
    case "richtext": if (typeof v !== "string") err(where, "باید رشته باشد"); else checkText(where, v, true); break;
    case "number": case "integer": case "decimal": if (typeof v !== "number") err(where, "باید عدد باشد"); break;
    case "boolean": if (typeof v !== "boolean") err(where, "باید true/false باشد"); break;
    case "select": if (!f.options?.some((o) => o.value === v)) err(where, `مقدار «${String(v)}» در گزینه‌ها نیست`); break;
    case "multiselect": for (const x of v as unknown[]) if (!f.options?.some((o) => o.value === x)) err(where, `مقدار «${String(x)}» در گزینه‌ها نیست`); break;
    case "image": case "file": { const r = (v as { media?: string }).media; if (!r || !mediaRefs.has(r)) err(where, `رسانهٔ تعریف‌نشده: ${r}`); break; }
    case "images": case "files": for (const x of v as { media?: string }[]) if (!x.media || !mediaRefs.has(x.media)) err(where, `رسانهٔ تعریف‌نشده: ${x.media}`); break;
    case "page_reference": { const r = (v as { page?: string }).page; if (!r || !pageKeys.has(r)) err(where, `صفحهٔ تعریف‌نشده: ${r}`); break; }
    case "post_reference": { const r = (v as { post?: string }).post; if (!r || !postSlugs.has(r)) err(where, `نوشتهٔ تعریف‌نشده: ${r}`); break; }
    case "category_reference": { const r = (v as { category?: string }).category; if (!r || !catKeys.has(r)) err(where, `دستهٔ تعریف‌نشده: ${r}`); break; }
    case "form_reference": { const r = (v as { form?: string }).form; if (!r || !formKeys.has(r)) err(where, `فرم تعریف‌نشده: ${r}`); break; }
    case "repeater":
      if (!Array.isArray(v)) return err(where, "باید آرایه باشد");
      if (f.required && v.length === 0) err(where, "حداقل یک ردیف لازم است");
      v.forEach((row, i) => validateObject(`${where}[${i}]`, f.children ?? [], row as Record<string, unknown>));
      break;
    case "group": validateObject(where, f.children ?? [], v as Record<string, unknown>); break;
    case "json": break;
  }
}

function validateObject(where: string, fields: FieldDef[], obj: Record<string, unknown>) {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) return err(where, "باید شیء باشد");
  const keys = new Set(fields.map((f) => f.key));
  for (const k of Object.keys(obj)) if (!keys.has(k)) err(where, `کلید «${k}» در تعریف فیلدها نیست`);
  for (const f of fields) validateValue(`${where}.${f.key}`, f, obj[f.key]);
}

function validateFieldDefs(where: string, fields: FieldDef[], nested = false) {
  const seen = new Set<string>();
  for (const f of fields) {
    if (!FIELD_KEY.test(f.key)) err(where, `کلید فیلد نامعتبر: ${f.key}`);
    if (seen.has(f.key)) err(where, `کلید فیلد تکراری: ${f.key}`);
    seen.add(f.key);
    if (!f.label) err(`${where}.${f.key}`, "label لازم است");
    if ((f.type === "select" || f.type === "multiselect") && !f.options?.length) err(`${where}.${f.key}`, "options لازم است");
    if (f.type === "repeater" || f.type === "group") {
      if (nested) err(`${where}.${f.key}`, "repeater/group داخل repeater/group دیگر پشتیبانی نمی‌شود");
      validateFieldDefs(`${where}.${f.key}`, f.children ?? [], true);
    }
  }
}

/* ---------------- انواع سکشن و گروه‌های سراسری ---------------- */
for (const [k, st] of Object.entries(site.sectionTypes)) {
  if (!KEY.test(k)) err(`sectionTypes.${k}`, "قالب کلید نامعتبر");
  validateFieldDefs(`sectionTypes.${k}`, st.fields);
  if (!implementedTypes.includes(k)) warn(`sectionTypes.${k}`, "فرانت برای این نوع کامپوننت ندارد");
}
for (const [k, g] of Object.entries(site.globalGroups)) {
  if (!KEY.test(k)) err(`globalGroups.${k}`, "قالب کلید نامعتبر");
  validateFieldDefs(`globalGroups.${k}`, g.fields);
  validateObject(`globalGroups.${k}.content`, g.fields, g.content);
}

/* ---------------- فرم‌ها ---------------- */
for (const f of site.forms) {
  const w = `forms[${f.key}]`;
  if (!KEY.test(f.key)) err(w, "قالب کلید نامعتبر");
  if (f.fields.length > 30) err(w, "بیش از ۳۰ فیلد");
  if (!f.texts[DEF as "fa"]) err(w, "متن‌های زبان پیش‌فرض لازم است");
  const seen = new Set<string>();
  for (const x of f.fields) {
    if (!FORM_FIELD_KEY.test(x.key)) err(w, `کلید فیلد نامعتبر: ${x.key}`);
    if (seen.has(x.key)) err(w, `کلید فیلد تکراری: ${x.key}`);
    seen.add(x.key);
    if (!FORM_TYPES.has(x.type)) err(w, `نوع فیلد مجاز نیست: ${x.type}`);
    if (!x.labels[DEF as "fa"]) err(w, `عنوان فیلد ${x.key} در زبان پیش‌فرض لازم است`);
    if (x.type === "select" && !x.options?.length) err(w, `فیلد ${x.key} گزینه ندارد`);
  }
}

/* ---------------- صفحات ---------------- */
const pageKeySeen = new Set<string>();
const slugSeen: Record<string, Set<string>> = Object.fromEntries(langs.map((l) => [l, new Set()]));
for (const p of site.pages) {
  const w = `pages[${p.key}]`;
  if (!KEY.test(p.key)) err(w, "قالب کلید نامعتبر");
  if (pageKeySeen.has(p.key)) err(w, "کلید تکراری");
  pageKeySeen.add(p.key);
  if (!p.translations[DEF as "fa"]) err(w, "ترجمهٔ زبان پیش‌فرض لازم است");
  for (const [l, tr] of Object.entries(p.translations)) {
    if (!langs.includes(l)) err(w, `زبان تعریف‌نشده ${l}`);
    if (tr.slug && !SLUG.test(tr.slug)) err(w, `slug نامعتبر (${l}): ${tr.slug}`);
    if (tr.slug.includes("/")) err(w, "slug نباید / داشته باشد");
    if (slugSeen[l]?.has(tr.slug)) err(w, `slug تکراری در ${l}: «${tr.slug}»`);
    slugSeen[l]?.add(tr.slug);
  }
  for (const [l, seo] of Object.entries(p.seo ?? {})) {
    const d = seo?.meta_description ?? "";
    if (!d) warn(w, `meta_description (${l}) خالی است`);
    else if (d.length > 160) err(w, `meta_description (${l}) ${d.length} نویسه است؛ حداکثر ۱۶۰`);
  }
  p.sections.forEach((s, i) => {
    const sw = `${w}.sections[${i}:${s.type}]`;
    const def = site.sectionTypes[s.type];
    if (!def) return err(sw, "نوع سکشن تعریف نشده");
    if (!s.name) err(sw, "name لازم است");
    validateObject(sw, def.fields, s.content);
  });
}
for (const l of langs) if (!site.pages.some((p) => p.status === "published" && p.translations[l as "fa"]?.slug === "")) (l === DEF ? err : warn)("pages", `صفحهٔ اصلی با slug خالی در ${l} وجود ندارد`);

/* ---------------- منوها ---------------- */
for (const m of site.menus) {
  if (!KEY.test(m.key)) err(`menus[${m.key}]`, "قالب کلید نامعتبر");
  const walk = (items: typeof m.items, where: string) => items.forEach((it, i) => {
    const w = `${where}[${i}]`;
    if (!it.label?.[DEF as "fa"]) err(w, "label زبان پیش‌فرض لازم است");
    if (it.page && !pageKeys.has(it.page)) err(w, `صفحهٔ تعریف‌نشده: ${it.page}`);
    if (it.url && !/^(https?:\/\/|\/)/.test(it.url)) err(w, `url نامعتبر: ${it.url}`);
    if (!it.page && !it.url && !it.children?.length) err(w, "آیتم باید page، url یا children داشته باشد");
    walk(it.children ?? [], `${w}.children`);
  });
  walk(m.items, `menus[${m.key}].items`);
}

/* ---------------- بلاگ ---------------- */
for (const c of site.blog.categories) if (!KEY.test(c.key)) err(`blog.categories[${c.key}]`, "قالب کلید نامعتبر");
for (const p of site.blog.posts) {
  const w = `blog.posts[${p.slug}]`;
  if (!SLUG.test(p.slug)) err(w, "slug نامعتبر");
  for (const c of p.categories ?? []) if (!catKeys.has(c)) err(w, `دستهٔ تعریف‌نشده: ${c}`);
  if (p.featured_image && !mediaRefs.has(p.featured_image.media)) err(w, `رسانهٔ تعریف‌نشده: ${p.featured_image.media}`);
  if (!p.translations[DEF as "fa"]) err(w, "ترجمهٔ زبان پیش‌فرض لازم است");
  for (const [l, tr] of Object.entries(p.translations)) {
    if (!tr?.title) err(w, `عنوان (${l}) خالی است`);
    checkText(`${w}.${l}.content`, tr?.content ?? "", true);
    if ((tr?.excerpt ?? "").length > 300) warn(w, `خلاصهٔ ${l} طولانی است`);
  }
}

/* ---------------- ریدایرکت‌ها ---------------- */
for (const r of site.redirects) if (![301, 302].includes(r.code)) err(`redirects[${r.from}]`, "code باید 301 یا 302 باشد");

/* ---------------- خروجی ---------------- */
const outDir = join(ROOT, "dist");
mkdirSync(outDir, { recursive: true });
const json = JSON.stringify(site, null, 2);
JSON.parse(json); // اطمینان از JSON معتبر

const count = (sel: (s: SiteData) => number) => sel(site);
const report = [
  `# گزارش بستهٔ سایت — ${site.website.key}`,
  "",
  `- قالب: ${site.format} نسخهٔ ${site.version}`,
  `- زبان‌ها: ${langs.map((l) => `${l}${site.languages[l].default ? " (پیش‌فرض)" : ""}`).join("، ")}`,
  `- انواع سکشن: ${Object.keys(site.sectionTypes).length}`,
  `- گروه‌های سراسری: ${Object.keys(site.globalGroups).join("، ")}`,
  `- صفحات: ${count((s) => s.pages.length)} — ${site.pages.map((p) => `${p.key} (${p.sections.length} سکشن)`).join("، ")}`,
  `- فرم‌ها: ${site.forms.map((f) => `${f.key} (${f.fields.length} فیلد)`).join("، ")}`,
  `- منوها: ${site.menus.map((m) => m.key).join("، ")}`,
  `- بلاگ: ${site.blog.categories.length} دسته، ${site.blog.posts.length} نوشته`,
  `- رسانه: ${site.media.length} فایل`,
  `- ریدایرکت: ${site.redirects.length}`,
  "",
  `## خطاها (${errors.length})`,
  ...(errors.length ? errors.map((e) => `- ${e}`) : ["- هیچ"]),
  "",
  `## هشدارها (${warnings.length})`,
  ...(warnings.length ? warnings.map((e) => `- ${e}`) : ["- هیچ"]),
  "",
].join("\n");
writeFileSync(join(outDir, "package-report.md"), report);

if (errors.length) {
  console.error(report);
  console.error(`\n✗ ${errors.length} خطا؛ بسته ساخته نشد.`);
  process.exit(1);
}
zipFiles["site.json"] = strToU8(json);
writeFileSync(join(outDir, "site.json"), json);
const zip = zipSync(zipFiles, { level: 9 });
const zipPath = join(outDir, `${site.website.key}-site.zip`);
writeFileSync(zipPath, zip);
console.log(report);
console.log(`✓ ${zipPath} (${(zip.length / 1024).toFixed(0)} KB، ${Object.keys(zipFiles).length} فایل)`);
