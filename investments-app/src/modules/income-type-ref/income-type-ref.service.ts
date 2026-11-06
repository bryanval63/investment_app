import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateReferenceRequestDto,
  IncomeTypeRefResponseDto,
  UpdateReferenceLabelRequestDto,
} from '@investments/shared';
import { PrismaService } from '../prisma/prisma.service';
import {
  buildReferenceCode,
  normalizeReferenceLabel,
} from '../reference/reference.utils';
import { mapIncomeTypeRefToDto } from './income-type-ref.mapper';

@Injectable()
export class IncomeTypeRefService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<IncomeTypeRefResponseDto[]> {
    const incomeTypes = await this.prisma.incomeTypeRef.findMany({
      orderBy: { id: 'asc' },
    });

    return mapIncomeTypeRefToDto(incomeTypes);
  }

  async create({
    label,
  }: CreateReferenceRequestDto): Promise<IncomeTypeRefResponseDto> {
    const normalizedLabel = normalizeReferenceLabel(label);
    const code = buildReferenceCode(normalizedLabel);

    const existingType = await this.prisma.incomeTypeRef.findUnique({
      where: { code },
    });
    if (existingType) {
      throw new ConflictException(`Income type code ${code} already exists`);
    }

    return this.prisma.incomeTypeRef.create({
      data: { code, label: normalizedLabel },
    });
  }

  /** Renomme le libellé ; le code reste stable (il identifie le type). */
  async update(
    id: number,
    { label }: UpdateReferenceLabelRequestDto,
  ): Promise<IncomeTypeRefResponseDto> {
    const normalizedLabel = normalizeReferenceLabel(label);

    const incomeType = await this.prisma.incomeTypeRef.findUnique({
      where: { id },
    });
    if (!incomeType) {
      throw new NotFoundException(`Income type ${id} not found`);
    }

    return this.prisma.incomeTypeRef.update({
      where: { id },
      data: { label: normalizedLabel },
    });
  }

  async remove(id: number): Promise<void> {
    const incomeType = await this.prisma.incomeTypeRef.findUnique({
      where: { id },
      include: { incomes: { select: { id: true }, take: 1 } },
    });
    if (!incomeType) {
      throw new NotFoundException(`Income type ${id} not found`);
    }
    if (incomeType.incomes.length > 0) {
      throw new ConflictException(
        'This income type cannot be deleted because it is used by an income',
      );
    }

    await this.prisma.incomeTypeRef.delete({ where: { id } });
  }
}
