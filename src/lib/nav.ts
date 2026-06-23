import { NAVLIST } from "@/constants/nav";
import type { NavGroup, NavItem, NavLink, NavList } from "@/types";

function resolveNavItemForRole(item: NavItem, isAdmin: boolean): NavItem {
  if (!isAdmin && "items" in item && item.items && item.userLink) {
    return {
      title: item.title,
      icon: item.icon,
      badge: item.badge,
      url: item.userLink,
    } satisfies NavLink;
  }

  return item;
}

export function getNavList(isAdmin: boolean): NavList {
  return {
    navGroups: NAVLIST.navGroups
      .map((group: NavGroup) => ({
        ...group,
        items: group.items
          .filter((item) => !item.adminOnly || isAdmin)
          .map((item) => resolveNavItemForRole(item, isAdmin)),
      }))
      .filter((group) => group.items.length > 0),
  };
}
