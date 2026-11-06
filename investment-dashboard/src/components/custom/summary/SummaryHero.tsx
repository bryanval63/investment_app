import { StatValue } from "@/components/custom/StatsValue/StatsValue";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatToEuro, formatToPercentage } from "@/utils/format.utils";
import { getColorAndBgColor } from "@/utils/style.utils";
import type { ReactNode } from "react";
import { Sparkline, type SparklinePoint } from "./Sparkline";

type SummaryHeroProps = {
  title: string;
  amount: number;
  /** Badge en euros (plus-value, variation…). */
  capitalGain?: number;
  /** Pastille en pourcentage à côté du badge. */
  perf?: number;
  /** Référence du badge et de la pastille (ex. « vs même période 2025 »). */
  comparisonLabel?: string;
  /** Ligne secondaire (ex. montant net après impôts). */
  secondaryAmount?: number;
  secondaryLabel?: string;
  /** Sens de la tendance (couleur de la courbe) si ni badge ni pastille. */
  trend?: number;
  /** Élément affiché en haut à droite (ex. switch). */
  headerAction?: ReactNode;
  chartData?: SparklinePoint[];
  className?: string;
};

export const SummaryHero = ({
  title,
  amount,
  capitalGain,
  perf,
  comparisonLabel,
  secondaryAmount,
  secondaryLabel = "Net estimé après impôts",
  trend,
  headerAction,
  chartData = [],
  className,
}: SummaryHeroProps) => {
  const trendValue = trend ?? perf ?? capitalGain ?? 0;

  return (
    <Card
      className={cn(
        "min-w-0 gap-0 lg:gap-0 overflow-hidden border bg-gradient-to-br from-slate-50 to-white px-0 py-0 lg:py-0",
        className,
      )}
    >
      <div className="flex flex-col gap-5 px-5 pt-5 lg:px-8 lg:pt-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-medium text-muted-foreground">
            {title}
          </span>
          {headerAction}
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-4xl lg:text-5xl font-semibold tracking-tight tabular-nums text-slate-900">
            {formatToEuro(amount)}
          </span>

          {(capitalGain !== undefined || perf !== undefined) && (
            <div className="flex flex-wrap items-center gap-2">
              {capitalGain !== undefined && (
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-sm font-semibold tabular-nums text-white",
                    getColorAndBgColor(capitalGain, true, true),
                  )}
                >
                  {formatToEuro(capitalGain, { signDisplay: "always" })}
                </span>
              )}
              {perf !== undefined && (
                <StatValue
                  value={perf}
                  formatted={formatToPercentage(perf)}
                  style="text-sm rounded-full"
                />
              )}
              {comparisonLabel && (
                <span className="text-sm text-muted-foreground">
                  {comparisonLabel}
                </span>
              )}
            </div>
          )}

          {secondaryAmount !== undefined && (
            <span className="text-sm text-muted-foreground">
              {secondaryLabel} :{" "}
              <span className="font-semibold tabular-nums text-slate-700">
                {formatToEuro(secondaryAmount)}
              </span>
            </span>
          )}
        </div>
      </div>

      <div className="mt-auto pt-4">
        <Sparkline chartData={chartData} positive={trendValue >= 0} />
      </div>
    </Card>
  );
};
