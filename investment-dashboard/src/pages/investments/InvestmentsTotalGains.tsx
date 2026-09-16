import { MainContainer } from "@/components/custom/containers/MainContainer";
import { CustomSelect } from "@/components/custom/fields/CustomSelect/CustomSelect";
import { InvestmentsAreaChartCategory } from "@/features/investments/charts/categories/InvestmentsAreaChartCategory";
import { InvestmentsBarChartCategory } from "@/features/investments/charts/categories/InvestmentsBarChartCategory";
import { InvestmentsYearlyBarChartCategory } from "@/features/investments/charts/categories/InvestmentsYearlyBarChartCategory";
import { getInvestmentCategoriesRefApi } from "@/services/investments/investment-categories-ref.service";
import type { InvestmentCategory } from "@investments/shared";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const InvestmentsTotalGains = () => {
  const [category, setCategory] = useState<InvestmentCategory>("ALL");
  const { data: investmentCategories = [] } = useQuery({
    queryKey: ["investment-categories-ref"],
    queryFn: getInvestmentCategoriesRefApi,
  });

  return (
    <MainContainer>
      <div className="col-span-2 justify-center flex items-center gap-4">
        <CustomSelect
          value={category}
          onValueChange={setCategory}
          options={investmentCategories}
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
