import { Prisma } from '@prisma/client';

export const investmentListItemSelect =
  Prisma.validator<Prisma.InvestmentSelect>()({
    id: true,
    accountId: true,
    account: { select: { id: true, name: true } },
    totalAmount: true,
    capitalGain: true,
    transactionAmount: true,
    date: true,
  });

export type InvestmentListItem = Prisma.InvestmentGetPayload<{
  select: typeof investmentListItemSelect;
}>;
