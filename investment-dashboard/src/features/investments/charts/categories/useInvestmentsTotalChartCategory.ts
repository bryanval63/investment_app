import { useQuery } from "@tanstack/react-query";
import { getInvestmentsTotalGroupedByCategoryMonthlyApi } from "@/services/investments/investments-total.service";
import { formatToReadableDate } from "@/utils/format.utils";
import type {
  InvestmentCategory,
  InvestmentColumnKey,
} from "@investments/shared";
import type { ChartType } from "../charts.type";

export type useInvestmentsTotalChartCategoryProps = {
  category: InvestmentCategory;
  type: InvestmentColumnKey;
  chartType: ChartType;
};

const START_YEAR = 2022;

export const useInvestmentsTotalChartCategory = ({
  category,
  type,
  chartType,
}: useInvestmentsTotalChartCategoryProps) => {
  const { data: investmentsTotalGroupedByCategory } = useQuery({
    queryKey: ["investmentsTotalGroupedByCategory", type],
    queryFn: () => getInvestmentsTotalGroupedByCategoryMonthlyApi(type),
  });

  const chartData =
    investmentsTotalGroupedByCategory
      ?.filter(
        (gain) =>
          gain.category === category &&
          new Date(gain.date).getFullYear() > START_YEAR,
      )
      .map(
        ({
          amount,
          date,
          amountDiff,
          avgDiff,
          performance,
          cumulativePerformance,
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
