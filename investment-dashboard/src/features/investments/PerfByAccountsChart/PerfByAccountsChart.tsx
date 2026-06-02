import type { CustomBarChartAxis } from "@/components/custom/charts/CustomBarChart/custom-bar-chart.type";
import { CustomBarChart } from "@/components/custom/charts/CustomBarChart/CustomBarChart";
import { CardContainer } from "@/components/custom/containers/CardContainer";
import { getAccountsApi } from "@/services/accounts/accounts.service";
import { formatToPercentage } from "@/utils/format.utils";
import type { InvestmentOverviewResponseDto } from "@investments/shared";
import { useQuery } from "@tanstack/react-query";

type PerfByAccountsChartProps = {
  perfByAccounts: InvestmentOverviewResponseDto["perfByAccount"] | undefined;
};

export const PerfByAccountsChart = ({
  perfByAccounts,
}: PerfByAccountsChartProps) => {
  const { data: accounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: getAccountsApi,
  });

  const accountsById = new Map(
    accounts?.map((account) => [account.id, account]) ?? [],
  );

  const chartData =
    perfByAccounts
      ?.filter((account) => !accountsById.get(account.id)?.isClosed)
      .map(({ id, value }) => {
        return {
          yAxis: accountsById.get(id)?.name || 0,
          xAxis: value,
        };
      }) ?? [];

  const tickFormatterXAxis = (value: string) =>
    formatToPercentage(Number(value));

  return (
    <CardContainer title="Performances annualisées par comptes">
      <CustomBarChart<CustomBarChartAxis>
        chartData={chartData}
        barLayout="vertical"
        tickFormatterXAxis={tickFormatterXAxis}
        unit="per"
        displayLabels={true}
      />
    </CardContainer>
  );
};
