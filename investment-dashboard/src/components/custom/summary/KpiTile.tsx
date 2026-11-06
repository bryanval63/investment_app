import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type KpiTileProps = {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
  className?: string;
};

export const KpiTile = ({
  icon: Icon,
  label,
  children,
  className,
}: KpiTileProps) => {
  return (
    // Tuile « verre » posée sur le bandeau sombre de SummarySection.
    <div
      data-slot="kpi-tile"
      className={cn(
        "flex flex-col gap-3 rounded-xl bg-white/5 px-4 py-4 ring-1 ring-white/10 backdrop-blur-sm transition-colors duration-300 hover:bg-white/10 lg:px-5 lg:py-5",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-indigo-200">
          <Icon className="size-4" />
        </span>
        <span className="text-xs font-medium uppercase tracking-wide text-slate-300 leading-tight">
          {label}
        </span>
      </div>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
};

type KpiValueProps = {
  formatted: string;
  colorClass?: string;
  size?: "lg" | "md";
};

export const KpiValue = ({
  formatted,
  colorClass = "text-white",
  size = "lg",
}: KpiValueProps) => (
  <span
    className={cn(
      "font-semibold tabular-nums",
      size === "lg" ? "text-xl lg:text-2xl" : "text-base lg:text-lg",
      colorClass,
    )}
  >
    {formatted}
  </span>
);
