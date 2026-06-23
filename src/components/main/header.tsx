"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { ProfileDropdown } from "@/components/main/profile-dropdown";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NAVLIST, PAGE_MAPPING } from "@/constants";
import { useWindowScroll } from "@/hooks/use-window-scroll";
import { cn } from "@/lib/utils";
import { NavItem, User } from "@/types";

interface HeaderProps {
  user: User;
}

const flattenNavItems = (items: NavItem[]): NavItem[] =>
  items.reduce((acc: NavItem[], item: NavItem) => {
    if ("items" in item && item.items) {
      return [...acc, ...flattenNavItems(item.items)];
    }
    return [...acc, item];
  }, []);

// Computed once at module load — NAVLIST is static
const FLAT_NAV_ITEMS = flattenNavItems(
  NAVLIST.navGroups.flatMap((group) => group.items ?? []),
);

const PAGE_MAPPING_ENTRIES = Object.entries(PAGE_MAPPING) as [
  string,
  { title: string; navUrl: string },
][];

function getHeaderLayoutClasses(scrolled: boolean) {
  return cn(
    "transition-[width,left,right] ease-linear",
    scrolled ? "max-md:left-[15px]" : "max-md:left-2",
    scrolled ? "md:right-[15px]" : "md:right-[0.3125rem]",
    scrolled ? "max-md:w-[calc(100%_-_30px)]" : "max-md:w-[calc(100%_-_16px)]",
    scrolled
      ? "md:group-has-[[data-state=expanded]]/sidebar-wrapper:w-[calc(100%_-_var(--sidebar-width)_-_30px)]"
      : "md:group-has-[[data-state=expanded]]/sidebar-wrapper:w-[calc(100%_-_var(--sidebar-width)_-_12px)]",
    scrolled
      ? "md:group-has-[[data-state=collapsed]]/sidebar-wrapper:group-has-[[data-collapsible=icon]]/sidebar-wrapper:w-[calc(100%_-_(var(--sidebar-width-icon)_+_theme(spacing.4)_+_2px_+_28px))]"
      : "md:group-has-[[data-state=collapsed]]/sidebar-wrapper:group-has-[[data-collapsible=icon]]/sidebar-wrapper:w-[calc(100%_-_(var(--sidebar-width-icon)_+_theme(spacing.4)_+_2px_+_10px))]",
  );
}

// Widest header layout (non-scrolled) — used for the top background bar
const HEADER_MAX_LAYOUT_CLASSES = getHeaderLayoutClasses(false);

export function Header({ user }: HeaderProps) {
  const path = usePathname();
  const [{ y }] = useWindowScroll();

  const title = useMemo(() => {
    const navTitle = FLAT_NAV_ITEMS.find((item) => item.url === path)?.title;
    if (navTitle) return navTitle;

    for (const [pattern, mapping] of PAGE_MAPPING_ENTRIES) {
      if (new RegExp(`^${pattern}$`).test(path)) return mapping.title;
    }

    return "Unauthorized";
  }, [path]);

  const scrolled = Boolean(y && y > 20);
  const headerLayoutClasses = getHeaderLayoutClasses(scrolled);

  return (
    <>
      <div
        className={cn(
          "bg-header fixed top-0 z-10 h-8",
          HEADER_MAX_LAYOUT_CLASSES,
        )}
      />
      <header
        className={cn(
          "border-header bg-header fixed top-2 z-10 flex shrink-0 flex-col justify-center rounded-lg border px-2.5",
          headerLayoutClasses,
          scrolled && "border-sidebar-border bg-sidebar shadow-md",
        )}
      >
        <div className="flex h-12 shrink-0 items-center justify-between">
          <div className="flex items-center gap-2">
            <SidebarTrigger
              className="bg-sidebar dark:bg-sidebar -ml-[2px] size-8"
              variant="outline"
            />
            <Separator
              orientation="vertical"
              className="mx-2 h-6 self-center!"
            />
            {title}
          </div>
          <div className="flex items-center gap-2.5">
            <ModeToggle />
            <ProfileDropdown user={user} />
          </div>
        </div>
      </header>
    </>
  );
}
