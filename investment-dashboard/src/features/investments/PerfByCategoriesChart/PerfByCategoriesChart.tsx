import {
  RankedBarList,
  type RankedBarItem,
} from "@/components/custom/charts/RankedBarList/RankedBarList";
import { CardContainer } from "@/components/custom/containers/CardContainer";
import { formatToPercentage } from "@/utils/format.utils";
import { getInvestmentCategoriesRefApi } from "@/services/investments/investment-categories-ref.service";
import type { InvestmentOverviewResponseDto } from "@investments/shared";
import { useSuspenseQuery } from "@tanstack/react-query";

type PerfByCategoriesChartProps = {
  perfByCategories: InvestmentOverviewResponseDto["perfByCategory"] | undefined;
};

export const PerfByCategoriesChart = ({
  perfByCategories,
}: PerfByCategoriesChartProps) => {
  const { data: investmentCategories = [] } = useSuspenseQuery({
    queryKey: ["investment-categories-ref"],
    queryFn: getInvestmentCategoriesRefApi,
  });
  const items: RankedBarItem[] =
    perfByCategories
      ?.filter((category) => category.code !== "ALL")
      .map(({ code, value }) => ({
        key: code,
        label:
          investmentCategories.find((category) => category.code === code)
            ?.label ?? code,
        value,
        formatted: formatToPercentage(value),
      })) ?? [];

  return (
    <CardContainer
      title="Performances annualisées par catégories"
      description="Classées de la meilleure à la moins bonne"
    >
      <RankedBarList items={items} />
    </CardContainer>
  );
};
