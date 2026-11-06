import { MainContainer } from "@/components/custom/containers/MainContainer";
import { PageToolbar, ToolbarField } from "@/components/custom/containers/PageToolbar";
import { CustomSelect } from "@/components/custom/fields/CustomSelect/CustomSelect";
import { InvestmentsAreaChartCategory } from "@/features/investments/charts/categories/InvestmentsAreaChartCategory";
import { InvestmentsBarChartCategory } from "@/features/investments/charts/categories/InvestmentsBarChartCategory";
import { InvestmentsYearlyBarChartCategory } from "@/features/investments/charts/categories/InvestmentsYearlyBarChartCategory";
import { getInvestmentCategoriesRefApi } from "@/services/investments/investment-categories-ref.service";
import type { InvestmentCategory } from "@investments/shared";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";

export const InvestmentsTotalGains = () => {
  const [category, setCategory] = useState<InvestmentCategory>("ALL");
  const { data: investmentCategories = [] } = useSuspenseQuery({
    queryKey: ["investment-categories-ref"],
    queryFn: getInvestmentCategoriesRefApi,
  });

  return (
    <MainContainer>
      <PageToolbar>
        <ToolbarField label="Catégorie" htmlFor="category">
          <CustomSelect
            id="category"
            variant="pill"
            value={category}
            onValueChange={setCategory}
            options={investmentCategories}
          />
        </ToolbarField>
      </PageToolbar>
      <InvestmentsAreaChartCategory
        type="capitalGain"
        category={category}
        chartType="sum"
        title="Total des plus values"
        tone="auto"
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
