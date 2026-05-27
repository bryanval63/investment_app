import { MainContainer } from "@/components/custom/containers/MainContainer";
import { CustomSelect } from "@/components/custom/fields/CustomSelect/CustomSelect";
import { InvestmentsAreaChartCategory } from "@/features/investments/charts/categories/InvestmentsAreaChartCategory";
import { InvestmentsBarChartCategory } from "@/features/investments/charts/categories/InvestmentsBarChartCategory";
import { InvestmentsYearlyBarChartCategory } from "@/features/investments/charts/categories/InvestmentsYearlyBarChartCategory";
import {
  INVESTMENT_CATEGORIES,
  type InvestmentCategory,
} from "@investments/shared";
import { useState } from "react";

export const InvestmentsPerformances = () => {
  const [category, setCategory] = useState<InvestmentCategory>("ALL");

  return (
    <MainContainer>
      <div className="col-span-2 justify-center flex items-center gap-4">
        <CustomSelect
          value={category}
          onValueChange={setCategory}
          options={INVESTMENT_CATEGORIES}
        />
      </div>
      <InvestmentsBarChartCategory
        type="totalAmount"
        category={category}
        title="Variation des performances"
        chartType="perf"
        unit="per"
      />

      <InvestmentsAreaChartCategory
        type="totalAmount"
        category={category}
        chartType="cumulPerf"
        title="Cumul des performances"
        unit="per"
      />

      <InvestmentsYearlyBarChartCategory
        category={category}
        title="Performances par années"
        unit="per"
        chartType="perf"
      />
    </MainContainer>
  );
};
