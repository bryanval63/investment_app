import { useQuery } from "@tanstack/react-query";
import { getInvestmentsTotalGroupedByAccountMonthlyApi } from "@/services/investments/investments-total.service";
import { formatToReadableDate } from "@/utils/format.utils";
import type { InvestmentColumnKey } from "@investments/shared";
import type { ChartType } from "../charts.type";

export type useInvestmentsTotalChartAccountProps = {
  accountId: number;
  type: InvestmentColumnKey;
  chartType: ChartType;
};

export const useInvestmentsTotalChartAccount = ({
  accountId,
  type,
  chartType,
}: useInvestmentsTotalChartAccountProps) => {
  const { data: investmentsTotalGroupedByAccountMonthly } = useQuery({
    queryKey: ["investmentsTotalGroupedByAccountMonthly", type],
    queryFn: () => getInvestmentsTotalGroupedByAccountMonthlyApi(type),
  });

  const chartData =
    investmentsTotalGroupedByAccountMonthly
      ?.filter(
        (investment) =>
          investment.accountId === accountId &&
          new Date(investment.date).getFullYear() > 2022,
      )
      .map(
        ({
          amount,
          date,
          amountDiff,
          avgDiff,
          performance,
          cumulativePerformance,
          capitalGain,
        }) => {
          let yAxis;

          switch (chartType) {
            case "sum":
              yAxis = amount;
              break;
            case "diff":
              yAxis = amountDiff;
              break;
            case "avg":
              yAxis = avgDiff;
              break;
            case "perf":
              yAxis = performance;
              break;
            case "cumulPerf":
              yAxis = cumulativePerformance;
              break;
            case "capGain":
              yAxis = capitalGain;
              break;
            default:
              break;
          }

          return {
            xAxis: formatToReadableDate(new Date(date), {
              year: "numeric",
              month: "short",
            }),
            yAxis,
          };
        },
      ) ?? [];

  return { chartData };
};
