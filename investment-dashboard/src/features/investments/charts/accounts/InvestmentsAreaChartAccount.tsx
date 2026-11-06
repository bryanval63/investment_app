import { CustomAreaChart } from "@/components/custom/charts/CustomAreaChart/CustomAreaChart";
import type { InvestmentColumnKey } from "@investments/shared/types/investments.type";
import type { ChartType } from "../charts.type";
import { CardContainer } from "@/components/custom/containers/CardContainer";
import type { CustomChartUnit } from "@/components/custom/charts/custom-chart.type";
import { useInvestmentsTotalChartAccount } from "./useInvestmentsTotalChartAccount";

type InvestmentsAreaChartAccountProps = {
  accountId: number;
  type: InvestmentColumnKey;
  chartType: ChartType;
  title: string;
  unit?: CustomChartUnit;
  /** `auto` : vert ou rouge selon le signe (performances, plus-values). */
  tone?: "accent" | "auto";
};

export const InvestmentsAreaChartAccount = ({
  accountId,
  type,
  chartType,
  title,
  unit = "eur",
  tone = "accent",
}: InvestmentsAreaChartAccountProps) => {
  const { chartData } = useInvestmentsTotalChartAccount({
    accountId,
    type,
    chartType,
  });

  return (
    <CardContainer title={title}>
      <CustomAreaChart chartData={chartData} unit={unit} tone={tone} />
    </CardContainer>
  );
};
