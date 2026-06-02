import { Prisma } from '@prisma/client';

export const SELECT_ACCOUNT_WITH_TYPE =
  Prisma.validator<Prisma.AccountDefaultArgs>()({
    select: {
      id: true,
      name: true,
      category: true,
      isClosed: true,
      type: true,
    },
  });
