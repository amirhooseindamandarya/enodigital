import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-[background,color,border-color,box-shadow,transform] duration-200 ease-out active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-[18px] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "btn-shine bg-amber text-navy shadow-[0_10px_24px_-10px_rgb(245_168_0/0.75)] hover:bg-[#ffb81f]",
        dark: "bg-navy text-white hover:bg-navy-3",
        light: "btn-shine bg-white text-navy hover:bg-paper",
        outline: "border border-line-2 bg-white text-ink hover:border-ink-3",
        ghostDark: "border border-white/15 bg-white/[0.04] text-white hover:bg-white/10 hover:border-white/30",
        teal: "btn-shine bg-teal-700 text-white hover:bg-teal",
        sun: "bg-sun text-white hover:bg-sun-700",
        link: "px-0! h-auto! text-ink hover:text-amber-ink",
        limoc: "btn-shine bg-limoc text-white shadow-[0_10px_24px_-10px_rgb(44_114_72/0.7)] hover:bg-limoc-600",
        limocSun: "btn-shine bg-limoc-sun text-limoc-ink shadow-[0_10px_24px_-10px_rgb(251_195_14/0.8)] hover:bg-[#ffcf35]",
        limocOutline: "border border-limoc/25 bg-white text-limoc-900 hover:border-limoc/60",
      },
      size: {
        sm: "h-10 px-4 text-[14px]",
        md: "h-12 px-5 text-[15px]",
        lg: "h-14 px-7 text-[16px]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type Common = VariantProps<typeof buttonVariants> & { className?: string; children: React.ReactNode };

export function ButtonLink({ href, external, variant, size, className, children, ...rest }: Common & { href: string; external?: boolean } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const cls = cn(buttonVariants({ variant, size }), className);
  if (external) {
    return <a href={href} target="_blank" rel="noopener" className={cls} {...rest}>{children}</a>;
  }
  return <Link href={href} className={cls} {...rest}>{children}</Link>;
}

export function Button({ variant, size, className, ...props }: Common & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
