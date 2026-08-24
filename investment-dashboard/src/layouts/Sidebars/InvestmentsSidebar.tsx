import { Sidebar } from "./Sidebar";
import type { SidebarConfig } from "./sidebar.type";
import {
  Euro,
  Percent,
  Plus,
  LayoutDashboard,
  PiggyBank,
  List,
} from "lucide-react";

export const InvestmentsSidebar = () => {
  const INVESTMENTS_MENU: SidebarConfig = [
    {
      title: "Overview",
      link: "/investments",
      icon: <LayoutDashboard />,
    },
    {
      title: "Performances",
      link: "/investments/performances",
      icon: <Percent />,
    },
    {
      title: "Plus values",
      link: "/investments/total-gains",
      icon: <Euro />,
    },
    {
      title: "Comptes",
      link: "/investments/accounts",
      icon: <PiggyBank />,
    },
    {
      title: "Gérer",
      link: "/investments/manage",
      icon: <List />,
    },
    {
      title: "Ajouter un compte",
      link: "/investments/add-account",
      icon: <Plus />,
    },

    {
      title: "Ajouter un investissement",
      link: "/investments/add",
      icon: <Plus />,
    },
  ];

  return <Sidebar config={INVESTMENTS_MENU} />;
};
