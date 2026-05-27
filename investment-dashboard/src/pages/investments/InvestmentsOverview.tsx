import { MainContainer } from "@/components/custom/containers/MainContainer";
import { CustomSelect } from "@/components/custom/fields/CustomSelect/CustomSelect";
import { Separator } from "@/components/ui/separator";
import { InvestmentsAreaChartCategory } from "@/features/investments/charts/categories/InvestmentsAreaChartCategory";
import { InvestmentsBarChartCategory } from "@/features/investments/charts/categories/InvestmentsBarChartCategory";
import { InvestmentsOverviewCards } from "@/features/investments/InvestmentsOverviewCards/InvestmentsOverviewCards";
import { PerfByAccountsChart } from "@/features/investments/PerfByAccountsChart/PerfByAccountsChart";
import { PerfByCategoriesChart } from "@/features/investments/PerfByCategoriesChart/PerfByCategoriesChart";
import { getInvestmentsOverviewApi } from "@/services/investments/investments.service";
import {
  INVESTMENT_CATEGORIES,
  type InvestmentCategory,
} from "@investments/shared";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const InvestmentsOverview = () => {
  const [category, setCategory] = useState<InvestmentCategory>("ALL");

  const { data: investmentsOverview } = useQuery({
    queryKey: ["investmentsOverview"],
    queryFn: () => getInvestmentsOverviewApi(),
  });

  return (
    <div className="flex flex-col gap-8">
      <InvestmentsOverviewCards investmentsOverview={investmentsOverview} />
      <Separator />

      <MainContainer>
        <div className="col-span-2 justify-center flex items-center gap-4">
          <CustomSelect
            value={category}
            onValueChange={setCategory}
            options={INVESTMENT_CATEGORIES}
          />
        </div>

        <InvestmentsAreaChartCategory
          type="totalAmount"
          category={category}
          chartType="sum"
          title="Total des investissements"
        />
        <InvestmentsBarChartCategory
          type="totalAmount"
          category={category}
          title="Variation des investissements"
          chartType="diff"
        />
      </MainContainer>

      <Separator />

      <div className="grid grid-cols-2 gap-8">
        <PerfByAccountsChart
          perfByAccounts={investmentsOverview?.perfByAccount}
        />
        <PerfByCategoriesChart
          perfByCategories={investmentsOverview?.perfByCategory}
        />
      </div>
    </div>
  );
};
