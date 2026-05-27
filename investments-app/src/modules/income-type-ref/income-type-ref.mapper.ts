import { IncomeTypeRefResponseDto } from '@investments/shared';
import { IncomeTypeRef } from '@prisma/client';

export const mapIncomeTypeRefToDto = (
  incomeTypes: IncomeTypeRef[],
): IncomeTypeRefResponseDto[] =>
  incomeTypes.map((incomeType) => ({ ...incomeType }));
