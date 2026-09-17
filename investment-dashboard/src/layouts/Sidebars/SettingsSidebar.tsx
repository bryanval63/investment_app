import { BookOpen, Settings as SettingsIcon } from "lucide-react";
import { Sidebar } from "./Sidebar";
import type { SidebarConfig } from "./sidebar.type";

export const SettingsSidebar = () => {
  const settingsMenu: SidebarConfig = [
    {
      title: "Impôts & frais",
      link: "/settings/taxes",
      icon: <SettingsIcon />,
    },
    {
      title: "Types & catégories",
      link: "/settings/references",
      icon: <BookOpen />,
    },
  ];

  return <Sidebar config={settingsMenu} />;
};
