import { MainContainer } from "@/components/custom/containers/MainContainer";
import { PageToolbar, ToolbarField } from "@/components/custom/containers/PageToolbar";
import { CustomSelect } from "@/components/custom/fields/CustomSelect/CustomSelect";
import { InvestmentsAreaChartCategory } from "@/features/investments/charts/categories/InvestmentsAreaChartCategory";
import { InvestmentsBarChartCategory } from "@/features/investments/charts/categories/InvestmentsBarChartCategory";
import { InvestmentsYearlyBarChartCategory } from "@/features/investments/charts/categories/InvestmentsYearlyBarChartCategory";
import { InvestmentsAreaChartAccounts } from "@/features/investments/charts/accounts/InvestmentsAreaChartAccounts";
import {
  type InvestmentCategory,
} from "@investments/shared";
import { getInvestmentCategoriesRefApi } from "@/services/investments/investment-categories-ref.service";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";

export const InvestmentsPerformances = () => {
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
      <div className="lg:col-span-2">
        <InvestmentsAreaChartAccounts key={category} category={category} />
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
        tone="auto"
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
