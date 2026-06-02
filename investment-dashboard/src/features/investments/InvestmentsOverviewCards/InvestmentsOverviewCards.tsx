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

type InvestmentsOverviewCardsProps = {
  investmentsOverview: InvestmentOverviewResponseDto | undefined;
};

export const InvestmentsOverviewCards = ({
  investmentsOverview,
}: InvestmentsOverviewCardsProps) => {
  const totalAmount = investmentsOverview?.totalAmount || 0;
  const totalCapitalGain = investmentsOverview?.totalCapitalGain || 0;
  const totalPerf = investmentsOverview?.totalPerf || 0;
  const totalMonthAvg = investmentsOverview?.totalMonthAvg || 0;
  const avgYearlyPerf = investmentsOverview?.avgYearlyPerf || 0;
  const currentYearCapitalGain =
    investmentsOverview?.currentYearCapitalGain || 0;
  const currentYearPerf = investmentsOverview?.currentYearPerf || 0;
  const worstMonthPerf = investmentsOverview?.worstMonth.perf || 0;
  const bestMonthPerf = investmentsOverview?.bestMonth.perf || 0;
  const worstMonthAmount = investmentsOverview?.worstMonth.amount || 0;
  const bestMonthAmount = investmentsOverview?.bestMonth.amount || 0;
  const worstMonthDate = investmentsOverview?.worstMonth.date
    ? new Date(investmentsOverview?.worstMonth.date)
    : new Date();
  const bestMonthDate = investmentsOverview?.bestMonth.date
    ? new Date(investmentsOverview?.bestMonth.date)
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

  return (
    <div className="flex items-center gap-8">
      <div className="w-1/2">
        <SummaryCard
          totalAmount={totalAmount}
          totalCapitalGain={totalCapitalGain}
          totalPerf={totalPerf}
          img={chartImg}
          cardStyle="w-fit m-auto "
          title="Valeur totale du portefeuille"
        />
      </div>

      <div className="w-1/2 grid grid-cols-3 gap-8">
        <CardContainer
          title="Moyenne annuelle des performances"
          cardStyle="justify-evenly "
        >
          <StatValue
            value={avgYearlyPerf}
            formatted={formattedAvgYearlyPerf}
            style="text-xl"
          />
        </CardContainer>
        <CardContainer
          title="Performance de l'année en cours"
          cardStyle="justify-evenly"
        >
          <StatValue
            value={currentYearPerf}
            formatted={formattedCurrentYearPerf}
            style="text-xl"
          />
        </CardContainer>
        <CardContainer
          title="Meilleure performance mensuelle"
          cardStyle="justify-evenly"
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
          cardStyle="justify-evenly"
        >
          <StatValue
            value={totalMonthAvg}
            formatted={formattedTotalMonthAvg}
            style="text-xl"
          />
        </CardContainer>
        <CardContainer
          title="Gain de l'année en cours"
          cardStyle="justify-evenly"
        >
          <StatValue
            value={currentYearCapitalGain}
            formatted={formattedCurrentYearCapitalGain}
            style="text-xl"
          />
        </CardContainer>

        <CardContainer
          title="Pire performance mensuelle"
          cardStyle="justify-evenly"
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
  );
};
