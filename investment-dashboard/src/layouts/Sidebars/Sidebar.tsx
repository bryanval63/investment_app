import { NavLink } from "react-router-dom";
import type { SidebarConfig } from "./sidebar.type";
import { Separator } from "@/components/ui/separator";

type SidebarProps = {
  config: SidebarConfig;
};

export const Sidebar = ({ config }: SidebarProps) => {
  return (
    <>
      <h2 className="text-xl font-bold text-center">Menu</h2>
      <ul className="justify-center my-auto">
        {config.map((item) => (
          <li key={item.link}>
            <NavLink
              to={item.link}
              end={["/incomes", "/investments", "/net-worth"].includes(
                item.link,
              )}
              className={({ isActive }) =>
                `py-3 px-4 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? "bg-linear-to-r from-blue-500 to-purple-500 text-white shadow"
                    : "text-gray-400 hover:bg-slate-800"
                }`
              }
            >
              {item.icon}
              {item.title}
            </NavLink>
            <Separator />
          </li>
        ))}
      </ul>
    </>
  );
};
