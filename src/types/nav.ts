interface BaseNavItem {
  title: string;
  badge?: string;
  icon?: React.ElementType;
  adminOnly?: boolean;
}

type NavLink = BaseNavItem & {
  url: string;
  items?: never;
};

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: string })[];
  url?: never;
  userLink?: string;
};

type NavItem = NavCollapsible | NavLink;

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface NavList {
  navGroups: NavGroup[];
}

interface PageMapping {
  [key: string]: {
    title: string;
    navUrl: string;
  };
}

export type {
  NavCollapsible,
  NavGroup,
  NavItem,
  NavLink,
  NavList,
  PageMapping,
};
