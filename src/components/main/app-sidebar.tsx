"use client";

import { useMemo } from "react";

import { AppLogo } from "@/components/main/app-logo";
import { LogoutButton } from "@/components/main/logout-button";
import { NavGroup } from "@/components/main/nav-group";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { getNavList } from "@/lib/nav";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  isAdmin: boolean;
}

export function AppSidebar({ isAdmin, ...props }: AppSidebarProps) {
  const navGroups = useMemo(() => getNavList(isAdmin).navGroups, [isAdmin]);

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <AppLogo name="AirSense" />
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((navGroup) => (
          <NavGroup key={navGroup.title} {...navGroup} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <LogoutButton />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
