"use client";

import {
  Activity,
  LayoutDashboard,
  MapPin,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const SAFE_AREA_SPACER_STYLE = {
  height: "max(env(safe-area-inset-bottom), 0px)",
  paddingBottom: "env(safe-area-inset-bottom)",
} as const;

const BASE_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Map", href: "/map", icon: MapPin },
  { label: "Assess", href: "/assess", icon: Activity },
  { label: "Settings", href: "/settings", icon: Settings },
];

interface BottomNavProps {
  isAdmin: boolean;
}

export function BottomNav({ isAdmin }: BottomNavProps) {
  const pathname = usePathname();

  const navItems = useMemo<NavItem[]>(() => {
    if (!isAdmin) return BASE_NAV_ITEMS;

    return [
      BASE_NAV_ITEMS[0],
      BASE_NAV_ITEMS[1],
      BASE_NAV_ITEMS[2],
      { label: "Users", href: "/users", icon: Users },
      BASE_NAV_ITEMS[3],
    ];
  }, [isAdmin]);

  const checkIsActive = (href: string) => {
    if (href === "/map") {
      return pathname === "/map" || pathname?.startsWith("/stations/");
    }
    return pathname?.startsWith(href);
  };

  return (
    <nav className="bg-backdrop/95 supports-[backdrop-filter]:bg-backdrop/75 fixed inset-x-0 bottom-0 z-50 border-t backdrop-blur md:hidden">
      <ul
        className={cn(
          "mx-auto -mb-0.5 grid max-w-xl gap-1 px-2 py-1.5 pb-0",
          navItems.length === 5 ? "grid-cols-5" : "grid-cols-4",
        )}
      >
        {navItems.map((item) => {
          const isActive = checkIsActive(item.href);
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 rounded-md px-3 py-2 text-xs transition-colors",
                  isActive
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className={cn("h-5 w-5", !isActive && "opacity-80")} />
                <span className="leading-none">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div style={SAFE_AREA_SPACER_STYLE} />
    </nav>
  );
}
