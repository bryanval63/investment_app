import { InvestmentCategory } from "@investments/shared/types/investments.type";
import { InvestmentType } from ".prisma/client";

export interface CreateAccountRequestDto {
  name: string;
  type: InvestmentType;
  category: InvestmentCategory;
}
