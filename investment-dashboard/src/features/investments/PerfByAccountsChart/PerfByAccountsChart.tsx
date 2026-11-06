import {
  RankedBarList,
  type RankedBarItem,
} from "@/components/custom/charts/RankedBarList/RankedBarList";
import { CardContainer } from "@/components/custom/containers/CardContainer";
import { getAccountsApi } from "@/services/accounts/accounts.service";
import { formatToPercentage } from "@/utils/format.utils";
import type { InvestmentOverviewResponseDto } from "@investments/shared";
import { useSuspenseQuery } from "@tanstack/react-query";

type PerfByAccountsChartProps = {
  perfByAccounts: InvestmentOverviewResponseDto["perfByAccount"] | undefined;
};

export const PerfByAccountsChart = ({
  perfByAccounts,
}: PerfByAccountsChartProps) => {
  const { data: accounts } = useSuspenseQuery({
    queryKey: ["accounts"],
    queryFn: getAccountsApi,
  });

  const accountsById = new Map(
    accounts?.map((account) => [account.id, account]) ?? [],
  );

  const items: RankedBarItem[] =
    perfByAccounts
      ?.filter((account) => !accountsById.get(account.id)?.isClosed)
      .map(({ id, value }) => ({
        key: id,
        label: accountsById.get(id)?.name ?? "",
        value,
        formatted: formatToPercentage(value),
      })) ?? [];

  return (
    <CardContainer
      title="Performances annualisées par comptes"
      description="Comptes ouverts, classés du meilleur au moins bon"
    >
      <RankedBarList items={items} />
    </CardContainer>
  );
};
