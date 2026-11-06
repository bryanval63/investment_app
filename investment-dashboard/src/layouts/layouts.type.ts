import type { UIMatch } from "react-router-dom";

type RouteHandle = {
  sidebar?: React.ComponentType;
  header?: React.ReactNode;
  // Squelette affiché pendant le chargement : "summary" pour les pages qui
  // commencent par un bandeau de résumé sombre (SummarySection).
  pageLoader?: "summary";
};

export type AppMatch = UIMatch<unknown, RouteHandle>;
