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
        ...Object.fromEntries(MONTHS.map((m) => [m, 0])),
      };

      map.set(income.type.code, emptyRow);
    }

    map.get(income.type.code)![month] = income.amount;
  });

  return Array.from(map.values());
};
