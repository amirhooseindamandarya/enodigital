import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MotionProvider } from "@/components/motion/reveal";
import { JsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-3 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg">رفتن به محتوا</a>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: site.name,
        alternateName: site.nameEn,
        url: site.url,
        logo: `${site.url}/icon-512.png`,
        description: site.description,
      }} />
      <MotionProvider>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </MotionProvider>
    </>
  );
}
