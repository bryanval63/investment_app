import { getSeriesColor } from "@/components/custom/charts/chart-theme";
import {
  RankedBarList,
  type RankedBarItem,
} from "@/components/custom/charts/RankedBarList/RankedBarList";
import { CardContainer } from "@/components/custom/containers/CardContainer";
import { getStatsGroupedByTypeIncomesApi } from "@/services/incomes/incomes-stats.service";
import { formatToEuro } from "@/utils/format.utils";
import { useSuspenseQuery } from "@tanstack/react-query";

export const IncomesByTypeChart = () => {
  const { data: incomesGroupBy } = useSuspenseQuery({
    queryKey: ["incomesGroupedByType"],
    queryFn: () => getStatsGroupedByTypeIncomesApi(),
  });

  const items: RankedBarItem[] =
    incomesGroupBy
      ?.filter((incomes) => incomes.code !== "SALARY")
      .map(({ code, amount, label }, index) => ({
        key: code,
        label,
        value: amount,
        formatted: formatToEuro(amount, { maximumFractionDigits: 0 }),
        color: getSeriesColor(index),
      })) ?? [];

  return (
    <CardContainer
      title="Total des revenus par catégorie"
      description="Hors salaire"
    >
      <RankedBarList items={items} variant="amount" />
    </CardContainer>
  );
};
