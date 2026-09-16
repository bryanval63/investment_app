import { InvestmentCategoryRef } from '@prisma/client';
import { InvestmentCategoryRefResponseDto } from '@investments/shared';

export const mapInvestmentCategoryRefToDto = (
  categories: InvestmentCategoryRef[],
): InvestmentCategoryRefResponseDto[] =>
  categories.map((category) => ({ ...category }));
