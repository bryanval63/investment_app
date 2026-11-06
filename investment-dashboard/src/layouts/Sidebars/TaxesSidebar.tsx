import { Sidebar } from "./Sidebar";
import type { SidebarConfig } from "./sidebar.type";
import { Plus, Table } from "lucide-react";

export const TaxesSidebar = () => {
  const TAXES_MENU: SidebarConfig = [
    {
      title: "Impôts saisis",
      shortTitle: "Saisis",
      link: "/taxes",
      icon: <Table />,
    },
    {
      title: "Ajouter un impôt",
      shortTitle: "Ajouter",
      link: "/taxes/add",
      icon: <Plus />,
    },
  ];

  return <Sidebar config={TAXES_MENU} />;
};
