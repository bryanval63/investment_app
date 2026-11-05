import { useSuspenseQuery } from "@tanstack/react-query";
import { getInvestmentsTotalGroupedByCategoryMonthlyApi } from "@/services/investments/investments-total.service";
import type {
  InvestmentCategory,
  InvestmentColumnKey,
} from "@investments/shared";
import type { ChartType } from "../charts.type";
import { toMonthlyChartData } from "../charts.utils";

export type useInvestmentsTotalChartCategoryProps = {
  category: InvestmentCategory;
  type: InvestmentColumnKey;
  chartType: ChartType;
};

export const useInvestmentsTotalChartCategory = ({
  category,
  type,
  chartType,
}: useInvestmentsTotalChartCategoryProps) => {
  const { data: investmentsTotalGroupedByCategory } = useSuspenseQuery({
    queryKey: ["investmentsTotalGroupedByCategory", type],
    queryFn: () => getInvestmentsTotalGroupedByCategoryMonthlyApi(type),
  });

  const chartData = toMonthlyChartData(
    investmentsTotalGroupedByCategory,
    (gain) => gain.category === category,
    chartType,
  );

  return { chartData };
};
