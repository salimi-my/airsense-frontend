import {
  FileText,
  Images,
  LayoutGrid,
  Settings,
  Tags,
  Users,
} from "lucide-react";

import { PageMapping, type NavList } from "@/types";

export const NAVLIST: NavList = {
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutGrid,
        },
      ],
    },
    {
      title: "Content",
      items: [
        {
          title: "Posts",
          icon: FileText,
          items: [
            {
              title: "All Posts",
              url: "/posts",
            },
            {
              title: "Create Post",
              url: "/posts/create",
            },
          ],
        },
        {
          title: "Media",
          icon: Images,
          items: [
            {
              title: "All Media",
              url: "/media",
            },
            {
              title: "Create Media",
              url: "/media/create",
            },
          ],
        },

        {
          title: "Tags",
          icon: Tags,
          items: [
            {
              title: "All Tags",
              url: "/tags",
            },
            {
              title: "Create Tag",
              url: "/tags/create",
            },
          ],
        },
      ],
    },
    {
      title: "Account",
      items: [
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

/**
 * Mapping for pages that are not directly in the nav list but should be associated with existing nav items.
 * Key: URL pattern (can be regex string or function)
 * Value: Object with title and associated nav URL
 */
export const PAGE_MAPPING: PageMapping = {
  // User edit pages
  // "/users/[^/]+/edit": {
  //   title: "Edit User",
  //   navUrl: "/users",
  // },
};
