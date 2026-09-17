import type { InvestmentCategory } from "../../types/investments.type";
export interface AccountResponseDto {
  id: number;
  category: InvestmentCategory;
  name: string;
  type: string;
  isClosed: boolean;
  openingDate: string | null;
}
