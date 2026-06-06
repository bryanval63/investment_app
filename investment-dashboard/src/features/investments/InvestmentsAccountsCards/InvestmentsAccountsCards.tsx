import { CardContainer } from "@/components/custom/containers/CardContainer";
import { StatValue } from "@/components/custom/StatsValue/StatsValue";
import { SummaryCard } from "@/components/custom/SummaryCard/SummaryCard";
import { getInvestmentsTotalGroupedByAccountMonthlyApi } from "@/services/investments/investments-total.service";
import { formatToEuro, formatToPercentage } from "@/utils/format.utils";
import {
  findLastItemByDate,
  type InvestmentColumnKey,
} from "@investments/shared";
import { useQuery } from "@tanstack/react-query";
import chartImg from "@/assets/img/chart_v2.png";

type InvestmentsAccountsCardsProps = {
  type: InvestmentColumnKey;
  accountId: number;
};

export const InvestmentsAccountsCards = ({
  type,
  accountId,
}: InvestmentsAccountsCardsProps) => {
  const { data: latestInvestment } = useQuery({
    queryKey: ["investmentsTotalGroupedByAccountYearly", type, accountId],
    queryFn: () => getInvestmentsTotalGroupedByAccountMonthlyApi(type),
    select: (data) =>
      findLastItemByDate(
        data.filter((investment) => investment.accountId === accountId),
      ),
  });

  const amount = latestInvestment?.amount || 0;
  const amountDiff = latestInvestment?.amountDiff || 0;
  const performance = latestInvestment?.performance || 0;
  const cumulativePerformance = latestInvestment?.cumulativePerformance || 0;
  const capitalGain = latestInvestment?.capitalGain || 0;

  const formattedAmountDiff = formatToEuro(amountDiff);
  const formattedPerformance = formatToPercentage(performance);

  return (
    <div className="flex flex-col lg:flex-row gap-3 lg:gap-8 lg:justify-center lg:items-center">
      <SummaryCard
        totalAmount={amount}
        totalCapitalGain={capitalGain}
        totalPerf={cumulativePerformance}
        img={chartImg}
        title="Valeur totale du compte"
      />

      <div className="flex flex-col lg:flex-row gap-3 lg:gap-8">
        <CardContainer title="Performance du mois">
          <div className="flex flex-col flex-wrap">
            <StatValue
              value={performance}
              formatted={formattedPerformance}
              style="text-xl"
            />
          </div>
        </CardContainer>
        <CardContainer title="Montant total du mois">
          <StatValue
            value={amountDiff}
            formatted={formattedAmountDiff}
            style="text-xl"
          />
        </CardContainer>
      </div>
    </div>
  );
};

