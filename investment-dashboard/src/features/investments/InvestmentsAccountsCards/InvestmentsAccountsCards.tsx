import { CardContainer } from "@/components/custom/containers/CardContainer";
import { StatValue } from "@/components/custom/StatsValue/StatsValue";
import { getInvestmentsTotalGroupedByAccountMonthlyApi } from "@/services/investments/investments-total.service";
import { formatToEuro, formatToPercentage } from "@/utils/format.utils";
import {
  findLastItemByDate,
  type InvestmentColumnKey,
} from "@investments/shared";
import { useQuery } from "@tanstack/react-query";

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

  const formattedTotalAmount = formatToEuro(amount);
  const formattedAmountDiff = formatToEuro(amountDiff);
  const formattedPerformance = formatToPercentage(performance);
  const formattedCumulativePerformance = formatToPercentage(
    cumulativePerformance,
  );
  const formattedCapitalGain = formatToEuro(capitalGain);

  return (
    <div className="w-full grid grid-cols-5 gap-8">
      <CardContainer title="Total du portefeuille">
        <StatValue
          value={amount}
          formatted={formattedTotalAmount}
          style="text-xl"
        />
      </CardContainer>
      <CardContainer title="Plus value totale">
        <StatValue
          value={capitalGain}
          formatted={formattedCapitalGain}
          style="text-xl"
        />
      </CardContainer>
      <CardContainer title="Performance totale cumulée">
        <StatValue
          value={cumulativePerformance}
          formatted={formattedCumulativePerformance}
          style="text-xl"
        />
      </CardContainer>
      <CardContainer title="Performance du mois">
        <StatValue
          value={performance}
          formatted={formattedPerformance}
          style="text-xl"
        />
      </CardContainer>
      <CardContainer title="Total du mois">
        <StatValue
          value={amountDiff}
          formatted={formattedAmountDiff}
          style="text-xl"
        />
      </CardContainer>
    </div>
  );
};
