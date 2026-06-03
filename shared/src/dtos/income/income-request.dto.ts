import type { IncomeType } from "../../types/income.type";

export interface IncomeRequestDto {
  amount: number;
  type: keyof typeof IncomeType;
  date: Date;
}
