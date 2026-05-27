import { Prisma } from '@prisma/client';

export const SELECT_ACCOUNT_WITH_TYPE =
  Prisma.validator<Prisma.AccountDefaultArgs>()({
    include: {
      type: true,
    },
  });
