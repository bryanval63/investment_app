import { IncomeResponseDto } from '@investments/shared';
import { IncomeWithType } from './income.type';

export const mapIncomeToDto = ({ type, amount, date, id }: IncomeWithType) => {
  return {
    id,
    amount: amount.toNumber(),
    date,
    type: {
      code: type.code,
      label: type.label,
    },
  };
};

export const mapIncomesArrayToDto = (
  incomes: IncomeWithType[],
): IncomeResponseDto[] => incomes.map((income) => mapIncomeToDto(income));
