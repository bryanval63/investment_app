import { CustomAreaChart } from "@/components/custom/charts/CustomAreaChart/CustomAreaChart";
import { CardContainer } from "@/components/custom/containers/CardContainer";
import { getStatsGroupedByDateIncomesApi } from "@/services/incomes/incomes-stats.service";
import { formatToReadableDate } from "@/utils/format.utils";
import { getCurrentYear } from "@investments/shared";
import { useQuery } from "@tanstack/react-query";

type IncomesMonthlyAverageChartProps = {
  hasTaxes: boolean;
};

export const IncomesMonthlyAverageChart = ({
  hasTaxes,
}: IncomesMonthlyAverageChartProps) => {
  const { data: incomesGroupedByDate } = useQuery({
    queryKey: ["incomesGroupedByDate", hasTaxes],
    queryFn: () => getStatsGroupedByDateIncomesApi("year", hasTaxes),
  });

  const chartData =
    incomesGroupedByDate
      ?.filter(
        (income) => new Date(income.date).getFullYear() !== getCurrentYear(),
      )
      .map(({ amount, date }) => {
        return {
          xAxis: formatToReadableDate(new Date(date), { year: "numeric" }),
          yAxis: amount / 12,
        };
      }) ?? [];

  return (
    <CardContainer title="Moyenne des revenus">
      <CustomAreaChart chartData={chartData} />
    </CardContainer>
  );
};
