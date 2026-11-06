import { Breadcrumb } from "@/components/product/blocks";
import { ArticleCards } from "@/components/home/sections";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "مقالات", description: "یادداشت‌هایی دربارهٔ CRM، فروش آنلاین، تجربهٔ مشتری، تحول دیجیتال و توسعهٔ نرم‌افزار.", path: "/blog/" });

export default function BlogPage() {
  return (
    <section className="bg-paper pt-[72px]">
      <div className="container-x pb-24 pt-10 sm:pt-14">
        <Breadcrumb items={[{ href: "/", label: "خانه" }, { label: "مقالات" }]} />
        <div className="mt-10 max-w-3xl">
          <h1 className="h-display">مقالات و دانشنامه</h1>
          <p className="lead mt-5">یادداشت‌هایی کوتاه و کاربردی دربارهٔ فروش، تجربهٔ مشتری، تحول دیجیتال و توسعهٔ نرم‌افزار.</p>
        </div>
        <div className="mt-14"><ArticleCards /></div>
      </div>
    </section>
  );
}
