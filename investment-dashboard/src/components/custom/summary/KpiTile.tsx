import { Card } from "@/components/ui/card";
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
    <Card
      className={cn(
        "gap-3 lg:gap-3 border px-4 py-4 lg:px-5 lg:py-5 transition-shadow duration-300 hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          <Icon className="size-4" />
        </span>
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground leading-tight">
          {label}
        </span>
      </div>
      <div className="flex flex-col gap-1">{children}</div>
    </Card>
  );
};

type KpiValueProps = {
  formatted: string;
  colorClass?: string;
  size?: "lg" | "md";
};

export const KpiValue = ({
  formatted,
  colorClass = "text-slate-900",
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
