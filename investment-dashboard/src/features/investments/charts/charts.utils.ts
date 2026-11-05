import { formatToReadableDate } from "@/utils/format.utils";
import type { ChartType } from "./charts.type";

/** Les graphiques d'investissements n'affichent que les années strictement après celle-ci. */
export const CHART_START_YEAR = 2022;

export type MonthlyChartSource = {
  date: Date;
  amount: number;
  amountDiff: number;
  avgDiff: number;
  performance: number;
  cumulativePerformance: number;
  capitalGain?: number;
};

export type MonthlyChartPoint = {
  xAxis: string;
  yAxis: number | undefined;
};

const Y_AXIS_BY_CHART_TYPE: Record<
  ChartType,
  (item: MonthlyChartSource) => number | undefined
> = {
  sum: (item) => item.amount,
  diff: (item) => item.amountDiff,
  avg: (item) => item.avgDiff,
  perf: (item) => item.performance,
  cumulPerf: (item) => item.cumulativePerformance,
  capGain: (item) => item.capitalGain,
};

export const getChartYAxisValue = (
  item: MonthlyChartSource,
  chartType: ChartType,
) => Y_AXIS_BY_CHART_TYPE[chartType]?.(item);

export const isAfterChartStartYear = (date: Date) =>
  new Date(date).getFullYear() > CHART_START_YEAR;

export const toMonthlyChartPoint = (
  item: MonthlyChartSource,
  chartType: ChartType,
): MonthlyChartPoint => ({
  xAxis: formatToReadableDate(new Date(item.date), {
    year: "numeric",
    month: "short",
  }),
  yAxis: getChartYAxisValue(item, chartType),
});

/** Filtre les lignes (après CHART_START_YEAR + prédicat) et les convertit en points de graphique. */
export const toMonthlyChartData = <T extends MonthlyChartSource>(
  items: T[] | undefined,
  predicate: (item: T) => boolean,
  chartType: ChartType,
): MonthlyChartPoint[] =>
  items
    ?.filter((item) => predicate(item) && isAfterChartStartYear(item.date))
    .map((item) => toMonthlyChartPoint(item, chartType)) ?? [];
