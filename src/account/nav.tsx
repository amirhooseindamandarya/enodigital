"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, CreditCard, LayoutDashboard, LifeBuoy, Receipt, Shield, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = { dashboard: LayoutDashboard, subscriptions: Briefcase, orders: Receipt, tickets: LifeBuoy, profile: UserRound, security: Shield, pricing: CreditCard };
export type NavItem = { key: keyof typeof ICONS; label: string; href: string; badge?: number };

export function AccountNav({ items }: { items: NavItem[] }) {
  const path = usePathname() ?? "";
  const norm = (h: string) => h.split("?")[0];
  // پیشخوان فقط وقتی دقیقاً همان مسیر است فعال است
  const isActive = (it: NavItem) => (it.key === "dashboard" ? path === norm(it.href) : path.startsWith(norm(it.href)));
  return (
    <nav aria-label="account">
      <ul className="flex gap-1 overflow-x-auto rounded-2xl border border-line bg-white p-1.5 lg:grid">
        {items.map((it) => {
          const I = ICONS[it.key];
          const active = isActive(it);
          return (
            <li key={it.key} className="shrink-0">
              <Link href={it.href} aria-current={active ? "page" : undefined}
                className={cn("flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[14.5px] font-bold transition-colors", active ? "bg-navy text-white" : "text-ink-2 hover:bg-paper hover:text-ink")}>
                <I className="size-[18px] shrink-0" aria-hidden />
                <span className="flex-1">{it.label}</span>
                {!!it.badge && <span className={cn("grid min-w-5 place-items-center rounded-full px-1.5 text-[11.5px]", active ? "bg-white/20" : "bg-amber/20 text-amber-ink")}>{it.badge}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
