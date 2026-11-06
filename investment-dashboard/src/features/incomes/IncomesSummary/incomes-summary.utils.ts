import type { IncomeGroupByDateResponseDto } from "@investments/shared";

export type IncomesSummaryData = {
  currentYear: number;
  /** Revenus de l'année en cours (depuis janvier). */
  yearToDate: number;
  /** Moyenne mensuelle de l'année en cours, sur les mois écoulés jusqu'au dernier saisi. */
  yearToDateMonthlyAverage?: number;
  /** Revenus de l'année précédente sur les mêmes mois. */
  previousYearToDate?: number;
  /** Moyenne mensuelle de la dernière année complète. */
  lastYearMonthlyAverage?: { year: number; amount: number };
  /** Moyenne annuelle sur les années complètes (hors année en cours). */
  annualAverage?: { amount: number; yearsCount: number };
  bestYear?: { year: number; amount: number };
  total: number;
  firstYear?: number;
};

const toPoint = ({ date, amount }: IncomeGroupByDateResponseDto) => {
  const parsed = new Date(date);
  return { year: parsed.getFullYear(), month: parsed.getMonth(), amount };
};

const sum = (values: number[]) =>
  values.reduce((acc, value) => acc + value, 0);

/**
 * Indicateurs du résumé des revenus à partir des totaux par année et par mois
 * (impôts inclus ou non selon la requête).
 */
export const computeIncomesSummary = (
  yearly: IncomeGroupByDateResponseDto[],
  monthly: IncomeGroupByDateResponseDto[],
  today: Date = new Date(),
): IncomesSummaryData => {
  const currentYear = today.getFullYear();
  const years = yearly.map(toPoint).sort((a, b) => a.year - b.year);
  const months = monthly.map(toPoint);

  const currentYearMonths = months.filter(({ year }) => year === currentYear);
  const yearToDate = sum(currentYearMonths.map(({ amount }) => amount));
  const lastMonth = Math.max(
    -1,
    ...currentYearMonths.map(({ month }) => month),
  );

  const previousYearMonths = months.filter(
    ({ year }) => year === currentYear - 1,
  );
  const previousYearToDate =
    previousYearMonths.length > 0 && lastMonth >= 0
      ? sum(
          previousYearMonths
            .filter(({ month }) => month <= lastMonth)
            .map(({ amount }) => amount),
        )
      : undefined;

  // L'année en cours est incomplète : exclue des moyennes.
  const completeYears = years.filter(({ year }) => year < currentYear);
  const lastCompleteYear = completeYears.at(-1);

  const bestYear = years.reduce<IncomesSummaryData["bestYear"]>(
    (best, { year, amount }) =>
      !best || amount > best.amount ? { year, amount } : best,
    undefined,
  );

  return {
    currentYear,
    yearToDate,
    yearToDateMonthlyAverage:
      lastMonth >= 0 ? yearToDate / (lastMonth + 1) : undefined,
    previousYearToDate,
    lastYearMonthlyAverage: lastCompleteYear && {
      year: lastCompleteYear.year,
      amount: lastCompleteYear.amount / 12,
    },
    annualAverage:
      completeYears.length > 0
        ? {
            amount:
              sum(completeYears.map(({ amount }) => amount)) /
              completeYears.length,
            yearsCount: completeYears.length,
          }
        : undefined,
    bestYear,
    total: sum(years.map(({ amount }) => amount)),
    firstYear: years[0]?.year,
  };
};
