import { cn } from "@/lib/utils";
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
          // Sous lg : onglet de barre de navigation, icône au-dessus et libellé court en dessous.
          "group flex w-full flex-col items-center gap-1 rounded-2xl border border-transparent px-0.5 py-1.5 text-[11px] leading-tight font-medium transition-all duration-200",
          "lg:flex-row lg:gap-2.5 lg:rounded-xl lg:px-2.5 lg:py-2 lg:text-sm",
          action
            ? isActive
              ? "border-indigo-200 bg-indigo-50 text-indigo-700"
              : "text-indigo-600 lg:border-dashed lg:border-indigo-200 hover:bg-indigo-50 lg:hover:border-indigo-300"
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
                "flex shrink-0 items-center justify-center [&_svg]:size-5 lg:[&_svg]:size-4 lg:size-8 lg:rounded-lg transition-colors",
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
          <span className="max-w-full truncate lg:hidden">
            {item.shortTitle ?? item.title}
          </span>
          <span className="hidden lg:inline">{item.title}</span>
        </>
      )}
    </NavLink>
  );
};

export const Sidebar = ({ config }: SidebarProps) => {
  const { pathname } = useLocation();
  const sectionLabel = SECTION_LABELS[pathname.split("/")[1] ?? ""] ?? "Menu";

  const navItems = config.filter((item) => !isActionLink(item.link));
  const actionItems = config.filter((item) => isActionLink(item.link));

  return (
    <nav
      aria-label={`Menu ${sectionLabel}`}
      className="flex h-full min-h-0 flex-col gap-4"
    >
      <span className="hidden px-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400 lg:block">
        {sectionLabel}
      </span>

      {/* Sous lg : une seule rangée d'onglets de même largeur, sans défilement
          (les listes passent en `contents` pour que chaque élément soit un enfant direct de la rangée). */}
      <div className="flex flex-row gap-0.5 lg:flex-1 lg:flex-col lg:justify-between">
        <ul className="contents lg:flex lg:flex-col lg:gap-1">
          {navItems.map((item) => (
            <li key={item.link} className="flex min-w-0 flex-1 lg:flex-none">
              <SidebarItem item={item} />
            </li>
          ))}
        </ul>

        {actionItems.length > 0 && (
          <div className="contents lg:flex lg:flex-col lg:gap-1">
            <span className="hidden px-2.5 pb-1 text-xs font-semibold uppercase tracking-wider text-slate-400 lg:block">
              Actions
            </span>
            {actionItems.map((item) => (
              <div key={item.link} className="flex min-w-0 flex-1 lg:flex-none">
                <SidebarItem item={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};
