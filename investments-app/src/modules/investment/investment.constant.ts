import { InvestmentColumnKey } from '@investments/shared';
import { Prisma } from '@prisma/client';

export const COLUMN_MAP: Record<InvestmentColumnKey, Prisma.Sql> = {
  totalAmount: Prisma.sql`i.totalAmount`,
  capitalGain: Prisma.sql`i.capitalGain`,
};
