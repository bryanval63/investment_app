import { cn } from "@/lib/utils";
import { ChevronDown, Menu, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { getActiveNavItem, NAV_ITEMS, SETTINGS_ITEM } from "./nav.config";

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

  const activeItem = getActiveNavItem(pathname);
  const ActiveIcon = activeItem?.icon ?? Menu;
  const sectionLabel = activeItem?.label ?? "Menu";

  return (
    <nav
      ref={navRef}
      aria-label="Navigation principale"
      className="min-w-0 lg:hidden"
    >
      {/* Pastille de section : indique où l'on se trouve et ouvre le menu des sections. */}
      <button
        type="button"
        aria-label={`Section ${sectionLabel}, ${isOpen ? "fermer" : "ouvrir"} le menu`}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 min-w-0 max-w-full items-center gap-2 rounded-full bg-white py-1 pr-3 pl-1 text-sm font-medium text-slate-900 shadow-sm ring-1 ring-slate-200/80 transition-colors hover:bg-slate-50"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
          <ActiveIcon className="size-4" />
        </span>
        <span className="truncate">{sectionLabel}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-slate-400 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
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
