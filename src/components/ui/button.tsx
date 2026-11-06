import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-[background,color,border-color,box-shadow,transform] duration-200 ease-out active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-[18px] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-indigo text-white shadow-[0_8px_20px_-8px_rgb(88_101_232/0.7)] hover:bg-indigo-600",
        dark: "bg-navy text-white hover:bg-navy-3",
        light: "bg-white text-navy hover:bg-paper",
        outline: "border border-line-2 bg-white text-ink hover:border-ink-3",
        ghostDark: "border border-white/15 bg-white/[0.04] text-white hover:bg-white/10 hover:border-white/30",
        teal: "bg-teal-700 text-white hover:bg-teal",
        sun: "bg-sun text-navy hover:bg-[#ffd36f]",
        link: "px-0! h-auto! text-ink hover:text-indigo",
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
