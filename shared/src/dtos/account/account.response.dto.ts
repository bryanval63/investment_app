import type { InvestmentCategory } from "../../types/investments.type";
import type { InvestmentType } from ".prisma/client";

export interface AccountResponseDto {
  id: number;
  category: InvestmentCategory;
  name: string;
  type: InvestmentType;
  isClosed: boolean;
}
