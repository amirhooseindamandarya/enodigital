import { Breadcrumb } from "@/components/product/blocks";
import { FinalCta, ProjectCards } from "@/components/home/sections";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "پروژه‌ها و نمونه‌کارها", description: "نمونه‌کارهای توسعهٔ نرم‌افزار؛ مسئلهٔ مشتری، راهکار ارائه‌شده و نتیجه.", path: "/projects/" });

export default function ProjectsPage() {
  return (
    <>
      <section className="bg-paper pt-[72px]">
        <div className="container-x pb-20 pt-10 sm:pt-14">
          <Breadcrumb items={[{ href: "/", label: "خانه" }, { label: "پروژه‌ها" }]} />
          <div className="mt-10 max-w-3xl">
            <h1 className="h-display">پروژه‌ها و نمونه‌کارها</h1>
            <p className="lead mt-5">هر پروژه را با ساختار «مسئله، راهکار، نتیجه» معرفی می‌کنیم و فقط اطلاعاتی را منتشر می‌کنیم که قابل‌استناد باشد و کارفرما انتشار آن را تأیید کرده باشد.</p>
          </div>
          <div className="mt-14"><ProjectCards /></div>
        </div>
      </section>
      <div className="h-24 bg-white" />
      <FinalCta title="پروژهٔ بعدی می‌تواند مال شما باشد" lead="نیازتان را بنویسید تا مسیر اجرای آن را با هم بررسی کنیم." />
    </>
  );
}
