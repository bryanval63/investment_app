import { InvestmentTypeRefResponseDto } from '@investments/shared';
import { InvestmentTypeRef } from '@prisma/client';

export const mapInvestmentTypeRefToDto = (
  investmentTypes: InvestmentTypeRef[],
): InvestmentTypeRefResponseDto[] =>
  investmentTypes.map((investmentType) => ({ ...investmentType }));
