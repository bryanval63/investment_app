import { MONTHS } from "@investments/shared/constants/date.constant";
import type { PivotIncome } from "./income-columns.type";
import type { IncomeResponseDto } from "@investments/shared";

export const pivotIncomes = (incomes: IncomeResponseDto[]): PivotIncome[] => {
  const map = new Map<string, PivotIncome>();

  incomes.forEach((income) => {
    const monthIndex = new Date(income.date).getMonth();
    const month = MONTHS[monthIndex].code;

    if (!map.has(income.type.code)) {
      const emptyRow: PivotIncome = {
        type: income.type.label,
        ...(Object.fromEntries(MONTHS.map((m) => [m.code, 0])) as Record<
          (typeof MONTHS)[number]["code"],
          number
        >),
      };

      map.set(income.type.code, emptyRow);
    }

    // Plusieurs saisies d'un même type sur un mois s'additionnent, comme dans
    // les statistiques de l'API.
    map.get(income.type.code)![month] += income.amount;
  });

  return Array.from(map.values());
};
