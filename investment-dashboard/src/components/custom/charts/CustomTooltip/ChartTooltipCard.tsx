import { cn } from "@/lib/utils";

export type ChartTooltipItem = {
  key: string;
  name?: string;
  color?: string;
  formatted: string;
  /** Texte secondaire affiché après la valeur (ex. part en %). */
  detail?: string;
  /** Si renseigné, la valeur est colorée selon son signe. */
  signedValue?: number;
};

type ChartTooltipCardProps = {
  title?: string;
  items: ChartTooltipItem[];
};

const signClass = (value: number) =>
  value > 0 ? "text-emerald-600" : value < 0 ? "text-red-500" : "";

/** Carte de tooltip commune à tous les graphiques. */
export const ChartTooltipCard = ({ title, items }: ChartTooltipCardProps) => (
  <div className="min-w-36 rounded-lg border border-slate-200/80 bg-background/95 px-3 py-2 shadow-lg backdrop-blur">
    {title && (
      <p className="mb-1.5 text-xs font-medium text-muted-foreground first-letter:uppercase">
        {title}
      </p>
    )}
    <div className="flex flex-col gap-1">
      {items.map((item) => (
        <div key={item.key} className="flex items-center gap-2 text-sm">
          {item.color && (
            <span
              aria-hidden="true"
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
            />
          )}
          {item.name && (
            <span className="min-w-0 flex-1 truncate text-slate-600">
              {item.name}
            </span>
          )}
          <span
            className={cn(
              "ml-auto font-semibold tabular-nums text-slate-900",
              item.signedValue !== undefined && signClass(item.signedValue),
            )}
          >
            {item.formatted}
          </span>
          {item.detail && (
            <span className="text-xs tabular-nums text-muted-foreground">
              {item.detail}
            </span>
          )}
        </div>
      ))}
    </div>
  </div>
);
