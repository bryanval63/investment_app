import type { CustomBarChartAxis } from "@/components/custom/charts/CustomBarChart/custom-bar-chart.type";
import { CustomBarChart } from "@/components/custom/charts/CustomBarChart/CustomBarChart";
import { CardContainer } from "@/components/custom/containers/CardContainer";
import { formatToPercentage } from "@/utils/format.utils";
import {
  INVESTMENT_CATEGORIES,
  type InvestmentOverviewResponseDto,
} from "@investments/shared";

type PerfByCategoriesChartProps = {
  perfByCategories: InvestmentOverviewResponseDto["perfByCategory"] | undefined;
};

export const PerfByCategoriesChart = ({
  perfByCategories,
}: PerfByCategoriesChartProps) => {
  const chartData =
    perfByCategories
      ?.filter((category) => category.code !== "ALL")
      .map(({ code, value }) => {
        return {
          yAxis:
            INVESTMENT_CATEGORIES?.find((category) => category.code === code)
              ?.label || "",
          xAxis: value,
        };
      }) ?? [];

  const tickFormatterXAxis = (value: string) =>
    formatToPercentage(Number(value));

  return (
    <CardContainer title="Performances annualisées par catégories">
      <CustomBarChart<CustomBarChartAxis>
        chartData={chartData}
        barLayout="vertical"
        tickFormatterXAxis={tickFormatterXAxis}
        unit="per"
        displayLabels={true}
      />
    </CardContainer>
  );
};
