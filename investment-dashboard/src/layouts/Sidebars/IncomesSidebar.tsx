import { Sidebar } from "./Sidebar";
import type { SidebarConfig } from "./sidebar.type";
import { Plus, LayoutDashboard, ListChecks, Table } from "lucide-react";

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
      title: "Détail des saisies",
      shortTitle: "Saisies",
      link: "/incomes/entries",
      icon: <ListChecks />,
    },
    {
      title: "Ajouter un revenu",
      shortTitle: "Revenu",
      link: "/incomes/add",
      icon: <Plus />,
    },
  ];

  return <Sidebar config={INCOMES_MENU} />;
};
