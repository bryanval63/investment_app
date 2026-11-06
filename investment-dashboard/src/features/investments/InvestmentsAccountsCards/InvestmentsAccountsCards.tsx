import { KpiTile, KpiValue } from "@/components/custom/summary/KpiTile";
import { SummaryHero } from "@/components/custom/summary/SummaryHero";
import { SummarySection } from "@/components/custom/summary/SummarySection";
import {
  getInvestmentsTotalGroupedByAccountMonthlyApi,
  getInvestmentsTotalGroupedByAccountYearlyApi,
} from "@/services/investments/investments-total.service";
import { formatToEuro, formatToPercentage } from "@/utils/format.utils";
import { getColorAndBgColor } from "@/utils/style.utils";
import {
  findLastItemByDate,
  getCurrentYear,
  type InvestmentColumnKey,
} from "@investments/shared";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CalendarDays, CalendarRange, Coins } from "lucide-react";
import { useInvestmentsTotalChartAccount } from "../charts/accounts/useInvestmentsTotalChartAccount";

type InvestmentsAccountsCardsProps = {
  type: InvestmentColumnKey;
  accountId: number;
};

const textColor = (value: number) => getColorAndBgColor(value, false);

export const InvestmentsAccountsCards = ({
  type,
  accountId,
}: InvestmentsAccountsCardsProps) => {
  const { data: latestInvestment } = useSuspenseQuery({
    queryKey: ["investmentsTotalGroupedByAccountMonthly", type, accountId],
    queryFn: () => getInvestmentsTotalGroupedByAccountMonthlyApi(type),
    select: (data) =>
      findLastItemByDate(
        data.filter((investment) => investment.accountId === accountId),
      ),
  });
  const { data: currentYearInvestment } = useSuspenseQuery({
    queryKey: ["investmentsTotalGroupedByAccountYearly", accountId],
    queryFn: getInvestmentsTotalGroupedByAccountYearlyApi,
    select: (data) =>
      data.find(
        (investment) =>
          investment.accountId === accountId &&
          Number(investment.year) === getCurrentYear(),
      ),
  });
  // Même queryKey que le graphique « Total » de la page : pas de requête en plus.
  const { chartData } = useInvestmentsTotalChartAccount({
    accountId,
    type,
    chartType: "sum",
  });

  const amount = latestInvestment?.amount || 0;
  const amountDiff = latestInvestment?.amountDiff || 0;
  const performance = latestInvestment?.performance || 0;
  const cumulativePerformance = latestInvestment?.cumulativePerformance || 0;
  const capitalGain = latestInvestment?.capitalGain || 0;
  const netAmount = latestInvestment?.netAmount ?? amount;
  const currentYearPerformance = currentYearInvestment?.performance || 0;

  return (
    <SummarySection
      hero={
        <SummaryHero
          title="Valeur totale du compte"
          amount={amount}
          capitalGain={capitalGain}
          perf={cumulativePerformance}
          secondaryAmount={netAmount}
          chartData={chartData}
        />
      }
    >
      <KpiTile icon={CalendarDays} label="Performance du mois">
        <KpiValue
          formatted={formatToPercentage(performance)}
          colorClass={textColor(performance)}
        />
      </KpiTile>

      <KpiTile icon={CalendarRange} label="Année en cours">
        <KpiValue
          formatted={formatToPercentage(currentYearPerformance)}
          colorClass={textColor(currentYearPerformance)}
        />
      </KpiTile>

      <KpiTile icon={Coins} label="Variation du mois" className="col-span-2">
        <KpiValue
          formatted={formatToEuro(amountDiff, { signDisplay: "always" })}
          colorClass={textColor(amountDiff)}
        />
      </KpiTile>
    </SummarySection>
  );
};
