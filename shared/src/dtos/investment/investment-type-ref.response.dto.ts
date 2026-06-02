import { InvestmentType } from ".prisma/client";

export interface InvestmentTypeRefResponseDto {
  id: number;
  code: InvestmentType;
  label: string;
}
