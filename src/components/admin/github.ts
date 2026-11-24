/**
 * لایهٔ ارتباط پنل مدیریت با GitHub.
 * سایت ایستاست (GitHub Pages)، پس «ذخیره» یعنی یک commit روی فایل‌های src/content/*.json؛
 * گردش‌کار انتشار با هر commit سایت را دوباره می‌سازد و منتشر می‌کند.
 */

const API = "https://api.github.com";

export type RepoConfig = { owner: string; repo: string; branch: string };

const [defOwner, defRepo] = (process.env.NEXT_PUBLIC_ADMIN_REPO || "amirhooseindamandarya/enodigital").split("/");
export const defaultConfig: RepoConfig = {
  owner: defOwner,
  repo: defRepo,
  branch: process.env.NEXT_PUBLIC_ADMIN_BRANCH || "main",
};

export const contentPath = (file: string) => `src/content/${file}`;

export class GhError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/** پیام خطای قابل فهم برای کاربر فارسی‌زبان */
export function explainError(e: unknown): string {
  if (e instanceof GhError) {
    if (e.status === 401) return "توکن نامعتبر است یا منقضی شده. دوباره وارد شوید.";
    if (e.status === 403) return "این توکن اجازهٔ این کار را ندارد (دسترسی Contents: Read and write لازم است) یا محدودیت تعداد درخواست GitHub پر شده است.";
    if (e.status === 404) return "مخزن، شاخه یا فایل پیدا نشد. نام مخزن و شاخه را بررسی کنید.";
    if (e.status === 409) return "این فایل در همین فاصله جای دیگری تغییر کرده است. صفحه را دوباره بارگذاری کنید.";
    if (e.status === 422) return "GitHub تغییر را نپذیرفت: " + e.message;
    return `خطای GitHub (${e.status}): ${e.message}`;
  }
  if (e instanceof TypeError) return "ارتباط با GitHub برقرار نشد. اتصال اینترنت را بررسی کنید.";
  return e instanceof Error ? e.message : "خطای ناشناخته";
}

async function gh<T>(token: string, path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(API + path, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new GhError(res.status, body.message || res.statusText);
  }
  return res.json() as Promise<T>;
}

/* base64 ←→ UTF-8 (متن فارسی) */
function decodeBase64(b64: string) {
  const bin = atob(b64.replace(/\s/g, ""));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}
function encodeBase64(text: string) {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

const repoPath = (c: RepoConfig) => `/repos/${encodeURIComponent(c.owner)}/${encodeURIComponent(c.repo)}`;

/** بررسی توکن: مخزن در دسترس است و اجازهٔ نوشتن دارد؟ */
export async function checkAccess(cfg: RepoConfig, token: string) {
  const repo = await gh<{ full_name: string; permissions?: { push?: boolean } }>(token, repoPath(cfg));
  await gh(token, `${repoPath(cfg)}/branches/${encodeURIComponent(cfg.branch)}`);
  if (repo.permissions && !repo.permissions.push) throw new GhError(403, "no push permission");
  return repo.full_name;
}

export async function readJson<T>(cfg: RepoConfig, token: string, file: string): Promise<{ data: T; sha: string }> {
  const res = await gh<{ content: string; sha: string }>(token, `${repoPath(cfg)}/contents/${contentPath(file)}?ref=${encodeURIComponent(cfg.branch)}`);
  return { data: JSON.parse(decodeBase64(res.content)) as T, sha: res.sha };
}

export async function writeJson(cfg: RepoConfig, token: string, file: string, data: unknown, sha: string, message: string) {
  const res = await gh<{ content: { sha: string } }>(token, `${repoPath(cfg)}/contents/${contentPath(file)}`, {
    method: "PUT",
    body: JSON.stringify({ message, content: encodeBase64(JSON.stringify(data, null, 2) + "\n"), sha, branch: cfg.branch }),
  });
  return res.content.sha;
}

export type DeployRun = {
  id: number;
  status: "queued" | "in_progress" | "completed" | string;
  conclusion: "success" | "failure" | "cancelled" | null | string;
  created_at: string;
  html_url: string;
  head_commit?: { message: string };
};

/** آخرین اجراهای گردش‌کار انتشار (برای نمایش وضعیت به‌روزرسانی سایت) */
export async function latestRuns(cfg: RepoConfig, token: string) {
  const res = await gh<{ workflow_runs: DeployRun[] }>(token, `${repoPath(cfg)}/actions/runs?branch=${encodeURIComponent(cfg.branch)}&per_page=6`);
  return res.workflow_runs;
}

/** افزودن یک فایل دودویی جدید به مخزن (مثلاً تصویر). content باید base64 باشد. */
export async function uploadFile(cfg: RepoConfig, token: string, path: string, base64: string, message: string) {
  await gh(token, `${repoPath(cfg)}/contents/${path}`, {
    method: "PUT",
    body: JSON.stringify({ message, content: base64, branch: cfg.branch }),
  });
}

/**
 * آماده‌سازی تصویر در مرورگر: کوچک کردن تا عرض ۱۶۰۰ پیکسل و تبدیل به WebP
 * تا حجم مخزن و سایت کم بماند.
 */
export async function prepareImage(file: File, maxWidth = 1600): Promise<{ blob: Blob; base64: string; url: string }> {
  if (!file.type.startsWith("image/")) throw new Error("فقط فایل تصویری قابل بارگذاری است.");
  if (file.size > 15 * 1024 * 1024) throw new Error("حجم تصویر بیش از ۱۵ مگابایت است.");
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  let blob: Blob | null = null;
  for (const q of [0.85, 0.7, 0.55]) {
    blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", q));
    if (blob && blob.size < 900 * 1024) break;
  }
  if (!blob) throw new Error("تبدیل تصویر ممکن نشد.");
  const buf = new Uint8Array(await blob.arrayBuffer());
  let bin = "";
  for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  return { blob, base64: btoa(bin), url: URL.createObjectURL(blob) };
}
