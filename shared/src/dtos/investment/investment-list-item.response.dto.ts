export interface InvestmentListItemResponseDto {
  id: number;
  accountId: number;
  account: {
    id: number;
    name: string;
  };
  totalAmount: number;
  capitalGain: number;
  transactionAmount: number;
  date: string;
}
