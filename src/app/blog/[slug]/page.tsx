import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumb } from "@/components/product/blocks";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { articles } from "@/lib/content";
import { JsonLd, pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  if (!a) return {};
  return pageMeta({ title: a.title, description: a.excerpt, path: `/blog/${a.slug}/` });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  if (!a) notFound();
  const others = articles.filter((x) => x.slug !== a.slug);
  return (
    <article className="bg-white pt-[72px]">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: a.title, description: a.excerpt, inLanguage: "fa-IR", publisher: { "@type": "Organization", name: site.name }, mainEntityOfPage: `${site.url}/blog/${a.slug}/` }} />
      <header className="bg-paper">
        <div className="container-x max-w-[820px]! pb-14 pt-10 sm:pt-14">
          <Breadcrumb items={[{ href: "/", label: "خانه" }, { href: "/blog/", label: "مقالات" }, { label: a.category }]} />
          <p className="mt-10 text-[14px] font-bold text-indigo">{a.category} · {a.readMinutes.toLocaleString("fa-IR")} دقیقه مطالعه</p>
          <h1 className="mt-4 text-[30px] font-extrabold leading-[1.45] sm:text-[42px]">{a.title}</h1>
          <p className="lead mt-5">{a.excerpt}</p>
        </div>
      </header>
      <div className="container-x max-w-[820px]! py-14">
        <div className="space-y-6 text-[17px] leading-[2.1] text-ink">
          {a.body.map((b, i) =>
            b.h ? <h2 key={i} className="pt-4 text-[23px] font-extrabold">{b.h}</h2>
            : b.list ? <ul key={i} className="grid gap-2.5">{b.list.map((li) => <li key={li} className="flex gap-3"><Icon name="check" className="mt-2 size-4 shrink-0 text-indigo" strokeWidth={2.5} />{li}</li>)}</ul>
            : <p key={i} className="text-ink-2">{b.p}</p>,
          )}
        </div>
        <div className="mt-14 flex flex-col items-start justify-between gap-4 rounded-3xl bg-paper p-7 sm:flex-row sm:items-center">
          <p className="font-bold">برای این موضوع راهکار نرم‌افزاری می‌خواهید؟</p>
          <ButtonLink href="/contact/">گفتگو با ما</ButtonLink>
        </div>
        <nav aria-label="مقالات دیگر" className="mt-14 border-t border-line pt-10">
          <p className="mb-5 text-[14px] font-bold text-ink-3">مقالات دیگر</p>
          <ul className="grid gap-3">
            {others.map((o) => (
              <li key={o.slug}><Link href={`/blog/${o.slug}/`} className="group flex items-center justify-between gap-4 rounded-2xl border border-line p-5 hover:border-line-2"><span className="font-bold">{o.title}</span><Icon name="arrow" className="size-4 shrink-0 text-ink-3 transition-transform group-hover:-translate-x-1" /></Link></li>
            ))}
          </ul>
        </nav>
      </div>
    </article>
  );
}
