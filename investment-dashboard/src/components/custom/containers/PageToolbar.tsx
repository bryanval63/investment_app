import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type PageToolbarProps = {
  children: ReactNode;
  className?: string;
};

/** Barre de filtres en haut de page, alignée à gauche. */
export const PageToolbar = ({ children, className }: PageToolbarProps) => (
  <div
    className={cn(
      "col-span-full flex flex-wrap items-center gap-x-5 gap-y-3",
      className,
    )}
  >
    {children}
  </div>
);

type ToolbarFieldProps = {
  label: string;
  /** Id du contrôle associé au libellé. */
  htmlFor?: string;
  children: ReactNode;
};

/** Un filtre : petit libellé en capitales + contrôle. */
export const ToolbarField = ({ label, htmlFor, children }: ToolbarFieldProps) => (
  <div className="flex items-center gap-2">
    <label
      htmlFor={htmlFor}
      className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
    >
      {label}
    </label>
    {children}
  </div>
);
