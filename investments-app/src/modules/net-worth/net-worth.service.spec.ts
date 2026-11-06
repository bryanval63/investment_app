import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NetWorthService } from './net-worth.service';

const createPrismaMock = () => ({
  netWorth: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
});

describe('NetWorthService', () => {
  let prisma: ReturnType<typeof createPrismaMock>;
  let service: NetWorthService;
  const date = new Date('2026-03-01T00:00:00.000Z');

  beforeEach(() => {
    prisma = createPrismaMock();
    service = new NetWorthService(prisma as unknown as PrismaService);
  });

  describe('findAll', () => {
    it('returns amounts as numbers, ordered by date', async () => {
      prisma.netWorth.findMany.mockResolvedValue([
        { id: 1, amount: new Prisma.Decimal(1000.5), date },
      ]);

      await expect(service.findAll()).resolves.toEqual([
        { id: 1, amount: 1000.5, date },
      ]);
      expect(prisma.netWorth.findMany).toHaveBeenCalledWith({
        orderBy: { date: 'asc' },
      });
    });
  });

  describe('create', () => {
    it('creates the month when it does not exist yet', async () => {
      prisma.netWorth.findFirst.mockResolvedValue(null);

      await service.create({ date, amount: 1000 });

      expect(prisma.netWorth.findFirst).toHaveBeenCalledWith({
        where: { date },
      });
      expect(prisma.netWorth.create).toHaveBeenCalledWith({
        data: { date, amount: 1000 },
      });
      expect(prisma.netWorth.update).not.toHaveBeenCalled();
    });

    it('replaces the amount of a month already entered', async () => {
      prisma.netWorth.findFirst.mockResolvedValue({ id: 7 });

      await service.create({ date, amount: 1200 });

      expect(prisma.netWorth.update).toHaveBeenCalledWith({
        where: { id: 7 },
        data: { amount: 1200 },
      });
      expect(prisma.netWorth.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('updates amount and date', async () => {
      prisma.netWorth.findUnique.mockResolvedValue({ id: 7 });
      prisma.netWorth.update.mockResolvedValue({
        id: 7,
        amount: new Prisma.Decimal(1300),
        date,
      });

      await expect(service.update(7, { date, amount: 1300 })).resolves.toEqual({
        id: 7,
        amount: 1300,
        date,
      });
      expect(prisma.netWorth.update).toHaveBeenCalledWith({
        where: { id: 7 },
        data: { amount: 1300, date },
      });
    });

    it('rejects an unknown entry', async () => {
      prisma.netWorth.findUnique.mockResolvedValue(null);

      await expect(service.update(99, { date, amount: 1 })).rejects.toThrow(
        new NotFoundException('Net worth 99 not found'),
      );
      expect(prisma.netWorth.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deletes the entry', async () => {
      prisma.netWorth.findUnique.mockResolvedValue({ id: 7 });

      await service.remove(7);

      expect(prisma.netWorth.delete).toHaveBeenCalledWith({ where: { id: 7 } });
    });

    it('rejects an unknown entry', async () => {
      prisma.netWorth.findUnique.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(
        new NotFoundException('Net worth 99 not found'),
      );
    });
  });
});
