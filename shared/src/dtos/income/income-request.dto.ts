import { IncomeType } from "../../types/income.type";

export interface IncomeRequestDto {
  amount: number;
  type: IncomeType;
  date: Date;
}
