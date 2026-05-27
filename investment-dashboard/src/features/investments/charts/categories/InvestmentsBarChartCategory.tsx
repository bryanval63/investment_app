import { CustomBarChart } from "@/components/custom/charts/CustomBarChart/CustomBarChart";
import type {
  InvestmentCategory,
  InvestmentColumnKey,
} from "@investments/shared/types/investments.type";
import { useInvestmentsTotalChartCategory } from "./useInvestmentsTotalChartCategory";
import { CardContainer } from "@/components/custom/containers/CardContainer";
import type { ChartType } from "../charts.type";
import type { CustomChartUnit } from "@/components/custom/charts/custom-chart.type";

type InvestmentsBarChartCategoryProps = {
  category: InvestmentCategory;
  type: InvestmentColumnKey;
  title: string;
  chartType: ChartType;
  unit?: CustomChartUnit;
};

export const InvestmentsBarChartCategory = ({
  category,
  type,
  title,
  chartType,
  unit = "eur",
}: InvestmentsBarChartCategoryProps) => {
  const { chartData } = useInvestmentsTotalChartCategory({
    category,
    type,
    chartType,
  });

  return (
    <CardContainer title={title}>
      <CustomBarChart chartData={chartData} unit={unit} />
    </CardContainer>
  );
};
