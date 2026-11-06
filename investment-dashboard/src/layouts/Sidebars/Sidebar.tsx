import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import type { SidebarConfig } from "./sidebar.type";

type SidebarProps = {
  config: SidebarConfig;
};

// Libellé de section affiché en tête du menu, selon le premier segment de l'URL.
const SECTION_LABELS: Record<string, string> = {
  incomes: "Revenus",
  investments: "Investissements",
  "net-worth": "Capital",
  accounts: "Comptes",
  settings: "Paramètres",
};

// Liens exacts : sinon « Overview » resterait actif sur toutes les sous-pages.
const END_LINKS = ["/incomes", "/investments", "/net-worth"];

// Les liens d'ajout sont présentés comme des actions, séparées de la navigation.
const isActionLink = (link: string) => /\/add$/.test(link);

type SidebarItemProps = {
  item: SidebarConfig[number];
};

const SidebarItem = ({ item }: SidebarItemProps) => {
  const action = isActionLink(item.link);

  return (
    <NavLink
      to={item.link}
      end={END_LINKS.includes(item.link)}
      className={({ isActive }) =>
        cn(
          "group flex items-center gap-2.5 whitespace-nowrap rounded-full border border-transparent lg:rounded-xl px-3 py-1.5 lg:px-2.5 lg:py-2 text-sm font-medium transition-all duration-200 lg:whitespace-normal",
          action
            ? isActive
              ? "border-indigo-200 bg-indigo-50 text-indigo-700"
              : "border-dashed border-indigo-200 text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50"
            : isActive
              ? "border-slate-200/80 bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:bg-white/60 hover:text-slate-900",
        )
      }
    >
      {({ isActive }) => (
        <>
          {item.icon && (
            <span
              className={cn(
                "flex shrink-0 items-center justify-center [&_svg]:size-4 lg:size-8 lg:rounded-lg transition-colors",
                action
                  ? "text-indigo-500 lg:bg-indigo-50 lg:group-hover:bg-indigo-100"
                  : isActive
                    ? "text-indigo-500 lg:bg-indigo-50"
                    : "text-slate-400 lg:bg-slate-100 group-hover:text-slate-600",
              )}
            >
              {item.icon}
            </span>
          )}
          {item.title}
        </>
      )}
    </NavLink>
  );
};

export const Sidebar = ({ config }: SidebarProps) => {
  const { pathname } = useLocation();
  const listRef = useRef<HTMLDivElement>(null);
  const sectionLabel = SECTION_LABELS[pathname.split("/")[1] ?? ""] ?? "Menu";

  const navItems = config.filter((item) => !isActionLink(item.link));
  const actionItems = config.filter((item) => isActionLink(item.link));

  // Sous lg, recentre horizontalement la pastille active dans la rangée défilante.
  useEffect(() => {
    const list = listRef.current;
    const active = list?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!list || !active || list.scrollWidth <= list.clientWidth) return;

    list.scrollLeft =
      active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2;
  }, [pathname]);

  return (
    <nav
      aria-label={`Menu ${sectionLabel}`}
      className="flex h-full min-h-0 flex-col gap-4"
    >
      <span className="hidden px-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400 lg:block">
        {sectionLabel}
      </span>

      {/* Sous lg : une seule rangée de pastilles défilable horizontalement. */}
      <div
        ref={listRef}
        className="relative flex flex-row gap-2 overflow-x-auto [scrollbar-width:none] lg:flex-1 lg:flex-col lg:justify-between lg:overflow-visible"
      >
        <ul className="flex flex-row gap-2 lg:flex-col lg:gap-1">
          {navItems.map((item) => (
            <li key={item.link} className="shrink-0">
              <SidebarItem item={item} />
            </li>
          ))}
        </ul>

        {actionItems.length > 0 && (
          <div className="flex flex-row gap-2 lg:flex-col lg:gap-1">
            <span className="hidden px-2.5 pb-1 text-xs font-semibold uppercase tracking-wider text-slate-400 lg:block">
              Actions
            </span>
            {actionItems.map((item) => (
              <div key={item.link} className="shrink-0">
                <SidebarItem item={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};
