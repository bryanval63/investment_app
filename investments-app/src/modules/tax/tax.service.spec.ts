import { ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TaxService } from './tax.service';

const createPrismaMock = () => ({
  tax: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
});

describe('TaxService', () => {
  let prisma: ReturnType<typeof createPrismaMock>;
  let service: TaxService;

  beforeEach(() => {
    prisma = createPrismaMock();
    service = new TaxService(prisma as unknown as PrismaService);
  });

  describe('findAll', () => {
    it('returns amounts as numbers, ordered by year', async () => {
      prisma.tax.findMany.mockResolvedValue([
        { id: 1, year: 2025, amount: new Prisma.Decimal(-209.5) },
      ]);

      await expect(service.findAll()).resolves.toEqual([
        { id: 1, year: 2025, amount: -209.5 },
      ]);
      expect(prisma.tax.findMany).toHaveBeenCalledWith({
        orderBy: { year: 'asc' },
      });
    });
  });

  describe('create', () => {
    it('creates the year when it does not exist yet', async () => {
      prisma.tax.findFirst.mockResolvedValue(null);

      await service.create({ year: 2025, amount: -300 });

      expect(prisma.tax.findFirst).toHaveBeenCalledWith({
        where: { year: 2025 },
      });
      expect(prisma.tax.create).toHaveBeenCalledWith({
        data: { year: 2025, amount: -300 },
      });
    });

    it('replaces the amount of a year already entered', async () => {
      prisma.tax.findFirst.mockResolvedValue({ id: 3 });

      await service.create({ year: 2025, amount: -300 });

      expect(prisma.tax.update).toHaveBeenCalledWith({
        where: { id: 3 },
        data: { amount: -300 },
      });
      expect(prisma.tax.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('updates year and amount', async () => {
      prisma.tax.findUnique.mockResolvedValue({ id: 3 });
      prisma.tax.findFirst.mockResolvedValue(null);
      prisma.tax.update.mockResolvedValue({
        id: 3,
        year: 2024,
        amount: new Prisma.Decimal(150),
      });

      await expect(
        service.update(3, { year: 2024, amount: 150 }),
      ).resolves.toEqual({ id: 3, year: 2024, amount: 150 });
      expect(prisma.tax.findFirst).toHaveBeenCalledWith({
        where: { year: 2024, id: { not: 3 } },
      });
    });

    it('rejects a year already used by another entry', async () => {
      prisma.tax.findUnique.mockResolvedValue({ id: 3 });
      prisma.tax.findFirst.mockResolvedValue({ id: 4 });

      await expect(
        service.update(3, { year: 2024, amount: 150 }),
      ).rejects.toThrow(new ConflictException('A tax already exists for 2024'));
      expect(prisma.tax.update).not.toHaveBeenCalled();
    });

    it('rejects an unknown entry', async () => {
      prisma.tax.findUnique.mockResolvedValue(null);

      await expect(
        service.update(99, { year: 2024, amount: 1 }),
      ).rejects.toThrow(new NotFoundException('Tax 99 not found'));
    });
  });

  describe('remove', () => {
    it('deletes the entry', async () => {
      prisma.tax.findUnique.mockResolvedValue({ id: 3 });

      await service.remove(3);

      expect(prisma.tax.delete).toHaveBeenCalledWith({ where: { id: 3 } });
    });

    it('rejects an unknown entry', async () => {
      prisma.tax.findUnique.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(
        new NotFoundException('Tax 99 not found'),
      );
    });
  });
});
