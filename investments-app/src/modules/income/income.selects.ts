import { Prisma } from '@prisma/client';

export const SELECT_INCOME_WITH_TYPE =
  Prisma.validator<Prisma.IncomeDefaultArgs>()({
    include: {
      type: {
        select: {
          code: true,
          label: true,
        },
      },
    },
  });
