import type { InvestmentCategory } from "../../types/investments.type";
export interface UpdateAccountRequestDto {
  name: string;
  type: string;
  category: InvestmentCategory;
  isClosed: boolean;
  openingDate?: string | null;
}
