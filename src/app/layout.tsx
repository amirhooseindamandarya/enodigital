import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MotionProvider } from "@/components/motion/reveal";
import { JsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

const vazir = localFont({
  src: "../fonts/Vazirmatn-Variable.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-vazir",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url + "/"),
  title: { default: `${site.name} | ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/favicon.png`, apple: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/apple-touch-icon.png` },
  robots: { index: true, follow: true, "max-image-preview": "large" } as Metadata["robots"],
};

export const viewport: Viewport = { themeColor: "#071c35", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazir.variable}>
      <body>
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
      </body>
    </html>
  );
}
