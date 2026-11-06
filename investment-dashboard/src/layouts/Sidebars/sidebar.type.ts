import type { ReactNode } from "react";

export type SidebarConfig = {
  title: string;
  // Libellé court affiché sous l'icône dans le menu mobile (sinon `title`).
  shortTitle?: string;
  link: string;
  icon?: ReactNode;
}[];
