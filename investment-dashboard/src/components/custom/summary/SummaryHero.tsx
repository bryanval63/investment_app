import { StatValue } from "@/components/custom/StatsValue/StatsValue";
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
    <div
      data-slot="summary-hero"
      className={cn("flex min-w-0 flex-col", className)}
    >
      <div className="flex flex-col gap-5 px-2 pt-2 lg:px-3 lg:pt-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-300">
            {title}
          </span>
          {headerAction}
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-4xl lg:text-5xl font-semibold tracking-tight tabular-nums text-white">
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
                <span className="text-sm text-slate-300">
                  {comparisonLabel}
                </span>
              )}
            </div>
          )}

          {secondaryAmount !== undefined && (
            <span className="text-sm text-slate-300">
              {secondaryLabel} :{" "}
              <span className="font-semibold tabular-nums text-slate-100">
                {formatToEuro(secondaryAmount)}
              </span>
            </span>
          )}
        </div>
      </div>

      <div className="mt-auto pt-4">
        <Sparkline chartData={chartData} positive={trendValue >= 0} />
      </div>
    </div>
  );
};
