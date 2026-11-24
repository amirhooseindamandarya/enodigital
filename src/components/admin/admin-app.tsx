"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle, BookOpen, Briefcase, CheckCircle2, ChevronDown, ExternalLink, Globe, KeyRound, Loader2, LogOut, RefreshCw, Settings as SettingsIcon, XCircle } from "lucide-react";
import mark from "@/assets/brand/logo-mark.png";
import { cn } from "@/lib/utils";
import { checkAccess, defaultConfig, explainError, latestRuns, type DeployRun, type RepoConfig } from "./github";
import { Btn, Field, Input, type Session } from "./ui";
import { ArticlesEditor, ProjectsEditor, SettingsEditor, type Notify } from "./editors";

const STORE_KEY = "eno-admin-session";

function loadSession(): Session | null {
  for (const store of ["sessionStorage", "localStorage"] as const) {
    try {
      const raw = window[store].getItem(STORE_KEY);
      if (raw) return JSON.parse(raw) as Session;
    } catch { /* دسترسی به حافظهٔ مرورگر ممکن نیست */ }
  }
  return null;
}
function saveSession(s: Session, remember: boolean) {
  try { (remember ? localStorage : sessionStorage).setItem(STORE_KEY, JSON.stringify(s)); } catch { /* نادیده */ }
}
function clearSession() {
  try { localStorage.removeItem(STORE_KEY); sessionStorage.removeItem(STORE_KEY); } catch { /* نادیده */ }
}

export function AdminApp() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  useEffect(() => setSession(loadSession()), []);

  if (session === undefined) return <div className="grid min-h-dvh place-items-center bg-paper"><Loader2 className="size-6 animate-spin text-ink-3" aria-hidden /></div>;
  if (!session) return <Login onLogin={setSession} />;
  return <Shell session={session} onLogout={() => { clearSession(); setSession(null); }} />;
}

/* ============================================================ */
/* ورود                                                          */
/* ============================================================ */
function Login({ onLogin }: { onLogin: (s: Session) => void }) {
  const [token, setToken] = useState("");
  const [cfg, setCfg] = useState<RepoConfig>(defaultConfig);
  const [remember, setRemember] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setBusy(true);
    const s = { cfg, token: token.trim() };
    try {
      await checkAccess(s.cfg, s.token);
      saveSession(s, remember);
      onLogin(s);
    } catch (err) {
      setError(explainError(err));
    } finally { setBusy(false); }
  };

  return (
    <div className="surface-dark relative grid min-h-dvh place-items-center overflow-hidden px-4 py-12">
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0" />
      <form onSubmit={submit} className="relative w-full max-w-[440px] rounded-3xl bg-white p-7 text-ink shadow-[var(--shadow-float)] sm:p-9">
        <div className="flex items-center gap-3">
          <Image src={mark} alt="" className="h-9 w-auto" />
          <div>
            <h1 className="text-[20px] font-extrabold leading-7 text-ink!">پنل مدیریت محتوا</h1>
            <p className="text-[13px] text-ink-3">اِنو دیجیتال</p>
          </div>
        </div>
        <p className="mt-6 text-[14px] leading-7 text-ink-2">
          برای ورود، یک <b>توکن دسترسی GitHub</b> با مجوز نوشتن روی مخزن سایت لازم است. تغییرات شما مستقیم در مخزن ذخیره و سایت خودکار به‌روز می‌شود.
        </p>

        <Field label="توکن دسترسی" className="mt-5" error={error}>
          <Input ltr type="password" autoComplete="current-password" required value={token} onChange={(e) => setToken(e.target.value)} placeholder="github_pat_..." />
        </Field>

        <label className="mt-4 flex items-center gap-2 text-[14px] text-ink-2">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="size-4 accent-[var(--color-amber)]" />
          مرا در این مرورگر به خاطر بسپار
        </label>

        <Btn type="submit" loading={busy} className="mt-6 h-12 w-full text-[15px]"><KeyRound aria-hidden />ورود</Btn>

        <button type="button" onClick={() => setAdvanced((v) => !v)} aria-expanded={advanced} className="mt-6 flex w-full items-center justify-between border-t border-line pt-4 text-[13px] font-bold text-ink-3">
          مخزن: <span dir="ltr" className="font-mono font-normal">{cfg.owner}/{cfg.repo} @ {cfg.branch}</span>
          <ChevronDown className={cn("size-4 transition-transform", advanced && "rotate-180")} aria-hidden />
        </button>
        {advanced && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Field label="مالک"><Input ltr value={cfg.owner} onChange={(e) => setCfg({ ...cfg, owner: e.target.value.trim() })} /></Field>
            <Field label="مخزن"><Input ltr value={cfg.repo} onChange={(e) => setCfg({ ...cfg, repo: e.target.value.trim() })} /></Field>
            <Field label="شاخه" className="col-span-2"><Input ltr value={cfg.branch} onChange={(e) => setCfg({ ...cfg, branch: e.target.value.trim() })} /></Field>
          </div>
        )}

        <details className="mt-4 rounded-xl bg-paper p-4 text-[13px] leading-7 text-ink-2">
          <summary className="cursor-pointer font-bold text-ink">چطور توکن بسازم؟</summary>
          <ol className="mt-2 list-decimal space-y-1 ps-5">
            <li>در GitHub به <b>Settings ← Developer settings ← Personal access tokens ← Fine-grained tokens</b> بروید.</li>
            <li><b>Generate new token</b> را بزنید و در Repository access فقط مخزن <span dir="ltr">{cfg.repo}</span> را انتخاب کنید.</li>
            <li>در Permissions، گزینهٔ <b>Contents</b> را روی <b>Read and write</b> و <b>Actions</b> را روی <b>Read-only</b> بگذارید.</li>
            <li>توکن ساخته‌شده را اینجا وارد کنید. آن را با کسی به اشتراک نگذارید.</li>
          </ol>
        </details>
      </form>
    </div>
  );
}

/* ============================================================ */
/* پوستهٔ پنل                                                    */
/* ============================================================ */
const tabs = [
  { id: "projects", label: "پروژه‌ها", icon: Briefcase, desc: "نمونه‌کارهایی که در صفحهٔ پروژه‌ها و صفحهٔ اصلی نمایش داده می‌شوند." },
  { id: "articles", label: "مقالات", icon: BookOpen, desc: "نوشته‌های بخش مقالات؛ پیش‌نویس‌ها در سایت دیده نمی‌شوند." },
  { id: "settings", label: "تنظیمات سایت", icon: SettingsIcon, desc: "اطلاعات تماس، شبکه‌های اجتماعی و متن‌های معرفی." },
] as const;
type TabId = (typeof tabs)[number]["id"];

type Toast = { id: number; msg: string; tone: "ok" | "err" };

function Shell({ session, onLogout }: { session: Session; onLogout: () => void }) {
  const [tab, setTab] = useState<TabId>("projects");
  const [dirty, setDirty] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [deployKey, setDeployKey] = useState(0);
  const current = tabs.find((t) => t.id === tab)!;

  const notify: Notify = useCallback((msg, tone = "ok") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), tone === "err" ? 9000 : 5000);
    if (tone === "ok") setTimeout(() => setDeployKey((k) => k + 1), 2500);
  }, []);

  const switchTab = (id: TabId) => {
    if (id === tab) return;
    if (dirty && !confirm("تغییرات ذخیره‌نشده از بین می‌رود. ادامه می‌دهید؟")) return;
    setDirty(false);
    setTab(id);
  };

  return (
    <div className="min-h-dvh bg-paper">
      <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Image src={mark} alt="" className="h-7 w-auto" />
            <span className="text-[16px] font-extrabold">پنل مدیریت</span>
            <span dir="ltr" className="hidden rounded-md bg-paper px-2 py-0.5 font-mono text-[12px] text-ink-3 ring-1 ring-line md:inline">{session.cfg.repo}@{session.cfg.branch}</span>
          </div>
          <div className="flex items-center gap-1">
            <Link href="/" target="_blank" className="inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-[14px] font-bold text-ink-2 hover:bg-paper"><Globe className="size-4" aria-hidden /><span className="hidden sm:inline">مشاهدهٔ سایت</span></Link>
            <Btn variant="ghost" onClick={() => { if (!dirty || confirm("تغییرات ذخیره‌نشده از بین می‌رود. خارج می‌شوید؟")) onLogout(); }}><LogOut aria-hidden /><span className="hidden sm:inline">خروج</span></Btn>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1280px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_1fr] lg:py-8">
        <nav aria-label="بخش‌های پنل" className="lg:sticky lg:top-24 lg:self-start">
          <ul className="flex gap-1 overflow-x-auto rounded-2xl border border-line bg-white p-1.5 lg:grid">
            {tabs.map((t) => (
              <li key={t.id} className="shrink-0">
                <button type="button" onClick={() => switchTab(t.id)} aria-current={t.id === tab ? "page" : undefined}
                  className={cn("flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[14.5px] font-bold transition-colors", t.id === tab ? "bg-navy text-white" : "text-ink-2 hover:bg-paper hover:text-ink")}>
                  <t.icon className="size-[18px]" aria-hidden />{t.label}
                </button>
              </li>
            ))}
          </ul>
          <DeployStatus session={session} refreshKey={deployKey} className="mt-4 hidden lg:block" />
        </nav>

        <main className="min-w-0">
          <div className="mb-5">
            <h1 className="text-[24px] font-extrabold">{current.label}</h1>
            <p className="mt-1 text-[14px] text-ink-3">{current.desc}</p>
          </div>
          {tab === "projects" && <ProjectsEditor session={session} notify={notify} onDirty={setDirty} />}
          {tab === "articles" && <ArticlesEditor session={session} notify={notify} onDirty={setDirty} />}
          {tab === "settings" && <SettingsEditor session={session} notify={notify} onDirty={setDirty} />}
          <DeployStatus session={session} refreshKey={deployKey} className="mt-8 lg:hidden" />
        </main>
      </div>

      <div aria-live="polite" className="pointer-events-none fixed inset-x-4 top-20 z-50 grid justify-items-center gap-2 sm:inset-x-auto sm:end-6">
        {toasts.map((t) => (
          <div key={t.id} role={t.tone === "err" ? "alert" : "status"}
            className={cn("pointer-events-auto flex max-w-md items-start gap-2.5 rounded-xl px-4 py-3 text-[14px] font-semibold leading-6 shadow-[var(--shadow-lift)]", t.tone === "ok" ? "bg-navy text-white" : "bg-sun text-white")}>
            {t.tone === "ok" ? <CheckCircle2 className="mt-0.5 size-[18px] shrink-0 text-teal" aria-hidden /> : <AlertCircle className="mt-0.5 size-[18px] shrink-0" aria-hidden />}
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================ */
/* وضعیت انتشار                                                  */
/* ============================================================ */
const timeAgo = (iso: string) => {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat("fa", { numeric: "auto" });
  if (s < 60) return "لحظاتی پیش";
  if (s < 3600) return rtf.format(-Math.round(s / 60), "minute");
  if (s < 86400) return rtf.format(-Math.round(s / 3600), "hour");
  return rtf.format(-Math.round(s / 86400), "day");
};

function RunIcon({ run }: { run: DeployRun }) {
  if (run.status !== "completed") return <Loader2 className="size-4 shrink-0 animate-spin text-amber-ink" aria-label="در حال انتشار" />;
  if (run.conclusion === "success") return <CheckCircle2 className="size-4 shrink-0 text-teal-700" aria-label="موفق" />;
  return <XCircle className="size-4 shrink-0 text-sun" aria-label="ناموفق" />;
}

function DeployStatus({ session, refreshKey, className }: { session: Session; refreshKey: number; className?: string }) {
  const [runs, setRuns] = useState<DeployRun[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setRuns(await latestRuns(session.cfg, session.token)); setError(""); }
    catch (e) { setError(explainError(e)); }
    finally { setLoading(false); }
  }, [session]);

  useEffect(() => { load(); }, [load, refreshKey]);

  // تا وقتی انتشاری در جریان است، هر ۱۵ ثانیه وضعیت را تازه می‌کنیم
  const active = runs?.some((r) => r.status !== "completed");
  useEffect(() => {
    if (!active) return;
    timer.current = setTimeout(load, 15000);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [active, runs, load]);

  const last = runs?.[0];
  return (
    <section className={cn("rounded-2xl border border-line bg-white p-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-[13.5px] font-bold text-ink-3">وضعیت انتشار سایت</h2>
        <button type="button" onClick={load} aria-label="تازه‌سازی" className="grid size-8 place-items-center rounded-lg text-ink-3 hover:bg-paper hover:text-ink">
          <RefreshCw className={cn("size-4", loading && "animate-spin")} aria-hidden />
        </button>
      </div>
      {error ? <p className="mt-2 text-[12.5px] leading-6 text-ink-3">نمایش وضعیت ممکن نیست؛ برای دیدن آن، دسترسی Actions (Read-only) را به توکن بدهید.</p>
        : !runs ? <div className="mt-3 h-10 animate-pulse rounded-lg bg-line/60" />
        : runs.length === 0 ? <p className="mt-2 text-[13px] text-ink-3">هنوز انتشاری ثبت نشده است.</p>
        : (
          <>
            {last && (
              <p className={cn("mt-2 rounded-lg px-3 py-2 text-[13px] font-bold",
                last.status !== "completed" ? "bg-amber/10 text-amber-ink" : last.conclusion === "success" ? "bg-teal/10 text-teal-700" : "bg-sun/10 text-sun")}>
                {last.status !== "completed" ? "در حال به‌روزرسانی سایت…" : last.conclusion === "success" ? "سایت به‌روز است" : "آخرین انتشار ناموفق بود"}
              </p>
            )}
            <ul className="mt-3 grid gap-2">
              {runs.slice(0, 5).map((r) => (
                <li key={r.id}>
                  <a href={r.html_url} target="_blank" rel="noopener" className="group flex items-start gap-2 text-[12.5px] leading-5">
                    <span className="mt-0.5"><RunIcon run={r} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-1 text-ink-2 group-hover:text-ink">{r.head_commit?.message.split("\n")[0] ?? "انتشار"}</span>
                      <span className="text-ink-3">{timeAgo(r.created_at)}</span>
                    </span>
                    <ExternalLink className="mt-0.5 size-3.5 shrink-0 text-ink-3 opacity-0 group-hover:opacity-100" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
    </section>
  );
}
