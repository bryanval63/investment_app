import { Sidebar } from "./Sidebar";
import type { SidebarConfig } from "./sidebar.type";
import { Plus, LayoutDashboard, Table } from "lucide-react";

export const IncomesSidebar = () => {
  const INCOMES_MENU: SidebarConfig = [
    {
      title: "Overview",
      link: "/incomes",
      icon: <LayoutDashboard />,
    },
    {
      title: "Tableau de données",
      link: "/incomes/data",
      icon: <Table />,
    },
    {
      title: "Ajouter un revenu",
      link: "/incomes/add",
      icon: <Plus />,
    },
    {
      title: "Ajouter un impôt",
      link: "/incomes/tax/add",
      icon: <Plus />,
    },
  ];

  return <Sidebar config={INCOMES_MENU} />;
};
