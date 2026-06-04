import { formatToEuro, formatToPercentage } from "@/utils/format.utils";
import type { CustomChartUnit } from "./custom-chart.type";

export const getTickFormatterYAxis = (
  unit: CustomChartUnit,
  isMobile: boolean,
) => {
  return unit === "eur"
    ? (value: number) =>
        formatToEuro(value, {
          notation: isMobile ? "compact" : "standard",
          minimumFractionDigits: 0,
        })
    : (value: number) =>
        formatToPercentage(value, { minimumFractionDigits: 0 });
};
