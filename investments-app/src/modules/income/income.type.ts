import { Prisma } from '@prisma/client';
import { SELECT_INCOME_WITH_TYPE } from './income.selects';
import { IncomeUnit } from '@investments/shared';

export type IncomeWithType = Prisma.IncomeGetPayload<
  typeof SELECT_INCOME_WITH_TYPE
>;

export type IncomeExcludingType = Exclude<IncomeUnit, 'type'>;
