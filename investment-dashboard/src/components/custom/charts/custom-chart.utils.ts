import { formatToEuro, formatToPercentage } from "@/utils/format.utils";
import type { CustomChartUnit } from "./custom-chart.type";

export const getTickFormatterYAxis = (unit: CustomChartUnit) => {
  return unit === "eur"
    ? (value: number) => formatToEuro(value)
    : (value: number) => formatToPercentage(value);
};
