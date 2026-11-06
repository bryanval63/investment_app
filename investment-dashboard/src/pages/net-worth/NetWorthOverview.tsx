import { CustomAreaChart } from "@/components/custom/charts/CustomAreaChart/CustomAreaChart";
import { CustomBarChart } from "@/components/custom/charts/CustomBarChart/CustomBarChart";
import { Button } from "@/components/ui/button";
import { CardContainer } from "@/components/custom/containers/CardContainer";
import { MainContainer } from "@/components/custom/containers/MainContainer";
import { KpiTile, KpiValue } from "@/components/custom/summary/KpiTile";
import { SummaryHero } from "@/components/custom/summary/SummaryHero";
import { SummarySection } from "@/components/custom/summary/SummarySection";
import { getNetWorthesApi } from "@/services/net-worthes/net-worthes.service";
import { getInvestmentsOverviewApi } from "@/services/investments/investments.service";
import {
  formatToEuro,
  formatToPercentage,
  formatToReadableDate,
  formatToThousandsEuro,
} from "@/utils/format.utils";
import {
  findLastItemByDate,
  findSecondLastItemByDate,
  getCurrentYear,
  type NetWorthResponseDto,
  type InvestmentOverviewResponseDto,
} from "@investments/shared";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getColorAndBgColor } from "@/utils/style.utils";
import {
  CalendarDays,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Receipt,
  Trophy,
} from "lucide-react";
import { useState } from "react";

type NetWorthYearlyGain = {
  xAxis: number;
  yAxis: number;
};

const NET_WORTH_GAINS_PER_PAGE = 10;

const textColor = (value: number) => getColorAndBgColor(value, false);

export const NetWorthOverview = () => {
  const [yearOffset, setYearOffset] = useState(0);
  const { data: netWorthes } = useSuspenseQuery<NetWorthResponseDto[]>({
    queryKey: ["net-worthes"],
    queryFn: () => getNetWorthesApi(),
  });
  const { data: investmentsOverview } =
    useSuspenseQuery<InvestmentOverviewResponseDto>({
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

  const taxDifference =
    (investmentsOverview?.totalAmount ?? 0) -
    (investmentsOverview?.totalNetAmount ?? 0);
  const netInvestedCapital = lastNetWorth - taxDifference;
  const currentYear = getCurrentYear();
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
  const bestYear = netWorthGainsByYear.reduce<NetWorthYearlyGain | undefined>(
    (best, gain) => (!best || gain.yAxis > best.yAxis ? gain : best),
    undefined,
  );
  const maxYearOffset = Math.max(
    0,
    netWorthGainsByYear.length - NET_WORTH_GAINS_PER_PAGE,
  );
  const activeYearOffset = Math.min(yearOffset, maxYearOffset);
  const visibleYearsStart = Math.max(
    0,
    netWorthGainsByYear.length - NET_WORTH_GAINS_PER_PAGE - activeYearOffset,
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
      <SummarySection
        className="col-span-3"
        hero={
          <SummaryHero
            title="Patrimoine financier total"
            amount={lastNetWorth}
            capitalGain={difference}
            perf={performance}
            secondaryLabel="Capital investi net après impôts"
            secondaryAmount={netInvestedCapital}
            chartData={chartData}
          />
        }
      >
        <KpiTile icon={CalendarDays} label="Gain du mois">
          <KpiValue
            formatted={formatToEuro(difference, { signDisplay: "always" })}
            colorClass={textColor(difference)}
          />
          <KpiValue
            size="md"
            formatted={formatToPercentage(performance)}
            colorClass="text-muted-foreground"
          />
        </KpiTile>
        <KpiTile icon={CalendarRange} label="Depuis le début de l'année">
          <KpiValue
            formatted={formatToEuro(currentYearCapitalGain, {
              signDisplay: "always",
            })}
            colorClass={textColor(currentYearCapitalGain)}
          />
        </KpiTile>
        <KpiTile icon={Receipt} label="Impôts et frais">
          <KpiValue formatted={formatToEuro(taxDifference)} />
        </KpiTile>
        <KpiTile icon={Trophy} label="Meilleure année">
          {bestYear ? (
            <>
              <KpiValue
                formatted={formatToEuro(bestYear.yAxis, {
                  signDisplay: "always",
                })}
                colorClass={textColor(bestYear.yAxis)}
              />
              <KpiValue
                size="md"
                formatted={String(bestYear.xAxis)}
                colorClass="text-muted-foreground"
              />
            </>
          ) : (
            <KpiValue formatted="—" colorClass="text-muted-foreground" />
          )}
        </KpiTile>
      </SummarySection>

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
              labelFormatter={formatToThousandsEuro}
              isAnimationActive={false}
            />
          </div>
        </CardContainer>
      </div>
    </MainContainer>
  );
};
