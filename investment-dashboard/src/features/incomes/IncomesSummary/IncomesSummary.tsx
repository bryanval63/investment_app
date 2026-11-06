import { KpiTile, KpiValue } from "@/components/custom/summary/KpiTile";
import { SummaryHero } from "@/components/custom/summary/SummaryHero";
import { SummarySection } from "@/components/custom/summary/SummarySection";
import { getStatsGroupedByDateIncomesApi } from "@/services/incomes/incomes-stats.service";
import { formatToEuro, formatToReadableDate } from "@/utils/format.utils";
import { useSuspenseQueries } from "@tanstack/react-query";
import { CalendarDays, CalendarRange, Sigma, Trophy } from "lucide-react";
import { computeIncomesSummary } from "./incomes-summary.utils";

type IncomesSummaryProps = {
  hasTaxes: boolean;
  className?: string;
};

/** Nombre de mois affichés dans la courbe du bloc principal. */
const SPARKLINE_MONTHS = 24;

const plural = (count: number, word: string) =>
  `${count} ${word}${count > 1 ? "s" : ""}`;

const EmptyValue = () => (
  <KpiValue formatted="—" colorClass="text-muted-foreground" />
);

export const IncomesSummary = ({ hasTaxes, className }: IncomesSummaryProps) => {
  // Mêmes clés que les graphiques : les données sont partagées en cache.
  const [{ data: yearly }, { data: monthly }] = useSuspenseQueries({
    queries: [
      {
        queryKey: ["incomesGroupedByDate", "year", hasTaxes],
        queryFn: () => getStatsGroupedByDateIncomesApi("year", hasTaxes),
      },
      {
        queryKey: ["incomesGroupedByDate", "month", hasTaxes],
        queryFn: () => getStatsGroupedByDateIncomesApi("month", hasTaxes),
      },
    ],
  });

  const {
    currentYear,
    yearToDate,
    yearToDateMonthlyAverage,
    previousYearToDate,
    lastYearMonthlyAverage,
    annualAverage,
    bestYear,
    total,
    firstYear,
  } = computeIncomesSummary(yearly ?? [], monthly ?? []);

  const difference =
    previousYearToDate !== undefined
      ? yearToDate - previousYearToDate
      : undefined;
  const perf =
    difference !== undefined && previousYearToDate
      ? difference / Math.abs(previousYearToDate)
      : undefined;

  const chartData = (monthly ?? [])
    .slice(-SPARKLINE_MONTHS)
    .map(({ date, amount }) => ({
      xAxis: formatToReadableDate(new Date(date), {
        month: "short",
        year: "numeric",
      }),
      yAxis: amount,
    }));

  return (
    <SummarySection
      className={className}
      hero={
        <SummaryHero
          title={`Revenus ${currentYear} (depuis janvier)`}
          amount={yearToDate}
          capitalGain={difference}
          perf={perf}
          secondaryLabel={`Même période en ${currentYear - 1}`}
          secondaryAmount={previousYearToDate}
          chartData={chartData}
        />
      }
    >
      <KpiTile
        icon={CalendarDays}
        label={
          lastYearMonthlyAverage
            ? `Moyenne mensuelle ${lastYearMonthlyAverage.year}`
            : "Moyenne mensuelle"
        }
      >
        {lastYearMonthlyAverage ? (
          <KpiValue formatted={formatToEuro(lastYearMonthlyAverage.amount)} />
        ) : (
          <EmptyValue />
        )}
        {yearToDateMonthlyAverage !== undefined && (
          <KpiValue
            size="md"
            formatted={`${formatToEuro(yearToDateMonthlyAverage)} en ${currentYear}`}
            colorClass="text-muted-foreground"
          />
        )}
      </KpiTile>
      <KpiTile icon={CalendarRange} label="Moyenne annuelle">
        {annualAverage ? (
          <>
            <KpiValue formatted={formatToEuro(annualAverage.amount)} />
            <KpiValue
              size="md"
              formatted={`sur ${plural(annualAverage.yearsCount, "année")} complète${annualAverage.yearsCount > 1 ? "s" : ""}`}
              colorClass="text-muted-foreground"
            />
          </>
        ) : (
          <EmptyValue />
        )}
      </KpiTile>
      <KpiTile icon={Trophy} label="Meilleure année">
        {bestYear ? (
          <>
            <KpiValue formatted={formatToEuro(bestYear.amount)} />
            <KpiValue
              size="md"
              formatted={String(bestYear.year)}
              colorClass="text-muted-foreground"
            />
          </>
        ) : (
          <EmptyValue />
        )}
      </KpiTile>
      <KpiTile icon={Sigma} label="Revenus cumulés">
        <KpiValue formatted={formatToEuro(total)} />
        {firstYear !== undefined && (
          <KpiValue
            size="md"
            formatted={`depuis ${firstYear}`}
            colorClass="text-muted-foreground"
          />
        )}
      </KpiTile>
    </SummarySection>
  );
};
