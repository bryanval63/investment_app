import { InvestmentCategory } from "@investments/shared/types/investments.type";
import { InvestmentType } from ".prisma/client";

export interface AccountResponseDto {
  id: number;
  category: InvestmentCategory;
  name: string;
  type: InvestmentType;
  isClosed: boolean;
}
