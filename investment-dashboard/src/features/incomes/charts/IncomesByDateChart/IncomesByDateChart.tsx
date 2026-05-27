import { getStatsGroupedByDateIncomesApi } from "@/services/incomes/incomes-stats.service";
import { useQuery } from "@tanstack/react-query";
import { CustomBarChart } from "@/components/custom/charts/CustomBarChart/CustomBarChart";
import type { IncomeUnit } from "@investments/shared";
import { formatToReadableDate } from "@/utils/format.utils";
import type { CustomBarChartAxis } from "@/components/custom/charts/CustomBarChart/custom-bar-chart.type";
import { CardContainer } from "@/components/custom/containers/CardContainer";

type IncomesByDateChartProps = {
  unit: IncomeUnit;
  hasTaxes: boolean;
};

const getDateParams = (unit: IncomeUnit) => {
  return unit === "month"
    ? ({
        month: "short",
        year: "numeric",
      } as const)
    : ({
        year: "numeric",
      } as const);
};

export const IncomesByDateChart = ({
  unit,
  hasTaxes,
}: IncomesByDateChartProps) => {
  const { data: incomesGroupedByDate } = useQuery({
    queryKey: ["incomesGroupedByDate", unit, hasTaxes],
    queryFn: () => getStatsGroupedByDateIncomesApi(unit, hasTaxes),
  });

  const chartData =
    incomesGroupedByDate?.map(({ amount, date }) => {
      return {
        xAxis: formatToReadableDate(new Date(date), getDateParams(unit)),
        yAxis: amount,
      };
    }) ?? [];

  const tickFormatterXAxis = (value: string, index: number) =>
    unit === "month" ? (index % 10 === 0 ? value : "") : value;

  return (
    <CardContainer title="Total des revenus par date">
      <CustomBarChart<CustomBarChartAxis>
        chartData={chartData}
        tickFormatterXAxis={tickFormatterXAxis}
      />
    </CardContainer>
  );
};
