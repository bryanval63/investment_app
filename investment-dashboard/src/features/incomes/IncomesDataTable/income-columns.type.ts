import type { Months } from "@investments/shared/types/date.type";

export type IncomeColumns = {
  type: string;
  amount: number;
  date: Date;
};

export type PivotIncome = {
  type: string;
} & Record<Months, number>;
