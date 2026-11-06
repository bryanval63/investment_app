import { cn } from "@/lib/utils";
import {
  CreditCard,
  Landmark,
  Menu,
  Settings,
  TrendingUp,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  isActive: (pathname: string) => boolean;
};

const startsWith = (prefix: string) => (pathname: string) =>
  pathname.startsWith(prefix);

const NAV_ITEMS: NavItem[] = [
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

const SETTINGS_ITEM: NavItem = {
  to: "/settings",
  label: "Paramètres",
  icon: Settings,
  isActive: startsWith("/settings"),
};

/** Navigation principale en « segmented control » (grand écran). */
export const Nav = () => {
  const { pathname } = useLocation();

  return (
    <nav
      aria-label="Navigation principale"
      className="hidden lg:flex items-center gap-1 rounded-full bg-slate-100/80 p-1 ring-1 ring-slate-200/60"
    >
      {NAV_ITEMS.map(({ to, label, icon: Icon, isActive }) => {
        const active = isActive(pathname);
        return (
          <NavLink
            key={to}
            to={to}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
              active
                ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/80"
                : "text-slate-500 hover:text-slate-900 hover:bg-white/60",
            )}
          >
            <Icon className={cn("size-4", active && "text-indigo-500")} />
            {label}
          </NavLink>
        );
      })}
    </nav>
  );
};

/** Bouton-icône Paramètres (grand écran). */
export const SettingsLink = () => {
  const { pathname } = useLocation();
  const active = SETTINGS_ITEM.isActive(pathname);

  return (
    <NavLink
      to={SETTINGS_ITEM.to}
      aria-label={SETTINGS_ITEM.label}
      title={SETTINGS_ITEM.label}
      aria-current={active ? "page" : undefined}
      className={cn(
        "hidden lg:flex size-9 items-center justify-center rounded-full border transition-colors duration-200",
        active
          ? "border-slate-300 bg-slate-100 text-slate-900"
          : "border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50",
      )}
    >
      <Settings className="size-4" />
    </NavLink>
  );
};

/** Bouton menu + panneau déroulant (petit écran). */
export const MobileNav = () => {
  const { pathname } = useLocation();
  // Mémorise la route sur laquelle le menu a été ouvert : il se referme
  // automatiquement dès que la route change (liens, retour arrière…).
  const [openedOnPath, setOpenedOnPath] = useState<string | null>(null);
  const isOpen = openedOnPath === pathname;
  const setIsOpen = (open: boolean) => setOpenedOnPath(open ? pathname : null);
  const navRef = useRef<HTMLElement>(null);

  // Ferme le menu mobile sur Échap ou clic en dehors.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenedOnPath(null);
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node))
        setOpenedOnPath(null);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  return (
    <nav ref={navRef} aria-label="Navigation principale" className="lg:hidden">
      <button
        type="button"
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
      >
        {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {isOpen && (
        <div className="fixed inset-x-2 top-[4.25rem] z-70 flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
          {[...NAV_ITEMS, SETTINGS_ITEM].map(
            ({ to, label, icon: Icon, isActive }) => {
              const active = isActive(pathname);
              return (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setIsOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-colors",
                    active
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-8 items-center justify-center rounded-lg",
                      active
                        ? "bg-white text-indigo-500 shadow-sm"
                        : "bg-slate-100 text-slate-500",
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  {label}
                </NavLink>
              );
            },
          )}
        </div>
      )}
    </nav>
  );
};
