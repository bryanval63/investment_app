import { CustomAreaChart } from "@/components/custom/charts/CustomAreaChart/CustomAreaChart";
import { CardContainer } from "@/components/custom/containers/CardContainer";
import { MainContainer } from "@/components/custom/containers/MainContainer";
import { StatValue } from "@/components/custom/StatsValue/StatsValue";
import { getNetWorthesApi } from "@/services/net-worthes/net-worthes.service";
import { getInvestmentsOverviewApi } from "@/services/investments/investments.service";
import {
  formatToEuro,
  formatToPercentage,
  formatToReadableDate,
} from "@/utils/format.utils";
import {
  findLastItemByDate,
  findSecondLastItemByDate,
  type NetWorthResponseDto,
  type InvestmentOverviewResponseDto,
} from "@investments/shared";
import { useQuery } from "@tanstack/react-query";

export const NetWorthOverview = () => {
  const { data: netWorthes } = useQuery<NetWorthResponseDto[]>({
    queryKey: ["net-worthes"],
    queryFn: () => getNetWorthesApi(),
  });
  const { data: investmentsOverview } =
    useQuery<InvestmentOverviewResponseDto>({
    queryKey: ["investmentsOverview"],
    queryFn: () => getInvestmentsOverviewApi(),
  });

  const lastNetWorth = netWorthes
    ? findLastItemByDate(netWorthes)?.amount || 0
    : 0;
  const secondLastNetWorth =
    netWorthes && netWorthes.length >= 2
      ? findSecondLastItemByDate(netWorthes)?.amount || 0
      : 0;
  const difference = lastNetWorth - secondLastNetWorth;
  const performance =
    secondLastNetWorth !== 0 ? difference / secondLastNetWorth : 0;

  const formattedDifference = formatToEuro(difference);
  const formattedLastNetWorth = formatToEuro(lastNetWorth);
  const taxDifference =
    (investmentsOverview?.totalAmount ?? 0) -
    (investmentsOverview?.totalNetAmount ?? 0);
  const netInvestedCapital = lastNetWorth - taxDifference;
  const formattedNetInvestedCapital = formatToEuro(netInvestedCapital);
  const formattedTaxesAndFees = formatToEuro(taxDifference);
  const formattedPerformance = formatToPercentage(performance);

  const chartData =
    netWorthes?.map(({ amount, date }) => {
      return {
        xAxis: formatToReadableDate(new Date(date), {
          month: "short",
          year: "numeric",
        }),
        yAxis: amount,
      };
    }) ?? [];

  return (
    <MainContainer columns={3}>
      <CardContainer
        title="Synthèse du patrimoine financier"
        cardStyle="w-full col-span-3"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-2">
            <span className="text-sm text-slate-500">
              Patrimoine financier total
            </span>
            <StatValue
              value={lastNetWorth}
              formatted={formattedLastNetWorth}
              style="text-2xl"
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm text-slate-500">
              Capital investi net après impôts
            </span>
            <StatValue
              value={netInvestedCapital}
              formatted={formattedNetInvestedCapital}
              style="text-2xl"
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm text-slate-500">
              Total des impôts et frais
            </span>
            <StatValue
              value={taxDifference}
              formatted={formattedTaxesAndFees}
              style="text-2xl"
            />
          </div>
        </div>
      </CardContainer>
      <CardContainer title="Gain par rapport au mois précédent">
        <StatValue
          value={difference}
          formatted={formattedDifference}
          style="text-xl"
        />
      </CardContainer>
      <CardContainer title="Performance par rapport au mois précédent">
        <StatValue
          value={performance}
          formatted={formattedPerformance}
          style="text-xl"
        />
      </CardContainer>
      <div className="col-span-3">
        <CardContainer title="Evolution du patrimoine financier">
          <CustomAreaChart chartData={chartData} />
        </CardContainer>
      </div>
    </MainContainer>
  );
};
