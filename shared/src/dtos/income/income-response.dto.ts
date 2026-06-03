import type { IncomeType } from "../../types/income.type";

type IncomeTypeWithLabel = {
  code: IncomeType;
  label: string;
};

export interface IncomeResponseDto {
  id: number;
  type: IncomeTypeWithLabel;
  amount: number;
  date: Date;
}

export interface IncomeGroupByDateResponseDto {
  date: string;
  amount: number;
}

export interface IncomeGroupByTypeResponseDto extends IncomeTypeWithLabel {
  amount: number;
}
