import { CustomAreaChart } from "@/components/custom/charts/CustomAreaChart/CustomAreaChart";
import { CustomBarChart } from "@/components/custom/charts/CustomBarChart/CustomBarChart";
import { Button } from "@/components/ui/button";
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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

type NetWorthYearlyGain = {
  xAxis: number;
  yAxis: number;
};

const NET_WORTH_GAINS_PER_PAGE = 10;

const formatGainInThousands = (amount: number) =>
  `${new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 1,
  }).format(amount / 1000)} k€`;

export const NetWorthOverview = () => {
  const [yearOffset, setYearOffset] = useState(0);
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
  const currentYear = new Date().getFullYear();
  const netWorthGainsByYear: NetWorthYearlyGain[] = [
    ...new Set(
      netWorthes?.map(({ date }) => new Date(date).getFullYear()) ?? [],
    ),
  ]
    .sort((a, b) => a - b)
    .flatMap((year) => {
      const currentYearNetWorthes =
        netWorthes?.filter(
          ({ date }) => new Date(date).getFullYear() === year,
        ) ?? [];
      const previousDecemberNetWorthes =
        netWorthes?.filter((netWorth) => {
          const date = new Date(netWorth.date);
          return date.getFullYear() === year - 1 && date.getMonth() === 11;
        }) ?? [];

      if (
        currentYearNetWorthes.length === 0 ||
        previousDecemberNetWorthes.length === 0
      ) {
        return [];
      }

      return [
        {
          xAxis: year,
          yAxis:
            findLastItemByDate(currentYearNetWorthes).amount -
            findLastItemByDate(previousDecemberNetWorthes).amount,
        },
      ];
    });
  const currentYearCapitalGain =
    netWorthGainsByYear.find(({ xAxis }) => xAxis === currentYear)?.yAxis ?? 0;
  const formattedCurrentYearCapitalGain = formatToEuro(currentYearCapitalGain);
  const maxYearOffset = Math.max(
    0,
    netWorthGainsByYear.length - NET_WORTH_GAINS_PER_PAGE,
  );
  const activeYearOffset = Math.min(yearOffset, maxYearOffset);
  const visibleYearsStart = Math.max(
    0,
    netWorthGainsByYear.length -
      NET_WORTH_GAINS_PER_PAGE -
      activeYearOffset,
  );
  const visibleNetWorthGains = netWorthGainsByYear.slice(
    visibleYearsStart,
    visibleYearsStart + NET_WORTH_GAINS_PER_PAGE,
  );

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
      <CardContainer title="Gain depuis le début de l'année">
        <StatValue
          value={currentYearCapitalGain}
          formatted={formattedCurrentYearCapitalGain}
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
      <div className="col-span-3">
        <CardContainer title="Gain du capital par année">
          <div className="flex flex-col gap-3">
            {maxYearOffset > 0 && (
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Afficher les années précédentes"
                  onClick={() =>
                    setYearOffset(Math.min(activeYearOffset + 1, maxYearOffset))
                  }
                  disabled={activeYearOffset >= maxYearOffset}
                >
                  <ChevronLeft />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Afficher les années suivantes"
                  onClick={() =>
                    setYearOffset(Math.max(activeYearOffset - 1, 0))
                  }
                  disabled={activeYearOffset === 0}
                >
                  <ChevronRight />
                </Button>
              </div>
            )}
            <CustomBarChart
              chartData={visibleNetWorthGains}
              displayLabels
              labelsLandscapeOnly
              labelFormatter={formatGainInThousands}
              isAnimationActive={false}
            />
          </div>
        </CardContainer>
      </div>
    </MainContainer>
  );
};
