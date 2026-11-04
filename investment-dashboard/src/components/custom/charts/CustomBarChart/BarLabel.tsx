import { formatToEuro, formatToPercentage } from "@/utils/format.utils";
import type { LabelProps } from "recharts";
import type { CustomChartUnit } from "../custom-chart.type";

type CustomLabelProps = Omit<LabelProps, "value"> & {
  value?: string | number;
  unit: CustomChartUnit;
  barLayout: "horizontal" | "vertical";
  labelFormatter?: (value: number) => string;
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

  const isVertical = props.barLayout === "horizontal";
  const barSize = Math.abs(isVertical ? barHeight : barWidth);
  const hasEnoughSpace = isVertical
    ? barSize >= 50 && Math.abs(barWidth) >= 44
    : barSize >= 50 && Math.abs(barHeight) >= 16;

  const label =
    props.labelFormatter?.(numericValue) ??
    (props.unit === "eur"
      ? formatToEuro(numericValue)
      : formatToPercentage(numericValue));
  const shouldBeInside = hasEnoughSpace;

  const fill = shouldBeInside ? "#fff" : "#000";
  const posX = isVertical
    ? xPos + barWidth / 2
    : shouldBeInside
      ? xPos + barWidth / 2
      : numericValue < 0
        ? xPos - 8
        : xPos + barWidth + 8;
  const posY = isVertical
    ? shouldBeInside
      ? yPos + barHeight / 2
      : numericValue < 0
        ? yPos + barHeight + 12
        : yPos - 8
    : yPos + barHeight / 2;
  const anchor: "start" | "middle" | "end" = isVertical
    ? "middle"
    : shouldBeInside
      ? "middle"
      : numericValue < 0
        ? "end"
        : "start";

  return (
    <text
      x={posX}
      y={posY}
      dy={4}
      textAnchor={anchor}
      fill={fill}
      fontSize={12}
    >
      {label}
    </text>
  );
};
