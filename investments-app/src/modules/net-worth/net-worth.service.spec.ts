import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NetWorthService } from './net-worth.service';

const createPrismaMock = () => ({
  netWorth: {
    findMany: jest.fn(),
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

  // Les anciennes saisies sont stockées en texte « 2016-01-01 » : SQLite
  // compare les dates comme du texte, d'où un filtrage par année/mois en JS.
  const row = (id: number, iso: string, amount = 1000) => ({
    id,
    amount: new Prisma.Decimal(amount),
    date: new Date(iso),
  });

  describe('findAll', () => {
    it('returns amounts as numbers, ordered by date', async () => {
      prisma.netWorth.findMany.mockResolvedValue([
        row(1, '2026-03-01', 1000.5),
      ]);

      await expect(service.findAll()).resolves.toEqual([
        { id: 1, amount: 1000.5, date },
      ]);
      expect(prisma.netWorth.findMany).toHaveBeenCalledWith({
        orderBy: { date: 'asc' },
      });
    });

    it('keeps only the entries of the requested calendar year', async () => {
      prisma.netWorth.findMany.mockResolvedValue([
        row(1, '2015-12-01'),
        row(2, '2016-01-01'),
        row(3, '2016-12-01'),
        row(4, '2017-01-01'),
      ]);

      const result = await service.findAll(2016);

      expect(result.map(({ id }) => id)).toEqual([2, 3]);
    });
  });

  describe('create', () => {
    it('creates the month when it does not exist yet', async () => {
      prisma.netWorth.findMany.mockResolvedValue([row(1, '2026-02-01')]);

      await service.create({ date, amount: 1000 });

      expect(prisma.netWorth.create).toHaveBeenCalledWith({
        data: { date, amount: 1000 },
      });
      expect(prisma.netWorth.update).not.toHaveBeenCalled();
    });

    it('replaces the amount of a month already entered, whatever its storage format', async () => {
      prisma.netWorth.findMany.mockResolvedValue([row(7, '2026-03-01')]);

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
