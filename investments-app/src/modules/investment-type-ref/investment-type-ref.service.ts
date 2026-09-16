import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { mapInvestmentTypeRefToDto } from './investment-type-ref.mapper';
import {
  InvestmentTypeRefResponseDto,
  CreateReferenceRequestDto,
  UpdateReferenceLabelRequestDto,
} from '@investments/shared';
import { toReferenceCode } from '../reference/reference.utils';

@Injectable()
export class InvestmentTypeRefService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<InvestmentTypeRefResponseDto[]> {
    const investmentTypes = await this.prisma.investmentTypeRef.findMany();

    return mapInvestmentTypeRefToDto(investmentTypes);
  }

  async create({
    label,
  }: CreateReferenceRequestDto): Promise<InvestmentTypeRefResponseDto> {
    const normalizedLabel = label.trim();
    if (!normalizedLabel)
      throw new BadRequestException('The label cannot be empty');
    const code = toReferenceCode(normalizedLabel);
    if (!code) {
      throw new BadRequestException(
        'The label must contain at least one letter or number',
      );
    }

    const existingType = await this.prisma.investmentTypeRef.findUnique({
      where: { code },
    });
    if (existingType) {
      throw new ConflictException(
        `Investment type code ${code} already exists`,
      );
    }

    return this.prisma.investmentTypeRef.create({
      data: { code, label: normalizedLabel },
    });
  }

  async update(
    id: number,
    { label }: UpdateReferenceLabelRequestDto,
  ): Promise<InvestmentTypeRefResponseDto> {
    const normalizedLabel = label.trim();
    if (!normalizedLabel) {
      throw new BadRequestException('The label cannot be empty');
    }

    const investmentType = await this.prisma.investmentTypeRef.findUnique({
      where: { id },
    });
    if (!investmentType) {
      throw new NotFoundException(`Investment type ${id} not found`);
    }

    return this.prisma.investmentTypeRef.update({
      where: { id },
      data: { label: normalizedLabel },
    });
  }

  async remove(id: number): Promise<void> {
    const investmentType = await this.prisma.investmentTypeRef.findUnique({
      where: { id },
      include: { accounts: { select: { id: true }, take: 1 } },
    });
    if (!investmentType) {
      throw new NotFoundException(`Investment type ${id} not found`);
    }
    if (investmentType.accounts.length > 0) {
      throw new ConflictException(
        'This investment type cannot be deleted because it is used by an account',
      );
    }

    await this.prisma.investmentTypeRef.delete({ where: { id } });
  }
}
