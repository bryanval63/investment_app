import { formatToEuro, formatToPercentage } from "@/utils/format.utils";
import type { TooltipProps } from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import type { CustomChartUnit } from "../custom-chart.type";

type CustomTooltipProps = TooltipProps<ValueType, NameType> & {
  unit?: CustomChartUnit;
};

export const CustomTooltip = ({
  active,
  payload,
  label,
  unit = "eur",
}: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;

  const [{ value }] = payload;

  return (
    <div className="border rounded-md bg-background/80 backdrop-blur px-3 py-2 shadow-sm">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>

      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-sm bg-chart-3" />

        <p className="text-sm font-medium text-foreground">
          {unit === "eur"
            ? formatToEuro(Number(value))
            : formatToPercentage(Number(value))}
        </p>
      </div>
    </div>
  );
};
