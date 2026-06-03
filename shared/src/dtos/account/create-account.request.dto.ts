import type { InvestmentCategory } from "../../types/investments.type";
import type { InvestmentType } from ".prisma/client";

export interface CreateAccountRequestDto {
  name: string;
  type: InvestmentType;
  category: InvestmentCategory;
}
