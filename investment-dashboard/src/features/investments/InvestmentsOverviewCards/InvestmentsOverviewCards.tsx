import {
  formatToEuro,
  formatToPercentage,
  formatToReadableDate,
} from "@/utils/format.utils";
import { getColorAndBgColor } from "@/utils/style.utils";
import { type InvestmentOverviewResponseDto } from "@investments/shared";
import { getInvestmentsOverviewApi } from "@/services/investments/investments.service";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  CalendarRange,
  Coins,
  Percent,
} from "lucide-react";
import { KpiTile, KpiValue } from "@/components/custom/summary/KpiTile";
import { SummaryHero } from "@/components/custom/summary/SummaryHero";
import { SummarySection } from "@/components/custom/summary/SummarySection";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useInvestmentsTotalChartCategory } from "../charts/categories/useInvestmentsTotalChartCategory";

type InvestmentsOverviewCardsProps = {
  investmentsOverview: InvestmentOverviewResponseDto | undefined;
};

const textColor = (value: number) => getColorAndBgColor(value, false);

type ExtremeMonthRowProps = {
  label: string;
  date: Date | undefined;
  perf: number;
  amount: number;
};

const ExtremeMonthRow = ({
  label,
  date,
  perf,
  amount,
}: ExtremeMonthRowProps) => {
  const Icon = perf >= 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="flex items-center gap-2">
      <Icon className={`size-4 shrink-0 ${textColor(perf)}`} />
      <div className="flex min-w-0 flex-col">
        <span className="text-xs text-muted-foreground">
          {label}
          {date && (
            <span className="capitalize"> · {formatToReadableDate(date)}</span>
          )}
        </span>
        <span className="flex flex-wrap items-baseline gap-x-2 text-sm font-semibold tabular-nums">
          <span className={textColor(perf)}>{formatToPercentage(perf)}</span>
          <span className="font-normal text-muted-foreground">
            {formatToEuro(amount, { signDisplay: "always" })}
          </span>
        </span>
      </div>
    </div>
  );
};

export const InvestmentsOverviewCards = ({
  investmentsOverview,
}: InvestmentsOverviewCardsProps) => {
  const [showPreviousMonth, setShowPreviousMonth] = useState(false);
  // Même queryKey que le graphique « Total des investissements » : pas de requête en plus.
  const { chartData } = useInvestmentsTotalChartCategory({
    category: "ALL",
    type: "totalAmount",
    chartType: "sum",
  });
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
  const totalNetAmount = overview?.totalNetAmount ?? totalAmount;
  const totalCapitalGain = overview?.totalCapitalGain || 0;
  const totalPerf = overview?.totalPerf || 0;
  const totalMonthAvg = overview?.totalMonthAvg || 0;
  const avgYearlyPerf = overview?.avgYearlyPerf || 0;
  const currentYearCapitalGain = overview?.currentYearCapitalGain || 0;
  const currentYearPerf = overview?.currentYearPerf || 0;
  const bestMonth = overview?.bestMonth;
  const worstMonth = overview?.worstMonth;

  return (
    <SummarySection
      hero={
        <SummaryHero
          title="Valeur totale du portefeuille"
          amount={totalAmount}
          capitalGain={totalCapitalGain}
          perf={totalPerf}
          secondaryAmount={totalNetAmount}
          chartData={chartData}
          headerAction={
            <div className="flex items-center gap-2">
              <Label
                htmlFor="previous-month"
                className="text-xs text-muted-foreground"
              >
                Mois précédent
              </Label>
              <Switch
                id="previous-month"
                name="previous-month"
                checked={showPreviousMonth}
                onCheckedChange={(checked) =>
                  setShowPreviousMonth(checked === true)
                }
              />
            </div>
          }
        />
      }
    >
      <KpiTile icon={Percent} label="Perf. annuelle moy.">
        <KpiValue
          formatted={formatToPercentage(avgYearlyPerf)}
          colorClass={textColor(avgYearlyPerf)}
        />
      </KpiTile>

      <KpiTile icon={CalendarDays} label="Année en cours">
        <KpiValue
          formatted={formatToPercentage(currentYearPerf)}
          colorClass={textColor(currentYearPerf)}
        />
        <KpiValue
          size="md"
          formatted={formatToEuro(currentYearCapitalGain, {
            signDisplay: "always",
          })}
          colorClass="text-muted-foreground"
        />
      </KpiTile>

      <KpiTile icon={Coins} label="Revenus / mois">
        <KpiValue
          formatted={formatToEuro(totalMonthAvg)}
          colorClass={textColor(totalMonthAvg)}
        />
      </KpiTile>

      <KpiTile icon={CalendarRange} label="Mois extrêmes">
        <div className="flex flex-col gap-2">
          <ExtremeMonthRow
            label="Meilleur"
            date={bestMonth?.date ? new Date(bestMonth.date) : undefined}
            perf={bestMonth?.perf || 0}
            amount={bestMonth?.amount || 0}
          />
          <ExtremeMonthRow
            label="Pire"
            date={worstMonth?.date ? new Date(worstMonth.date) : undefined}
            perf={worstMonth?.perf || 0}
            amount={worstMonth?.amount || 0}
          />
        </div>
      </KpiTile>
    </SummarySection>
  );
};
