import {
  CreditCard,
  Landmark,
  Settings,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  isActive: (pathname: string) => boolean;
};

const startsWith = (prefix: string) => (pathname: string) =>
  pathname.startsWith(prefix);

export const NAV_ITEMS: NavItem[] = [
  {
    to: "/incomes",
    label: "Revenus",
    icon: Wallet,
    isActive: startsWith("/incomes"),
  },
  {
    to: "/investments",
    label: "Investissements",
    icon: TrendingUp,
    isActive: (pathname) =>
      pathname === "/" || pathname.startsWith("/investments"),
  },
  {
    to: "/net-worth",
    label: "Capital",
    icon: Landmark,
    isActive: startsWith("/net-worth"),
  },
  {
    to: "/accounts",
    label: "Comptes",
    icon: CreditCard,
    isActive: startsWith("/accounts"),
  },
];

export const SETTINGS_ITEM: NavItem = {
  to: "/settings",
  label: "Paramètres",
  icon: Settings,
  isActive: startsWith("/settings"),
};

/** Section principale correspondant à l'URL (y compris Paramètres). */
export const getActiveNavItem = (pathname: string): NavItem | undefined =>
  [...NAV_ITEMS, SETTINGS_ITEM].find((item) => item.isActive(pathname));
