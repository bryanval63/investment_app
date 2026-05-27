import { CustomBarChart } from "@/components/custom/charts/CustomBarChart/CustomBarChart";
import type { InvestmentCategory } from "@investments/shared/types/investments.type";
import { CardContainer } from "@/components/custom/containers/CardContainer";
import { useQuery } from "@tanstack/react-query";
import { getInvestmentsTotalGroupedByCategoryYearlyApi } from "@/services/investments/investments-total.service";
import type { CustomChartUnit } from "@/components/custom/charts/custom-chart.type";
import type { ChartType } from "../charts.type";

type InvestmentsYearlyBarChartCategoryProps = {
  category: InvestmentCategory;
  title: string;
  unit?: CustomChartUnit;
  chartType: ChartType;
};

export const InvestmentsYearlyBarChartCategory = ({
  category,
  title,
  unit = "eur",
  chartType,
}: InvestmentsYearlyBarChartCategoryProps) => {
  const { data: investmentsTotalGroupedByCategoryYearly } = useQuery({
    queryKey: ["investmentsTotalGroupedByCategoryYearly"],
    queryFn: () => getInvestmentsTotalGroupedByCategoryYearlyApi(),
  });

  const chartData =
    investmentsTotalGroupedByCategoryYearly
      ?.filter((gain) => gain.category === category && gain.year > 2022)
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
