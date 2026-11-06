import { CustomAreaChart } from "@/components/custom/charts/CustomAreaChart/CustomAreaChart";
import type {
  InvestmentCategory,
  InvestmentColumnKey,
} from "@investments/shared/types/investments.type";
import { useInvestmentsTotalChartCategory } from "./useInvestmentsTotalChartCategory";
import type { ChartType } from "../charts.type";
import { CardContainer } from "@/components/custom/containers/CardContainer";
import type { CustomChartUnit } from "@/components/custom/charts/custom-chart.type";

type InvestmentsAreaChartCategoryProps = {
  category: InvestmentCategory;
  type: InvestmentColumnKey;
  chartType: ChartType;
  title: string;
  unit?: CustomChartUnit;
  /** `auto` : vert ou rouge selon le signe (performances, plus-values). */
  tone?: "accent" | "auto";
};

export const InvestmentsAreaChartCategory = ({
  category,
  type,
  chartType,
  title,
  unit = "eur",
  tone = "accent",
}: InvestmentsAreaChartCategoryProps) => {
  const { chartData } = useInvestmentsTotalChartCategory({
    category,
    type,
    chartType,
  });

  return (
    <CardContainer title={title}>
      <CustomAreaChart chartData={chartData} unit={unit} tone={tone} />
    </CardContainer>
  );
};
