import { Prisma } from '@prisma/client';
import { SELECT_ACCOUNT_WITH_TYPE } from './account.select';

export type AccountWithType = Prisma.AccountGetPayload<
  typeof SELECT_ACCOUNT_WITH_TYPE
>;
