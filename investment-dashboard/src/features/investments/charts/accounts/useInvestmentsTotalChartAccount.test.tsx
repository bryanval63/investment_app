import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getInvestmentsTotalGroupedByAccountMonthlyApi } from "@/services/investments/investments-total.service";
import { createQueryWrapper } from "@/test/test-utils";
import type { InvestmentTotalByMonthGroupByAccountResponseDto } from "@investments/shared";
import type { ChartType } from "../charts.type";
import { useInvestmentsTotalChartAccount } from "./useInvestmentsTotalChartAccount";

vi.mock("@/services/investments/investments-total.service", () => ({
  getInvestmentsTotalGroupedByAccountMonthlyApi: vi.fn(),
}));

const buildRow = (
  overrides: Partial<InvestmentTotalByMonthGroupByAccountResponseDto>,
): InvestmentTotalByMonthGroupByAccountResponseDto =>
  ({
    accountId: 1,
    accountName: "PEA",
    date: new Date(2024, 0, 1),
    amount: 1000,
    amountDiff: 100,
    avgDiff: 50,
    performance: 0.1,
    cumulativePerformance: 0.2,
    capitalGain: 300,
    taxAmount: 0,
    netAmount: 1000,
    ...overrides,
  }) as InvestmentTotalByMonthGroupByAccountResponseDto;

const rows = [
  buildRow({ date: new Date(2022, 11, 1), amount: 1 }), // exclu : 2022
  buildRow({ date: new Date(2023, 0, 1), amount: 2 }),
  buildRow({ accountId: 2, date: new Date(2023, 1, 1), amount: 3 }), // autre compte
  buildRow({
    date: new Date(2024, 5, 1),
    amount: 10,
    amountDiff: 11,
    avgDiff: 12,
    performance: 13,
    cumulativePerformance: 14,
    capitalGain: 15,
  }),
];

const renderChartHook = (chartType: ChartType, accountId = 1) =>
  renderHook(
    () =>
      useInvestmentsTotalChartAccount({
        accountId,
        type: "amount" as never,
        chartType,
      }),
    { wrapper: createQueryWrapper() },
  );

describe("useInvestmentsTotalChartAccount", () => {
  beforeEach(() => {
    vi.mocked(getInvestmentsTotalGroupedByAccountMonthlyApi).mockResolvedValue(
      rows,
    );
  });

  it("suspends while data is loading", () => {
    vi.mocked(getInvestmentsTotalGroupedByAccountMonthlyApi).mockReturnValue(
      new Promise(() => {}),
    );
    const { result } = renderChartHook("sum");
    expect(result.current).toBeNull();
  });

  it("calls the API with the requested unit", async () => {
    renderChartHook("sum");
    await waitFor(() =>
      expect(getInvestmentsTotalGroupedByAccountMonthlyApi).toHaveBeenCalledWith(
        "amount",
      ),
    );
  });

  it("keeps only the given account after 2022 and formats the x axis", async () => {
    const { result } = renderChartHook("sum");
    await waitFor(() => expect(result.current.chartData).toHaveLength(2));
    expect(result.current.chartData).toEqual([
      { xAxis: "janv. 2023", yAxis: 2 },
      { xAxis: "juin 2024", yAxis: 10 },
    ]);
  });

  it.each([
    ["sum", 10],
    ["diff", 11],
    ["avg", 12],
    ["perf", 13],
    ["cumulPerf", 14],
    ["capGain", 15],
  ] as const)("maps chartType %s to the right y value", async (chartType, expected) => {
    const { result } = renderChartHook(chartType);
    await waitFor(() => expect(result.current.chartData).toHaveLength(2));
    expect(result.current.chartData[1].yAxis).toBe(expected);
  });
});
