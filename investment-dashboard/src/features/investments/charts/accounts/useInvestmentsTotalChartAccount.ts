import { useQuery } from "@tanstack/react-query";
import { getInvestmentsTotalGroupedByAccountMonthlyApi } from "@/services/investments/investments-total.service";
import type { InvestmentColumnKey } from "@investments/shared";
import type { ChartType } from "../charts.type";
import { toMonthlyChartData } from "../charts.utils";

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

  const chartData = toMonthlyChartData(
    investmentsTotalGroupedByAccountMonthly,
    (investment) => investment.accountId === accountId,
    chartType,
  );

  return { chartData };
};
