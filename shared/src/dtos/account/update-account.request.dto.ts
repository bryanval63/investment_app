import type { InvestmentCategory } from "../../types/investments.type";
import type { InvestmentType } from ".prisma/client";

export interface UpdateAccountRequestDto {
  name: string;
  type: InvestmentType;
  category: InvestmentCategory;
  isClosed: boolean;
}
