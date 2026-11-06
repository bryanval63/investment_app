import { cn } from "@/lib/utils";
import { CHART_COLORS, getValueColor } from "../chart-theme";

export type RankedBarItem = {
  key: string | number;
  label: string;
  value: number;
  formatted: string;
  /** Pastille de couleur optionnelle (ex. série du graphique). */
  color?: string;
};

type RankedBarListProps = {
  items: RankedBarItem[];
  /**
   * `signed` : barre divergente autour de zéro, verte ou rouge (performances).
   * `amount` : barre simple proportionnelle au maximum (montants).
   */
  variant?: "signed" | "amount";
  emptyLabel?: string;
};

const valueClass = (value: number) =>
  value > 0 ? "text-emerald-600" : value < 0 ? "text-red-500" : "text-slate-500";

/** Classement lisible : une ligne par élément, triée par valeur décroissante. */
export const RankedBarList = ({
  items,
  variant = "signed",
  emptyLabel = "Aucune donnée.",
}: RankedBarListProps) => {
  if (items.length === 0) {
    return (
      <p className="flex h-32 items-center justify-center text-sm text-muted-foreground">
        {emptyLabel}
      </p>
    );
  }

  const sorted = [...items].sort((a, b) => b.value - a.value);
  const maxAbs = Math.max(...sorted.map(({ value }) => Math.abs(value)), 0) || 1;
  const hasNegative = variant === "signed" && sorted.some((i) => i.value < 0);

  return (
    <ul className="flex flex-col gap-3.5">
      {sorted.map((item) => {
        const ratio = Math.abs(item.value) / maxAbs;
        const barColor =
          variant === "signed"
            ? getValueColor(item.value)
            : (item.color ?? CHART_COLORS.accent);

        return (
          <li key={item.key} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="flex min-w-0 items-center gap-2">
                {item.color && (
                  <span
                    aria-hidden="true"
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                )}
                <span className="truncate text-slate-700">{item.label}</span>
              </span>
              <span
                className={cn(
                  "shrink-0 font-semibold tabular-nums",
                  variant === "signed" ? valueClass(item.value) : "text-slate-900",
                )}
              >
                {item.formatted}
              </span>
            </div>
            <div
              aria-hidden="true"
              className="relative h-1.5 w-full overflow-hidden rounded-full bg-slate-100"
            >
              {hasNegative ? (
                // Divergente : zéro au centre, négatif vers la gauche.
                <>
                  <span className="absolute inset-y-0 left-1/2 w-px bg-slate-300" />
                  <span
                    className="absolute inset-y-0 rounded-full"
                    style={{
                      backgroundColor: barColor,
                      width: `${ratio * 50}%`,
                      ...(item.value < 0
                        ? { right: "50%" }
                        : { left: "50%" }),
                    }}
                  />
                </>
              ) : (
                <span
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ backgroundColor: barColor, width: `${ratio * 100}%` }}
                />
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};
