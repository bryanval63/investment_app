import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SummarySectionProps = {
  hero: ReactNode;
  /** Tuiles KPI, affichées en grille de 2 colonnes. */
  children: ReactNode;
  className?: string;
};

/**
 * Bandeau sombre en tête de page : il se détache des cartes blanches qui suivent.
 * La classe `dark` y active la palette sombre (tokens shadcn et variantes `dark:`).
 */
export const SummarySection = ({
  hero,
  children,
  className,
}: SummarySectionProps) => (
  <section
    className={cn(
      "dark relative isolate overflow-hidden rounded-2xl bg-linear-to-br from-slate-900 via-slate-900 to-indigo-950 p-3 text-white shadow-lg shadow-indigo-950/20 ring-1 ring-white/10 lg:p-5",
      className,
    )}
  >
    {/* Halos décoratifs, rappel des couleurs du logo. */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -top-24 -left-16 -z-10 size-72 rounded-full bg-indigo-500/25 blur-3xl"
    />
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -right-20 -bottom-28 -z-10 size-80 rounded-full bg-cyan-400/10 blur-3xl"
    />

    {/* Côte à côte uniquement à partir de xl : en dessous, les tuiles seraient trop étroites. */}
    <div className="grid grid-cols-1 gap-3 lg:gap-5 xl:grid-cols-2">
      {hero}
      <div className="grid grid-cols-2 gap-3 lg:gap-4">{children}</div>
    </div>
  </section>
);
