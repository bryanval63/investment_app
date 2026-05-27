import type { ReactNode } from "react";

export type SidebarConfig = {
  title: string;
  link: string;
  icon?: ReactNode;
}[];
