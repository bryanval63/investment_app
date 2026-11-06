import type { IncomeTypeCode } from "../../types/income.type";

export interface IncomeRequestDto {
  amount: number;
  type: IncomeTypeCode;
  date: Date;
}
