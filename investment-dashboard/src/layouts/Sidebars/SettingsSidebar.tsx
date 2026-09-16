import { Settings as SettingsIcon } from "lucide-react";
import { Sidebar } from "./Sidebar";
import type { SidebarConfig } from "./sidebar.type";

export const SettingsSidebar = () => {
  const settingsMenu: SidebarConfig = [
    {
      title: "Paramètres",
      link: "/settings",
      icon: <SettingsIcon />,
    },
  ];

  return <Sidebar config={settingsMenu} />;
};
