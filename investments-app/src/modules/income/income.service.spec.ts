import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { IncomeTypeRefService } from '../income-type-ref/income-type-ref.service';
import { TaxService } from '../tax/tax.service';
import { IncomeService } from './income.service';

const createPrismaMock = () => ({
  income: {
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  incomeTypeRef: {
    findMany: jest.fn(),
  },
});

describe('IncomeService', () => {
  let prisma: ReturnType<typeof createPrismaMock>;
  let service: IncomeService;

  beforeEach(() => {
    prisma = createPrismaMock();
    service = new IncomeService(
      prisma as unknown as PrismaService,
      {} as IncomeTypeRefService,
      {} as TaxService,
    );
  });

  describe('update', () => {
    const date = new Date('2026-03-01T00:00:00.000Z');

    it('updates amount, date and type, and returns the dto', async () => {
      prisma.income.findUnique.mockResolvedValue({ id: 4 });
      prisma.incomeTypeRef.findMany.mockResolvedValue([
        { id: 1, code: 'SALARY' },
        { id: 2, code: 'BONUS' },
      ]);
      prisma.income.update.mockResolvedValue({
        id: 4,
        amount: new Prisma.Decimal(2500.5),
        date,
        typeId: 2,
        type: { code: 'BONUS', label: 'Prime' },
      });

      await expect(
        service.update(4, { amount: 2500.5, date, type: 'BONUS' }),
      ).resolves.toEqual({
        id: 4,
        amount: 2500.5,
        date,
        type: { code: 'BONUS', label: 'Prime' },
      });
      expect(prisma.income.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 4 },
          data: { amount: 2500.5, date, typeId: 2 },
        }),
      );
    });

    it('rejects an unknown income', async () => {
      prisma.income.findUnique.mockResolvedValue(null);

      await expect(
        service.update(99, { amount: 1, date, type: 'SALARY' }),
      ).rejects.toThrow(new NotFoundException('Income 99 not found'));
      expect(prisma.income.update).not.toHaveBeenCalled();
    });

    it('rejects an unknown income type', async () => {
      prisma.income.findUnique.mockResolvedValue({ id: 4 });
      prisma.incomeTypeRef.findMany.mockResolvedValue([
        { id: 1, code: 'SALARY' },
      ]);

      await expect(
        service.update(4, {
          amount: 1,
          date,
          type: 'NOPE' as unknown as 'SALARY',
        }),
      ).rejects.toThrow(new BadRequestException('Unknown income type NOPE'));
      expect(prisma.income.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deletes the income', async () => {
      prisma.income.findUnique.mockResolvedValue({ id: 4 });

      await service.remove(4);

      expect(prisma.income.delete).toHaveBeenCalledWith({ where: { id: 4 } });
    });

    it('rejects an unknown income', async () => {
      prisma.income.findUnique.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(
        new NotFoundException('Income 99 not found'),
      );
      expect(prisma.income.delete).not.toHaveBeenCalled();
    });
  });
});
