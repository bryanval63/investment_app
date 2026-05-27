import type { CustomBarChartAxis } from "@/components/custom/charts/CustomBarChart/custom-bar-chart.type";
import { CustomBarChart } from "@/components/custom/charts/CustomBarChart/CustomBarChart";
import { CardContainer } from "@/components/custom/containers/CardContainer";
import { getStatsGroupedByTypeIncomesApi } from "@/services/incomes/incomes-stats.service";
import { formatToEuro } from "@/utils/format.utils";
import { useQuery } from "@tanstack/react-query";

export const IncomesByTypeChart = () => {
  const { data: incomesGroupBy } = useQuery({
    queryKey: ["incomesGroupedByType"],
    queryFn: () => getStatsGroupedByTypeIncomesApi(),
  });

  const chartData =
    incomesGroupBy
      ?.filter((incomes) => incomes.code !== "SALARY")
      .map(({ amount, label }) => {
        return {
          yAxis: label,
          xAxis: amount,
        };
      }) ?? [];

  const tickFormatterXAxis = (value: string) => formatToEuro(Number(value));

  return (
    <CardContainer title="Total des revenus par catégorie">
      <CustomBarChart<CustomBarChartAxis>
        chartData={chartData}
        barLayout="vertical"
        tickFormatterXAxis={tickFormatterXAxis}
        displayLabels={true}
      />
    </CardContainer>
  );
};
