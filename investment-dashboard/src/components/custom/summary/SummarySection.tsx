import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SummarySectionProps = {
  hero: ReactNode;
  /** Tuiles KPI, affichées en grille de 2 colonnes. */
  children: ReactNode;
  className?: string;
};

export const SummarySection = ({
  hero,
  children,
  className,
}: SummarySectionProps) => (
  // Côte à côte uniquement à partir de xl : en dessous, les tuiles seraient trop étroites.
  <div
    className={cn("grid grid-cols-1 xl:grid-cols-2 gap-3 lg:gap-6", className)}
  >
    {hero}
    <div className="grid grid-cols-2 gap-3 lg:gap-4">{children}</div>
  </div>
);
