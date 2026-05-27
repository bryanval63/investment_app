import { CustomAreaChart } from "@/components/custom/charts/CustomAreaChart/CustomAreaChart";
import { CardContainer } from "@/components/custom/containers/CardContainer";
import { MainContainer } from "@/components/custom/containers/MainContainer";
import { StatValue } from "@/components/custom/StatsValue/StatsValue";
import { getNetWorthesApi } from "@/services/net-worthes/net-worthes.service";
import {
  formatToEuro,
  formatToPercentage,
  formatToReadableDate,
} from "@/utils/format.utils";
import {
  findLastItemByDate,
  findSecondLastItemByDate,
  type NetWorthResponseDto,
} from "@investments/shared";
import { useQuery } from "@tanstack/react-query";

export const NetWorthOverview = () => {
  const { data: netWorthes } = useQuery<NetWorthResponseDto[]>({
    queryKey: ["net-worthes"],
    queryFn: () => getNetWorthesApi(),
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
      <CardContainer title="Patrimoine financier total">
        <StatValue
          value={lastNetWorth}
          formatted={formattedLastNetWorth}
          style="text-xl"
        />
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
