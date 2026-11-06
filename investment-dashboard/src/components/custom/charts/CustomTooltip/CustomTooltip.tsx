import type { TooltipProps } from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import type { CustomChartUnit } from "../custom-chart.type";
import { formatChartValue } from "../custom-chart.utils";
import { getValueColor } from "../chart-theme";
import { ChartTooltipCard } from "./ChartTooltipCard";

type CustomTooltipProps = TooltipProps<ValueType, NameType> & {
  unit?: CustomChartUnit;
  /** Colore la valeur selon son signe (variations, performances). */
  signed?: boolean;
};

/** Tooltip des graphiques à une série. */
export const CustomTooltip = ({
  active,
  payload,
  label,
  unit = "eur",
  signed = false,
}: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;

  const [item] = payload;
  const value = Number(item.value);
  // Valeurs signées : même couleur que la barre (vert / rouge).
  const color = signed ? getValueColor(value) : (item.color ?? item.stroke);

  return (
    <ChartTooltipCard
      title={label !== undefined ? String(label) : undefined}
      items={[
        {
          key: "value",
          color,
          formatted: formatChartValue(value, unit),
          signedValue: signed ? value : undefined,
        },
      ]}
    />
  );
};
