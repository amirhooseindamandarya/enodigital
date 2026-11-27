"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Briefcase, Cog, History, LifeBuoy, Package, Receipt, Tag, UserCog, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin/", label: "پیشخوان", icon: BarChart3, exact: true },
  { href: "/admin/orders/", label: "سفارش‌ها", icon: Receipt, badge: "orders" },
  { href: "/admin/subscriptions/", label: "اشتراک‌ها", icon: Briefcase },
  { href: "/admin/customers/", label: "مشتریان", icon: Users },
  { href: "/admin/tickets/", label: "پشتیبانی", icon: LifeBuoy, badge: "tickets" },
  { href: "/admin/products/", label: "محصولات و پلن‌ها", icon: Package, admin: true },
  { href: "/admin/coupons/", label: "کدهای تخفیف", icon: Tag, admin: true },
  { href: "/admin/settings/", label: "تنظیمات فروشگاه", icon: Cog, admin: true },
  { href: "/admin/staff/", label: "کارکنان", icon: UserCog, admin: true },
  { href: "/admin/audit/", label: "گزارش فعالیت", icon: History, admin: true },
] as const;

export function AdminNav({ isAdmin, badges }: { isAdmin: boolean; badges: Record<string, number> }) {
  const path = usePathname() ?? "";
  return (
    <nav aria-label="پنل مدیریت">
      <ul className="flex gap-1 overflow-x-auto rounded-2xl border border-line bg-white p-1.5 lg:grid">
        {items.filter((i) => !("admin" in i) || isAdmin).map((i) => {
          const active = "exact" in i ? path === i.href : path.startsWith(i.href) || (i.href === "/admin/products/" && path.startsWith("/admin/plans/"));
          const count = "badge" in i ? badges[i.badge] : 0;
          return (
            <li key={i.href} className="shrink-0">
              <Link href={i.href} aria-current={active ? "page" : undefined}
                className={cn("flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[14px] font-bold transition-colors", active ? "bg-navy text-white" : "text-ink-2 hover:bg-paper hover:text-ink")}>
                <i.icon className="size-[18px] shrink-0" aria-hidden />
                <span className="flex-1">{i.label}</span>
                {!!count && <span className={cn("grid min-w-5 place-items-center rounded-full px-1.5 text-[11.5px]", active ? "bg-white/20" : "bg-amber/20 text-amber-ink")}>{count.toLocaleString("fa-IR")}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
