import type { UIMatch } from "react-router-dom";

type RouteHandle = {
  sidebar?: React.ComponentType;
  header?: React.ReactNode;
};

export type AppMatch = UIMatch<unknown, RouteHandle>;
