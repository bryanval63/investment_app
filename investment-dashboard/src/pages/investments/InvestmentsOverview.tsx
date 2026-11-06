import { MainContainer } from "@/components/custom/containers/MainContainer";
import { CustomSelect } from "@/components/custom/fields/CustomSelect/CustomSelect";
import { PageToolbar, ToolbarField } from "@/components/custom/containers/PageToolbar";
import { InvestmentsAreaChartCategory } from "@/features/investments/charts/categories/InvestmentsAreaChartCategory";
import { InvestmentsBarChartCategory } from "@/features/investments/charts/categories/InvestmentsBarChartCategory";
import { InvestmentsOverviewCards } from "@/features/investments/InvestmentsOverviewCards/InvestmentsOverviewCards";
import { InvestmentAllocationChart } from "@/features/investments/InvestmentAllocationChart/InvestmentAllocationChart";
import { PerfByAccountsChart } from "@/features/investments/PerfByAccountsChart/PerfByAccountsChart";
import { PerfByCategoriesChart } from "@/features/investments/PerfByCategoriesChart/PerfByCategoriesChart";
import { getInvestmentsOverviewApi } from "@/services/investments/investments.service";
import { getInvestmentCategoriesRefApi } from "@/services/investments/investment-categories-ref.service";
import type { InvestmentCategory } from "@investments/shared";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";

export const InvestmentsOverview = () => {
  const [category, setCategory] = useState<InvestmentCategory>("ALL");

  // Suspense : la page ne s'affiche qu'une fois ces données chargées
  // (le fallback est fourni par le layout parent).
  const { data: investmentsOverview } = useSuspenseQuery({
    queryKey: ["investmentsOverview"],
    queryFn: () => getInvestmentsOverviewApi(),
  });
  const { data: investmentCategories } = useSuspenseQuery({
    queryKey: ["investment-categories-ref"],
    queryFn: getInvestmentCategoriesRefApi,
  });

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <InvestmentsOverviewCards investmentsOverview={investmentsOverview} />

      <section className="flex flex-col gap-3 lg:gap-4">
        <PageToolbar className="justify-between">
          <h2 className="text-base font-semibold text-slate-900">Évolution</h2>
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
        <MainContainer>
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
      </section>

      <section className="flex flex-col gap-3 lg:gap-4">
        <h2 className="text-base font-semibold text-slate-900">
          Répartition et performances
        </h2>
        {/* lg : donut sur toute la largeur puis les deux classements ; 2xl : trois colonnes. */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4 xl:gap-8 2xl:grid-cols-3">
          <div className="min-w-0 lg:col-span-2 2xl:col-span-1">
            <InvestmentAllocationChart />
          </div>
          <PerfByAccountsChart
            perfByAccounts={investmentsOverview?.perfByAccount}
          />
          <PerfByCategoriesChart
            perfByCategories={investmentsOverview?.perfByCategory}
          />
        </div>
      </section>
    </div>
  );
};
