import { Sidebar } from "./Sidebar";
import type { SidebarConfig } from "./sidebar.type";
import { List, Plus } from "lucide-react";

export const AccountsSidebar = () => {
  const ACCOUNTS_MENU: SidebarConfig = [
    {
      title: "Gérer les comptes",
      shortTitle: "Gérer",
      link: "/accounts/manage",
      icon: <List />,
    },
    {
      title: "Ajouter un compte",
      shortTitle: "Ajouter",
      link: "/accounts/add",
      icon: <Plus />,
    },
  ];

  return <Sidebar config={ACCOUNTS_MENU} />;
};
