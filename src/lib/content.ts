import type { IconName } from "@/components/ui/icon";

/* ---------------- خدمات توسعهٔ نرم‌افزار سفارشی ---------------- */
export const services: { icon: IconName; title: string; desc: string }[] = [
  { icon: "search", title: "تحلیل نیازمندی‌ها", desc: "فرایندها، ذی‌نفعان و قیود را می‌شناسیم و دامنهٔ پروژه را شفاف می‌کنیم." },
  { icon: "pen", title: "طراحی UI/UX", desc: "جریان کاربر، وایرفریم و رابط نهایی؛ ساده برای کاربر، دقیق برای مدیر." },
  { icon: "code", title: "توسعهٔ وب‌اپلیکیشن", desc: "سامانه‌های تحت وب پایدار، امن و قابل توسعه." },
  { icon: "layers", title: "سیستم‌های مدیریت داخلی", desc: "اتوماسیون فرایندهای درون‌سازمانی و حذف کار دستی." },
  { icon: "chart", title: "داشبوردهای مدیریتی", desc: "تبدیل داده‌های پراکنده به گزارش‌های قابل تصمیم‌گیری." },
  { icon: "plug", title: "API و یکپارچه‌سازی", desc: "اتصال سامانه‌های موجود، درگاه‌ها و سرویس‌های بیرونی." },
  { icon: "lifebuoy", title: "توسعه و پشتیبانی", desc: "نگهداری، بهبود مستمر و پاسخ‌گویی پس از استقرار." },
];

export const processSteps = [
  { title: "شناخت مسئله", desc: "گفت‌وگو با ذی‌نفعان، بررسی فرایند فعلی و تعریف معیار موفقیت." },
  { title: "تحلیل و پیشنهاد راهکار", desc: "دامنه، معماری پیشنهادی، زمان‌بندی و مدل همکاری." },
  { title: "طراحی", desc: "جریان‌های کاربری و رابط کاربری، پیش از نوشتن کد تأیید می‌شود." },
  { title: "توسعه و آزمون", desc: "توسعهٔ مرحله‌ای با تحویل‌های قابل بررسی و آزمون مستمر." },
  { title: "استقرار و پشتیبانی", desc: "راه‌اندازی روی زیرساخت شما، آموزش و پشتیبانی پس از تحویل." },
];

export const approach: { icon: IconName; title: string; desc: string }[] = [
  { icon: "target", title: "مسئله، پیش از راهکار", desc: "اول می‌فهمیم چه چیزی باید بهتر شود؛ بعد تصمیم می‌گیریم چه بسازیم." },
  { icon: "pen", title: "تجربهٔ کاربری اصولی", desc: "رابط‌هایی که کاربران واقعی بدون آموزش طولانی از آن استفاده کنند." },
  { icon: "code", title: "توسعهٔ قابل نگهداری", desc: "معماری لایه‌بندی‌شده، کد خوانا و مستندسازی برای توسعهٔ بعدی." },
  { icon: "lifebuoy", title: "همراهی پس از تحویل", desc: "پشتیبانی، رفع اشکال و بهبود بر اساس استفادهٔ واقعی." },
];

export const customUseCases = [
  "فرایند شما خاص است و نرم‌افزارهای آماده فقط بخشی از آن را پوشش می‌دهند",
  "چند سامانهٔ جدا دارید که باید با هم یکپارچه شوند",
  "دادهٔ حساس دارید و می‌خواهید سامانه روی زیرساخت خودتان باشد",
  "به داشبورد و گزارشی نیاز دارید که از چند منبع داده تغذیه شود",
  "می‌خواهید یک محصول دیجیتال جدید را از ایده تا بازار برسانید",
];

export const systemTypes: { icon: IconName; title: string; desc: string }[] = [
  { icon: "building", title: "سامانه‌های سازمانی", desc: "اتوماسیون اداری، درخواست‌ها، گردش‌کار و تأییدها" },
  { icon: "wallet", title: "سامانه‌های مالی و تسویه", desc: "کیف پول، اعتبار، تراکنش و تسویه با طرف‌های قرارداد" },
  { icon: "store", title: "پلتفرم‌های فروش و سفارش", desc: "فروشگاه، سفارش‌گیری و پنل فروشندگان" },
  { icon: "chart", title: "داشبورد و هوش تجاری", desc: "گزارش‌های مدیریتی از داده‌های چند سامانه" },
  { icon: "plug", title: "یکپارچه‌سازی و API", desc: "اتصال نرم‌افزارهای موجود، پیامک و درگاه‌ها" },
  { icon: "phone", title: "وب‌اپ موبایل‌محور", desc: "پنل‌هایی که برای کار با گوشی طراحی شده‌اند" },
];

export const engagementModels = [
  { title: "پروژهٔ با دامنهٔ مشخص", desc: "برای نیازهای روشن: دامنه، زمان‌بندی و تحویل‌ها از ابتدا توافق می‌شود." },
  { title: "توسعهٔ مرحله‌ای", desc: "برای محصولات در حال رشد: تحویل در فازهای کوتاه و اولویت‌بندی مداوم." },
  { title: "پشتیبانی و توسعهٔ مستمر", desc: "برای سامانه‌های در حال استفاده: نگهداری، بهبود و افزودن قابلیت." },
];

export const customFaqs = [
  { q: "هزینهٔ پروژه چطور تعیین می‌شود؟", a: "پس از جلسهٔ شناخت و تحلیل نیاز، پیشنهاد دامنه، زمان‌بندی و هزینه را ارائه می‌کنیم. پیش از این مرحله عدد قطعی اعلام نمی‌کنیم." },
  { q: "آیا سامانه روی سرور خودمان نصب می‌شود؟", a: "بله، استقرار روی زیرساخت شما یا سرور مورد توافق قابل انجام است." },
  { q: "مالکیت کد با چه کسی است؟", a: "مالکیت و شرایط تحویل کد در قرارداد هر پروژه مشخص می‌شود." },
  { q: "بعد از تحویل پشتیبانی دارید؟", a: "بله، دورهٔ پشتیبانی و مدل نگهداری بخشی از پیشنهاد هر پروژه است." },
];

/* ---------------- پروژه‌ها و مقالات ----------------
 * این داده‌ها در src/content/*.json هستند و از پنل مدیریت (/admin) ویرایش می‌شوند.
 */
import projectsData from "@/content/projects.json";
import articlesData from "@/content/articles.json";

/** تصاویر آماده‌ای که برای کارت پروژه قابل انتخاب‌اند */
export const projectImages = ["benefits", "limoc", "limofood"] as const;
export type ProjectImage = (typeof projectImages)[number];

export type Project = {
  slug: string;
  name: string;
  published: boolean;
  problem: string;
  solution: string;
  result: string;
  image?: ProjectImage | "";
  link?: string;
  tags: string[];
};

export type ArticleBlock = { h?: string; p?: string; list?: string[] };

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readMinutes: number;
  published: boolean;
  body: ArticleBlock[];
};

export const allProjects = projectsData as Project[];
export const projects = allProjects.filter((p) => p.published);
export const allArticles = articlesData as Article[];
export const articles = allArticles.filter((a) => a.published);
