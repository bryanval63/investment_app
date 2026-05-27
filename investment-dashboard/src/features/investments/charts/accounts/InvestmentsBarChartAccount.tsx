import { CustomBarChart } from "@/components/custom/charts/CustomBarChart/CustomBarChart";
import type { InvestmentColumnKey } from "@investments/shared/types/investments.type";
import { CardContainer } from "@/components/custom/containers/CardContainer";
import type { ChartType } from "../charts.type";
import type { CustomChartUnit } from "@/components/custom/charts/custom-chart.type";
import { useInvestmentsTotalChartAccount } from "./useInvestmentsTotalChartAccount";

type InvestmentsBarChartAccountProps = {
  accountId: number;
  type: InvestmentColumnKey;
  title: string;
  chartType: ChartType;
  unit?: CustomChartUnit;
};

export const InvestmentsBarChartAccountProps = ({
  accountId,
  type,
  title,
  chartType,
  unit = "eur",
}: InvestmentsBarChartAccountProps) => {
  const { chartData } = useInvestmentsTotalChartAccount({
    accountId,
    type,
    chartType,
  });

  return (
    <CardContainer title={title}>
      <CustomBarChart chartData={chartData} unit={unit} />
    </CardContainer>
  );
};
