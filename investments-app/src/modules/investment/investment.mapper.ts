import { InvestmentListItemResponseDto } from '@investments/shared';
import { InvestmentListItem } from './investment.select';

export const mapInvestmentListItemToDto = ({
  id,
  accountId,
  account,
  totalAmount,
  capitalGain,
  transactionAmount,
  date,
}: InvestmentListItem): InvestmentListItemResponseDto => ({
  id,
  accountId,
  account,
  totalAmount: totalAmount.toNumber(),
  capitalGain: capitalGain.toNumber(),
  transactionAmount: transactionAmount.toNumber(),
  date: date.toISOString(),
});
