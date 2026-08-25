import { CardContainer } from "@/components/custom/containers/CardContainer";
import { StatValue } from "@/components/custom/StatsValue/StatsValue";
import {
  formatToEuro,
  formatToPercentage,
  formatToReadableDate,
} from "@/utils/format.utils";
import { type InvestmentOverviewResponseDto } from "@investments/shared";
import chartImg from "@/assets/img/chart_v2.png";
import { SummaryCard } from "@/components/custom/SummaryCard/SummaryCard";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getInvestmentsOverviewApi } from "@/services/investments/investments.service";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

type InvestmentsOverviewCardsProps = {
  investmentsOverview: InvestmentOverviewResponseDto | undefined;
};

export const InvestmentsOverviewCards = ({
  investmentsOverview,
}: InvestmentsOverviewCardsProps) => {
  const [showPreviousMonth, setShowPreviousMonth] = useState(false);
  const { data: previousMonthOverview } = useQuery({
    queryKey: [
      "investmentsOverview",
      showPreviousMonth ? "previous-month" : "current",
    ],
    queryFn: () => getInvestmentsOverviewApi(true),
    enabled: showPreviousMonth,
    staleTime: 0,
    refetchOnMount: true,
  });
  const overview = showPreviousMonth
    ? previousMonthOverview
    : investmentsOverview;

  const totalAmount = overview?.totalAmount || 0;
  const totalCapitalGain = overview?.totalCapitalGain || 0;
  const totalPerf = overview?.totalPerf || 0;
  const totalMonthAvg = overview?.totalMonthAvg || 0;
  const avgYearlyPerf = overview?.avgYearlyPerf || 0;
  const currentYearCapitalGain = overview?.currentYearCapitalGain || 0;
  const currentYearPerf = overview?.currentYearPerf || 0;
  const worstMonthPerf = overview?.worstMonth?.perf || 0;
  const bestMonthPerf = overview?.bestMonth?.perf || 0;
  const worstMonthAmount = overview?.worstMonth?.amount || 0;
  const bestMonthAmount = overview?.bestMonth?.amount || 0;
  const worstMonthDate = overview?.worstMonth?.date
    ? new Date(overview.worstMonth.date)
    : new Date();
  const bestMonthDate = overview?.bestMonth?.date
    ? new Date(overview.bestMonth.date)
    : new Date();

  const formattedTotalMonthAvg = formatToEuro(totalMonthAvg);
  const formattedAvgYearlyPerf = formatToPercentage(avgYearlyPerf);
  const formattedCurrentYearCapitalGain = formatToEuro(currentYearCapitalGain);
  const formattedCurrentYearPerf = formatToPercentage(currentYearPerf);
  const formattedWorstMonthPerf = formatToPercentage(worstMonthPerf);
  const formattedBestMonthPerf = formatToPercentage(bestMonthPerf);
  const formattedWorstMonthAmount = formatToEuro(worstMonthAmount);
  const formattedBestMonthAmount = formatToEuro(bestMonthAmount);

  const formattedWorstMonthDate = formatToReadableDate(
    worstMonthDate || new Date(),
  );

  const formattedBestMonthDate = formatToReadableDate(
    bestMonthDate || new Date(),
  );

  const cardContainerStyle = "justify-between lg:justify-evenly";

  return (
    <div className="flex flex-col gap-3 lg:gap-8">
      <Field orientation="horizontal" className="w-fit">
        <Label htmlFor="previous-month">Mois précédent</Label>
        <Switch
          id="previous-month"
          name="previous-month"
          checked={showPreviousMonth}
          onCheckedChange={(checked) => setShowPreviousMonth(checked === true)}
        />
      </Field>

      <div className="flex flex-col lg:flex-row items-center gap-3 lg:gap-8">
        <div className="w-full lg:w-1/2">
          <SummaryCard
            totalAmount={totalAmount}
            totalCapitalGain={totalCapitalGain}
            totalPerf={totalPerf}
            img={chartImg}
            cardStyle="lg:w-fit lg:m-auto"
            title="Valeur totale du portefeuille"
          />
        </div>

        <div className="w-full lg:w-1/2 grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-8">
          <CardContainer
            title="Moyenne annuelle des performances"
            cardStyle={cardContainerStyle}
          >
            <StatValue
              value={avgYearlyPerf}
              formatted={formattedAvgYearlyPerf}
              style="text-xl"
            />
          </CardContainer>
          <CardContainer
            title="Performance de l'année en cours"
            cardStyle={cardContainerStyle}
          >
            <StatValue
              value={currentYearPerf}
              formatted={formattedCurrentYearPerf}
              style="text-xl"
            />
          </CardContainer>
          <CardContainer
            title="Meilleure performance mensuelle"
            cardStyle={`${cardContainerStyle} order-5 lg:order-none`}
          >
            <div className="flex flex-col gap-4 items-center capitalize">
              {formattedBestMonthDate}
              <div className="flex flex-col gap-4 w-full">
                <StatValue
                  value={bestMonthPerf}
                  formatted={formattedBestMonthPerf}
                  style="text-xl"
                />
                <StatValue
                  value={bestMonthAmount}
                  formatted={formattedBestMonthAmount}
                  style="text-xl"
                />
              </div>
            </div>
          </CardContainer>
          <CardContainer
            title="Moyenne mensuelle des revenus"
            cardStyle={cardContainerStyle}
          >
            <StatValue
              value={totalMonthAvg}
              formatted={formattedTotalMonthAvg}
              style="text-xl"
            />
          </CardContainer>
          <CardContainer
            title="Gain de l'année en cours"
            cardStyle={cardContainerStyle}
          >
            <StatValue
              value={currentYearCapitalGain}
              formatted={formattedCurrentYearCapitalGain}
              style="text-xl"
            />
          </CardContainer>

          <CardContainer
            title="Pire performance mensuelle"
            cardStyle={cardContainerStyle}
          >
            <div className="flex flex-col gap-4 items-center capitalize">
              {formattedWorstMonthDate}
              <div className="flex flex-col gap-4 w-full">
                <StatValue
                  value={worstMonthPerf}
                  formatted={formattedWorstMonthPerf}
                  style="text-xl"
                />
                <StatValue
                  value={worstMonthAmount}
                  formatted={formattedWorstMonthAmount}
                  style="text-xl"
                />
              </div>
            </div>
          </CardContainer>
        </div>
      </div>
    </div>
  );
};
