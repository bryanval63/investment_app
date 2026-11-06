import { Prisma } from '@prisma/client';

export type InvestmentListFilters = {
  accountId?: number;
  year?: number;
};

/** Convertit un paramètre de requête en entier ; `undefined` s'il est absent ou invalide. */
export function parseOptionalInt(value?: string): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : undefined;
}

/** Filtre Prisma de la liste des investissements (compte et/ou année civile). */
export function buildInvestmentListWhere({
  accountId,
  year,
}: InvestmentListFilters): Prisma.InvestmentWhereInput {
  return {
    ...(accountId !== undefined && { accountId }),
    ...(year !== undefined && {
      date: {
        gte: new Date(Date.UTC(year, 0, 1)),
        lt: new Date(Date.UTC(year + 1, 0, 1)),
      },
    }),
  };
}
