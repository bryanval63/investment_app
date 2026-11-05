import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InvestmentTypeRefService } from './investment-type-ref.service';

const createPrismaMock = () => ({
  investmentTypeRef: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
});

describe('InvestmentTypeRefService', () => {
  let prisma: ReturnType<typeof createPrismaMock>;
  let service: InvestmentTypeRefService;

  beforeEach(() => {
    prisma = createPrismaMock();
    service = new InvestmentTypeRefService(prisma as unknown as PrismaService);
  });

  describe('findAll', () => {
    it('returns every investment type mapped to DTOs', async () => {
      const types = [
        { id: 1, code: 'PEA', label: 'PEA' },
        { id: 2, code: 'CTO', label: 'Compte-titres' },
      ];
      prisma.investmentTypeRef.findMany.mockResolvedValue(types);

      await expect(service.findAll()).resolves.toEqual(types);
      expect(prisma.investmentTypeRef.findMany).toHaveBeenCalledWith();
    });
  });

  describe('create', () => {
    it('rejects an empty label', async () => {
      await expect(service.create({ label: '   ' })).rejects.toThrow(
        new BadRequestException('The label cannot be empty'),
      );
      expect(prisma.investmentTypeRef.create).not.toHaveBeenCalled();
    });

    it('rejects a label without letter or digit', async () => {
      await expect(service.create({ label: '-- !' })).rejects.toThrow(
        new BadRequestException(
          'The label must contain at least one letter or number',
        ),
      );
    });

    it('rejects a code that already exists', async () => {
      prisma.investmentTypeRef.findUnique.mockResolvedValue({ id: 1 });

      await expect(service.create({ label: 'Plan épargne' })).rejects.toThrow(
        new ConflictException(
          'Investment type code PLAN_EPARGNE already exists',
        ),
      );
      expect(prisma.investmentTypeRef.findUnique).toHaveBeenCalledWith({
        where: { code: 'PLAN_EPARGNE' },
      });
    });

    it('creates the type with a generated code and a trimmed label', async () => {
      prisma.investmentTypeRef.findUnique.mockResolvedValue(null);
      const created = { id: 3, code: 'PLAN_EPARGNE', label: 'Plan épargne' };
      prisma.investmentTypeRef.create.mockResolvedValue(created);

      await expect(service.create({ label: '  Plan épargne ' })).resolves.toBe(
        created,
      );
      expect(prisma.investmentTypeRef.create).toHaveBeenCalledWith({
        data: { code: 'PLAN_EPARGNE', label: 'Plan épargne' },
      });
    });
  });

  describe('update', () => {
    it('rejects an empty label', async () => {
      await expect(service.update(1, { label: '' })).rejects.toThrow(
        new BadRequestException('The label cannot be empty'),
      );
      expect(prisma.investmentTypeRef.findUnique).not.toHaveBeenCalled();
    });

    it('throws when the type does not exist', async () => {
      prisma.investmentTypeRef.findUnique.mockResolvedValue(null);

      await expect(service.update(9, { label: 'X' })).rejects.toThrow(
        new NotFoundException('Investment type 9 not found'),
      );
    });

    it('updates the label only, trimmed', async () => {
      prisma.investmentTypeRef.findUnique.mockResolvedValue({ id: 1 });
      const updated = { id: 1, code: 'PEA', label: 'Nouveau' };
      prisma.investmentTypeRef.update.mockResolvedValue(updated);

      await expect(service.update(1, { label: ' Nouveau ' })).resolves.toBe(
        updated,
      );
      expect(prisma.investmentTypeRef.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { label: 'Nouveau' },
      });
    });
  });

  describe('remove', () => {
    it('throws when the type does not exist', async () => {
      prisma.investmentTypeRef.findUnique.mockResolvedValue(null);

      await expect(service.remove(4)).rejects.toThrow(
        new NotFoundException('Investment type 4 not found'),
      );
    });

    it('refuses to delete a type used by an account', async () => {
      prisma.investmentTypeRef.findUnique.mockResolvedValue({
        id: 4,
        accounts: [{ id: 10 }],
      });

      await expect(service.remove(4)).rejects.toThrow(ConflictException);
      expect(prisma.investmentTypeRef.delete).not.toHaveBeenCalled();
    });

    it('deletes an unused type', async () => {
      prisma.investmentTypeRef.findUnique.mockResolvedValue({
        id: 4,
        accounts: [],
      });

      await expect(service.remove(4)).resolves.toBeUndefined();
      expect(prisma.investmentTypeRef.findUnique).toHaveBeenCalledWith({
        where: { id: 4 },
        include: { accounts: { select: { id: true }, take: 1 } },
      });
      expect(prisma.investmentTypeRef.delete).toHaveBeenCalledWith({
        where: { id: 4 },
      });
    });
  });
});
