import { Hero } from "@/components/home/hero";
import { ArticlesTeaser, CustomDev, FinalCta, Intro, Process, ProductsShowcase, ProjectsTeaser } from "@/components/home/sections";
import { SolutionFinder } from "@/components/home/solution-finder";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMeta({
  title: `${site.name} | توسعهٔ نرم‌افزار و محصولات SaaS`,
  description: "نرم‌افزارهایی برای کسب‌وکارهای رو به رشد: Limoc برای مدیریت مشتری و فروش، LimoFood برای سفارش آنلاین غذا، سامانهٔ رفاهیات کارکنان و توسعهٔ نرم‌افزار سفارشی.",
  path: "/",
  absolute: true,
});

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <ProductsShowcase />
      <SolutionFinder />
      <CustomDev />
      <Process />
      <ProjectsTeaser />
      <ArticlesTeaser />
      <FinalCta />
    </>
  );
}
