import {
  Activity,
  LayoutDashboard,
  MapPin,
  ScrollText,
  Settings,
  Users,
} from "lucide-react";

import { PageMapping, type NavList } from "@/types";

export const NAVLIST: NavList = {
  navGroups: [
    {
      title: "AirSense",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Air Map",
          url: "/map",
          icon: MapPin,
        },
        {
          title: "Risk Assessment",
          url: "/assess",
          icon: Activity,
        },
      ],
    },
    {
      title: "Administration",
      items: [
        {
          title: "System Logs",
          url: "/admin/logs",
          icon: ScrollText,
          adminOnly: true,
        },
        {
          title: "Users",
          url: "/users",
          icon: Users,
          adminOnly: true,
        },
        {
          title: "Settings",
          url: "/settings",
          icon: Settings,
        },
      ],
    },
  ],
};

export const PAGE_MAPPING: PageMapping = {
  "/map": {
    title: "Air Map",
    navUrl: "/map",
  },
  "/stations/[^/]+": {
    title: "Station Detail",
    navUrl: "/map",
  },
  "/assess": {
    title: "Risk Assessment",
    navUrl: "/assess",
  },
  "/admin/logs": {
    title: "System Logs",
    navUrl: "/admin/logs",
  },
};
