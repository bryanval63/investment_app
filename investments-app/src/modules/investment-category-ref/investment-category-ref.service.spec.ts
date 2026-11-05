import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InvestmentCategoryRefService } from './investment-category-ref.service';

const createPrismaMock = () => ({
  investmentCategoryRef: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  account: {
    findFirst: jest.fn(),
  },
});

describe('InvestmentCategoryRefService', () => {
  let prisma: ReturnType<typeof createPrismaMock>;
  let service: InvestmentCategoryRefService;

  beforeEach(() => {
    prisma = createPrismaMock();
    service = new InvestmentCategoryRefService(
      prisma as unknown as PrismaService,
    );
  });

  describe('findAll', () => {
    it('returns every category ordered by id', async () => {
      const categories = [
        { id: 1, code: 'ALL', label: 'Tout' },
        { id: 2, code: 'CRYPTO', label: 'Cryptos' },
      ];
      prisma.investmentCategoryRef.findMany.mockResolvedValue(categories);

      await expect(service.findAll()).resolves.toEqual(categories);
      expect(prisma.investmentCategoryRef.findMany).toHaveBeenCalledWith({
        orderBy: { id: 'asc' },
      });
    });
  });

  describe('create', () => {
    it('rejects an empty label', async () => {
      await expect(service.create({ label: ' ' })).rejects.toThrow(
        new BadRequestException('The label cannot be empty'),
      );
      expect(prisma.investmentCategoryRef.create).not.toHaveBeenCalled();
    });

    it('rejects a label without letter or digit', async () => {
      await expect(service.create({ label: '???' })).rejects.toThrow(
        new BadRequestException(
          'The label must contain at least one letter or number',
        ),
      );
    });

    it('rejects a code that already exists', async () => {
      prisma.investmentCategoryRef.findUnique.mockResolvedValue({ id: 2 });

      await expect(service.create({ label: 'Immobilier' })).rejects.toThrow(
        new ConflictException(
          'Investment category code IMMOBILIER already exists',
        ),
      );
      expect(prisma.investmentCategoryRef.findUnique).toHaveBeenCalledWith({
        where: { code: 'IMMOBILIER' },
      });
    });

    it('creates the category with a generated code and a trimmed label', async () => {
      prisma.investmentCategoryRef.findUnique.mockResolvedValue(null);
      const created = {
        id: 5,
        code: 'MATIERES_PREMIERES',
        label: 'Matières premières',
      };
      prisma.investmentCategoryRef.create.mockResolvedValue(created);

      await expect(
        service.create({ label: ' Matières premières ' }),
      ).resolves.toBe(created);
      expect(prisma.investmentCategoryRef.create).toHaveBeenCalledWith({
        data: { code: 'MATIERES_PREMIERES', label: 'Matières premières' },
      });
    });
  });

  describe('update', () => {
    it('rejects an empty label', async () => {
      await expect(service.update(1, { label: '  ' })).rejects.toThrow(
        new BadRequestException('The label cannot be empty'),
      );
      expect(prisma.investmentCategoryRef.findUnique).not.toHaveBeenCalled();
    });

    it('throws when the category does not exist', async () => {
      prisma.investmentCategoryRef.findUnique.mockResolvedValue(null);

      await expect(service.update(9, { label: 'X' })).rejects.toThrow(
        new NotFoundException('Investment category 9 not found'),
      );
    });

    it('updates the label only, trimmed', async () => {
      prisma.investmentCategoryRef.findUnique.mockResolvedValue({ id: 2 });
      const updated = { id: 2, code: 'CRYPTO', label: 'Crypto-actifs' };
      prisma.investmentCategoryRef.update.mockResolvedValue(updated);

      await expect(
        service.update(2, { label: 'Crypto-actifs ' }),
      ).resolves.toBe(updated);
      expect(prisma.investmentCategoryRef.update).toHaveBeenCalledWith({
        where: { id: 2 },
        data: { label: 'Crypto-actifs' },
      });
    });
  });

  describe('remove', () => {
    it('throws when the category does not exist', async () => {
      prisma.investmentCategoryRef.findUnique.mockResolvedValue(null);

      await expect(service.remove(4)).rejects.toThrow(
        new NotFoundException('Investment category 4 not found'),
      );
    });

    it('refuses to delete the ALL category', async () => {
      prisma.investmentCategoryRef.findUnique.mockResolvedValue({
        id: 1,
        code: 'ALL',
      });

      await expect(service.remove(1)).rejects.toThrow(
        new ConflictException('The ALL category cannot be deleted'),
      );
      expect(prisma.account.findFirst).not.toHaveBeenCalled();
    });

    it('refuses to delete a category used by an account', async () => {
      prisma.investmentCategoryRef.findUnique.mockResolvedValue({
        id: 2,
        code: 'CRYPTO',
      });
      prisma.account.findFirst.mockResolvedValue({ id: 10 });

      await expect(service.remove(2)).rejects.toThrow(ConflictException);
      expect(prisma.account.findFirst).toHaveBeenCalledWith({
        where: { category: 'CRYPTO' },
        select: { id: true },
      });
      expect(prisma.investmentCategoryRef.delete).not.toHaveBeenCalled();
    });

    it('deletes an unused category', async () => {
      prisma.investmentCategoryRef.findUnique.mockResolvedValue({
        id: 2,
        code: 'CRYPTO',
      });
      prisma.account.findFirst.mockResolvedValue(null);

      await expect(service.remove(2)).resolves.toBeUndefined();
      expect(prisma.investmentCategoryRef.delete).toHaveBeenCalledWith({
        where: { id: 2 },
      });
    });
  });
});
