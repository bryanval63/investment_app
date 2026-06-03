import type { IncomeType } from "../../types/income.type";

export interface IncomeTypeRefResponseDto {
  id: number;
  code: keyof typeof IncomeType;
  label: string;
}
