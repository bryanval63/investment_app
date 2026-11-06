import { Sidebar } from "./Sidebar";
import type { SidebarConfig } from "./sidebar.type";
import { Plus, LayoutDashboard, Table } from "lucide-react";

export const IncomesSidebar = () => {
  const INCOMES_MENU: SidebarConfig = [
    {
      title: "Overview",
      shortTitle: "Aperçu",
      link: "/incomes",
      icon: <LayoutDashboard />,
    },
    {
      title: "Tableau de données",
      shortTitle: "Données",
      link: "/incomes/data",
      icon: <Table />,
    },
    {
      title: "Ajouter un revenu",
      shortTitle: "Revenu",
      link: "/incomes/add",
      icon: <Plus />,
    },
    {
      title: "Ajouter un impôt",
      shortTitle: "Impôt",
      link: "/incomes/tax/add",
      icon: <Plus />,
    },
  ];

  return <Sidebar config={INCOMES_MENU} />;
};
