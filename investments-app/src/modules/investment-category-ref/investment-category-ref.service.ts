import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  InvestmentCategoryRefResponseDto,
  UpdateReferenceLabelRequestDto,
  CreateReferenceRequestDto,
} from '@investments/shared';
import { mapInvestmentCategoryRefToDto } from './investment-category-ref.mapper';
import { toReferenceCode } from '../reference/reference.utils';

@Injectable()
export class InvestmentCategoryRefService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<InvestmentCategoryRefResponseDto[]> {
    const categories = await this.prisma.investmentCategoryRef.findMany({
      orderBy: { id: 'asc' },
    });

    return mapInvestmentCategoryRefToDto(categories);
  }

  async create({
    label,
  }: CreateReferenceRequestDto): Promise<InvestmentCategoryRefResponseDto> {
    const normalizedLabel = label.trim();
    if (!normalizedLabel)
      throw new BadRequestException('The label cannot be empty');
    const code = toReferenceCode(normalizedLabel);
    if (!code) {
      throw new BadRequestException(
        'The label must contain at least one letter or number',
      );
    }

    const existingCategory = await this.prisma.investmentCategoryRef.findUnique(
      {
        where: { code },
      },
    );
    if (existingCategory) {
      throw new ConflictException(
        `Investment category code ${code} already exists`,
      );
    }

    return this.prisma.investmentCategoryRef.create({
      data: { code, label: normalizedLabel },
    });
  }

  async update(
    id: number,
    { label }: UpdateReferenceLabelRequestDto,
  ): Promise<InvestmentCategoryRefResponseDto> {
    const normalizedLabel = label.trim();
    if (!normalizedLabel) {
      throw new BadRequestException('The label cannot be empty');
    }

    const category = await this.prisma.investmentCategoryRef.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Investment category ${id} not found`);
    }

    return this.prisma.investmentCategoryRef.update({
      where: { id },
      data: { label: normalizedLabel },
    });
  }

  async remove(id: number): Promise<void> {
    const category = await this.prisma.investmentCategoryRef.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Investment category ${id} not found`);
    }
    if (category.code === 'ALL') {
      throw new ConflictException('The ALL category cannot be deleted');
    }

    const account = await this.prisma.account.findFirst({
      where: { category: category.code },
      select: { id: true },
    });
    if (account) {
      throw new ConflictException(
        'This investment category cannot be deleted because it is used by an account',
      );
    }

    await this.prisma.investmentCategoryRef.delete({ where: { id } });
  }
}
