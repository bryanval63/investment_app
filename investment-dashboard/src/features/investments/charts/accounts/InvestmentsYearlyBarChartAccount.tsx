import { CustomBarChart } from "@/components/custom/charts/CustomBarChart/CustomBarChart";
import { CardContainer } from "@/components/custom/containers/CardContainer";
import { useQuery } from "@tanstack/react-query";
import { getInvestmentsTotalGroupedByAccountYearlyApi } from "@/services/investments/investments-total.service";
import type { CustomChartUnit } from "@/components/custom/charts/custom-chart.type";
import type { ChartType } from "../charts.type";

type InvestmentsYearlyBarChartAccountProps = {
  accountId: number;
  title: string;
  unit?: CustomChartUnit;
  chartType: ChartType;
};

export const InvestmentsYearlyBarChartAccount = ({
  accountId,
  title,
  unit = "eur",
  chartType,
}: InvestmentsYearlyBarChartAccountProps) => {
  const { data: investmentsTotalGroupedByAccountYearly } = useQuery({
    queryKey: ["investmentsTotalGroupedByAccountYearly"],
    queryFn: () => getInvestmentsTotalGroupedByAccountYearlyApi(),
  });

  const chartData =
    investmentsTotalGroupedByAccountYearly
      ?.filter(
        (investment) =>
          investment.accountId === accountId && investment.year > 2022,
      )
      .map(({ amount, year, performance }) => {
        let yAxis;

        switch (chartType) {
          case "sum":
            yAxis = amount;
            break;
          case "perf":
            yAxis = performance;
            break;
          default:
            break;
        }

        return {
          xAxis: year,
          yAxis,
        };
      }) ?? [];

  return (
    <CardContainer title={title}>
      <CustomBarChart chartData={chartData} unit={unit} displayLabels={true} />
    </CardContainer>
  );
};
