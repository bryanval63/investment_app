import { Sidebar } from "./Sidebar";
import type { SidebarConfig } from "./sidebar.type";
import { Plus, LayoutDashboard } from "lucide-react";

export const NetWorthSidebar = () => {
  const NET_WORTH_MENU: SidebarConfig = [
    {
      title: "Overview",
      shortTitle: "Aperçu",
      link: "/net-worth",
      icon: <LayoutDashboard />,
    },
    {
      title: "Ajouter une somme",
      shortTitle: "Ajouter",
      link: "/net-worth/add",
      icon: <Plus />,
    },
  ];

  return <Sidebar config={NET_WORTH_MENU} />;
};
