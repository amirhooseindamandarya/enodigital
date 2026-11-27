import type { NextConfig } from "next";

/**
 * اجرای سرور Node.js (خروجی standalone برای Docker/VPS).
 * صفحات سایت همچنان در زمان build به‌صورت ایستا ساخته می‌شوند؛
 * حساب کاربری، پنل مدیریت و API پویا هستند.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "standalone",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  serverExternalPackages: ["postgres"],
  experimental: { globalNotFound: true },
  /** آدرس‌های قدیمی سایت (هم‌چنین در redirects بستهٔ CMS) */
  async redirects() {
    return [
      { source: "/products/limoc", destination: "/limoc/", permanent: true },
      { source: "/products/limofood", destination: "/limofood/", permanent: true },
      { source: "/products/benefits", destination: "/benefits/", permanent: true },
      { source: "/services/custom-software", destination: "/custom-software/", permanent: true },
    ];
  },
  async headers() {
    const security = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
    ];
    return [
      { source: "/:path*", headers: security },
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }, { key: "Cache-Control", value: "no-store" }] },
      { source: "/account/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }, { key: "Cache-Control", value: "no-store" }] },
    ];
  },
};

export default nextConfig;
