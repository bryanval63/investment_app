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

export const InvestmentsTotalGains = () => {
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
      <InvestmentsAreaChartCategory
        type="capitalGain"
        category={category}
        chartType="sum"
        title="Total des plus values"
      />
      <InvestmentsAreaChartCategory
        type="capitalGain"
        category={category}
        chartType="avg"
        title="Moyenne des plus values"
      />
      <InvestmentsBarChartCategory
        type="capitalGain"
        category={category}
        title="Variation des plus values"
        chartType="diff"
      />
      <InvestmentsYearlyBarChartCategory
        category={category}
        title="Variations des plus values par années"
        chartType="sum"
      />
    </MainContainer>
  );
};
