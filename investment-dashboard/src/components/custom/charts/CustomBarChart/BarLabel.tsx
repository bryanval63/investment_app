import type { LabelProps } from "recharts";
import type { CustomChartUnit } from "../custom-chart.type";
import { formatChartLabel } from "../custom-chart.utils";
import { getValueColor } from "../chart-theme";

type CustomLabelProps = Omit<LabelProps, "value"> & {
  value?: string | number;
  unit: CustomChartUnit;
  labelFormatter?: (value: number) => string;
};

/** En dessous de cette largeur de barre, les libellés se chevaucheraient. */
export const MIN_LABEL_BAR_WIDTH = 26;

const toNumber = (value: string | number | undefined): number =>
  Number(value ?? 0);

/**
 * Libellé au bout de la barre : au-dessus si positive, en dessous si négative,
 * dans la couleur de la barre.
 */
export const BarLabel = ({
  x,
  y,
  width,
  height,
  value,
  unit,
  labelFormatter,
}: CustomLabelProps) => {
  const numericValue = toNumber(value);
  const barWidth = toNumber(width);

  if (barWidth < MIN_LABEL_BAR_WIDTH) return null;

  const top = Math.min(toNumber(y), toNumber(y) + toNumber(height));
  const bottom = Math.max(toNumber(y), toNumber(y) + toNumber(height));
  const posY = numericValue < 0 ? bottom + 14 : top - 6;

  return (
    <text
      x={toNumber(x) + barWidth / 2}
      y={posY}
      textAnchor="middle"
      fill={getValueColor(numericValue)}
      fontSize={11}
      fontWeight={600}
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {labelFormatter?.(numericValue) ?? formatChartLabel(numericValue, unit)}
    </text>
  );
};
