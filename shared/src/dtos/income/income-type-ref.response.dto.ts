import type { IncomeTypeCode } from "../../types/income.type";

export interface IncomeTypeRefResponseDto {
  id: number;
  code: IncomeTypeCode;
  label: string;
}
