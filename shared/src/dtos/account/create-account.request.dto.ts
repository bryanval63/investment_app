import type { InvestmentCategory } from "../../types/investments.type";
export interface CreateAccountRequestDto {
  name: string;
  type: string;
  category: InvestmentCategory;
}
