import type { CustomBarChartAxis } from "@/components/custom/charts/CustomBarChart/custom-bar-chart.type";
import { CustomBarChart } from "@/components/custom/charts/CustomBarChart/CustomBarChart";
import { CardContainer } from "@/components/custom/containers/CardContainer";
import { useIsMobile } from "@/hooks/useIsMobile";
import { formatToPercentage } from "@/utils/format.utils";
import { getInvestmentCategoriesRefApi } from "@/services/investments/investment-categories-ref.service";
import type { InvestmentOverviewResponseDto } from "@investments/shared";
import { useQuery } from "@tanstack/react-query";

type PerfByCategoriesChartProps = {
  perfByCategories: InvestmentOverviewResponseDto["perfByCategory"] | undefined;
};

export const PerfByCategoriesChart = ({
  perfByCategories,
}: PerfByCategoriesChartProps) => {
  const isMobile = useIsMobile();
  const { data: investmentCategories = [] } = useQuery({
    queryKey: ["investment-categories-ref"],
    queryFn: getInvestmentCategoriesRefApi,
  });
  const chartData =
    perfByCategories
      ?.filter((category) => category.code !== "ALL")
      .map(({ code, value }) => {
        return {
          yAxis:
            code === "CRYPTO" && isMobile
              ? "Cryptos"
              : investmentCategories.find(
                  (category) => category.code === code,
                )?.label || "",
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
