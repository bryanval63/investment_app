import { NavLink, useLocation } from "react-router-dom";
import type { SidebarConfig } from "./sidebar.type";
import { Separator } from "@/components/ui/separator";
import { useEffect, useRef } from "react";

type SidebarProps = {
  config: SidebarConfig;
};

export const Sidebar = ({ config }: SidebarProps) => {
  const { pathname } = useLocation();
  const listRef = useRef<HTMLUListElement>(null);

  // Sous lg, recentre horizontalement la pastille active dans la rangée défilante.
  useEffect(() => {
    const list = listRef.current;
    const active = list?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!list || !active || list.scrollWidth <= list.clientWidth) return;

    list.scrollLeft =
      active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2;
  }, [pathname]);

  return (
    <>
      <h2 className="text-xl font-bold text-center hidden lg:block">Menu</h2>
      {/* Sous lg : rangée de pastilles défilable horizontalement. */}
      <ul
        ref={listRef}
        className="relative flex flex-row gap-2 overflow-x-auto lg:flex-col lg:gap-0 lg:overflow-visible lg:my-auto"
      >
        {config.map((item, index) => (
          <li key={item.link} className="shrink-0">
            <NavLink
              to={item.link}
              end={["/incomes", "/investments", "/net-worth"].includes(
                item.link,
              )}
              className={({ isActive }) =>
                `py-1.5 lg:py-3 px-3 lg:px-4 rounded-lg transition-all duration-200 flex items-center gap-2 whitespace-nowrap lg:whitespace-normal text-sm lg:text-base [&_svg]:size-4 lg:[&_svg]:size-6 ${
                  isActive
                    ? "bg-linear-to-r from-blue-500 to-purple-500 text-white shadow"
                    : "text-gray-400 hover:bg-slate-800"
                }`
              }
            >
              <div className="shrink-0">{item.icon}</div>
              {item.title}
            </NavLink>
            {index < config.length - 1 && (
              <Separator className="hidden lg:block" />
            )}
          </li>
        ))}
      </ul>
    </>
  );
};
