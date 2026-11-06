import type { NextConfig } from "next";

/**
 * خروجی ایستا برای GitHub Pages.
 * NEXT_PUBLIC_BASE_PATH در گردش‌کار انتشار روی "/enodigital" تنظیم می‌شود؛
 * برای دامنهٔ اختصاصی خالی بگذارید.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
