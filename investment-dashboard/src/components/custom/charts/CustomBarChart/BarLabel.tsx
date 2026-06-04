import { formatToEuro, formatToPercentage } from "@/utils/format.utils";
import type { LabelProps } from "recharts";
import type { CustomChartUnit } from "../custom-chart.type";

type CustomLabelProps = Omit<LabelProps, "value"> & {
  value?: string | number;
  unit: CustomChartUnit;
};

const toNumber = (value: string | number | undefined): number =>
  Number(value ?? 0);

export const BarLabel = (props: CustomLabelProps) => {
  const { x, y, width, height, value } = props;

  const numericValue = toNumber(value);
  const xPos = toNumber(x);
  const yPos = toNumber(y);
  const barWidth = toNumber(width);
  const barHeight = toNumber(height);

  const barSize = Math.abs(barWidth);
  const isSmallBar = barSize < 50;

  const label =
    props.unit === "eur"
      ? formatToEuro(numericValue)
      : formatToPercentage(numericValue);
  const shouldBeInside = !isSmallBar;

  const posX = shouldBeInside
    ? xPos + barWidth / 2
    : numericValue < 0
      ? xPos - 8
      : xPos + barWidth + 8;

  const anchor: "start" | "middle" | "end" = shouldBeInside
    ? "middle"
    : numericValue < 0
      ? "end"
      : "start";

  const fill = shouldBeInside ? "#fff" : "#000";

  return (
    <text
      x={posX}
      y={yPos + barHeight / 2}
      dy={4}
      textAnchor={anchor}
      fill={fill}
      fontSize={12}
    >
      {label}
    </text>
  );
};
