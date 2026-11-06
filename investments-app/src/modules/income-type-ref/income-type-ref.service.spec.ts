import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IncomeTypeRefService } from './income-type-ref.service';

const createPrismaMock = () => ({
  incomeTypeRef: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
});

describe('IncomeTypeRefService', () => {
  let prisma: ReturnType<typeof createPrismaMock>;
  let service: IncomeTypeRefService;

  beforeEach(() => {
    prisma = createPrismaMock();
    service = new IncomeTypeRefService(prisma as unknown as PrismaService);
  });

  describe('findAll', () => {
    it('returns every income type ordered by id', async () => {
      const types = [{ id: 1, code: 'SALARY', label: 'Salaire' }];
      prisma.incomeTypeRef.findMany.mockResolvedValue(types);

      await expect(service.findAll()).resolves.toEqual(types);
      expect(prisma.incomeTypeRef.findMany).toHaveBeenCalledWith({
        orderBy: { id: 'asc' },
      });
    });
  });

  describe('create', () => {
    it('derives the code from the label', async () => {
      prisma.incomeTypeRef.findUnique.mockResolvedValue(null);
      prisma.incomeTypeRef.create.mockResolvedValue({
        id: 8,
        code: 'DIVIDENDES',
        label: 'Dividendes',
      });

      await expect(service.create({ label: ' Dividendes ' })).resolves.toEqual({
        id: 8,
        code: 'DIVIDENDES',
        label: 'Dividendes',
      });
      expect(prisma.incomeTypeRef.create).toHaveBeenCalledWith({
        data: { code: 'DIVIDENDES', label: 'Dividendes' },
      });
    });

    it('rejects an empty label', async () => {
      await expect(service.create({ label: ' ' })).rejects.toThrow(
        new BadRequestException('The label cannot be empty'),
      );
    });

    it('rejects a code already used', async () => {
      prisma.incomeTypeRef.findUnique.mockResolvedValue({ id: 1 });

      await expect(service.create({ label: 'Salary' })).rejects.toThrow(
        new ConflictException('Income type code SALARY already exists'),
      );
      expect(prisma.incomeTypeRef.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('renames the label only (the code stays stable)', async () => {
      prisma.incomeTypeRef.findUnique.mockResolvedValue({ id: 1 });
      prisma.incomeTypeRef.update.mockResolvedValue({
        id: 1,
        code: 'SALARY',
        label: 'Salaire net',
      });

      await service.update(1, { label: 'Salaire net' });

      expect(prisma.incomeTypeRef.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { label: 'Salaire net' },
      });
    });

    it('rejects an unknown type', async () => {
      prisma.incomeTypeRef.findUnique.mockResolvedValue(null);

      await expect(service.update(99, { label: 'X' })).rejects.toThrow(
        new NotFoundException('Income type 99 not found'),
      );
    });
  });

  describe('remove', () => {
    it('deletes an unused type', async () => {
      prisma.incomeTypeRef.findUnique.mockResolvedValue({ id: 8, incomes: [] });

      await service.remove(8);

      expect(prisma.incomeTypeRef.delete).toHaveBeenCalledWith({
        where: { id: 8 },
      });
    });

    it('refuses to delete a type used by an income', async () => {
      prisma.incomeTypeRef.findUnique.mockResolvedValue({
        id: 1,
        incomes: [{ id: 3 }],
      });

      await expect(service.remove(1)).rejects.toThrow(
        new ConflictException(
          'This income type cannot be deleted because it is used by an income',
        ),
      );
      expect(prisma.incomeTypeRef.delete).not.toHaveBeenCalled();
    });

    it('rejects an unknown type', async () => {
      prisma.incomeTypeRef.findUnique.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(
        new NotFoundException('Income type 99 not found'),
      );
    });
  });
});
