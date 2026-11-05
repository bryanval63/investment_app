import { describe, expect, it } from "vitest";
import {
  CHART_START_YEAR,
  getChartYAxisValue,
  isAfterChartStartYear,
  toMonthlyChartData,
  type MonthlyChartSource,
} from "./charts.utils";

const item: MonthlyChartSource = {
  date: new Date(2024, 5, 1),
  amount: 10,
  amountDiff: 11,
  avgDiff: 12,
  performance: 13,
  cumulativePerformance: 14,
  capitalGain: 15,
};

describe("charts.utils", () => {
  it.each([
    ["sum", 10],
    ["diff", 11],
    ["avg", 12],
    ["perf", 13],
    ["cumulPerf", 14],
    ["capGain", 15],
  ] as const)("getChartYAxisValue maps %s", (chartType, expected) => {
    expect(getChartYAxisValue(item, chartType)).toBe(expected);
  });

  it("getChartYAxisValue returns undefined for capGain without capital gain", () => {
    const withoutCapitalGain = { ...item, capitalGain: undefined };
    expect(getChartYAxisValue(withoutCapitalGain, "capGain")).toBeUndefined();
  });

  it("isAfterChartStartYear excludes the start year itself", () => {
    expect(CHART_START_YEAR).toBe(2022);
    expect(isAfterChartStartYear(new Date(2022, 11, 31))).toBe(false);
    expect(isAfterChartStartYear(new Date(2023, 0, 1))).toBe(true);
  });

  it("toMonthlyChartData filters, then maps to chart points", () => {
    const rows = [
      { ...item, id: 1, date: new Date(2022, 5, 1) },
      { ...item, id: 1, date: new Date(2023, 0, 1), amount: 2 },
      { ...item, id: 2, date: new Date(2023, 1, 1) },
    ];
    expect(toMonthlyChartData(rows, (row) => row.id === 1, "sum")).toEqual([
      { xAxis: "janv. 2023", yAxis: 2 },
    ]);
    expect(toMonthlyChartData(undefined, () => true, "sum")).toEqual([]);
  });
});
