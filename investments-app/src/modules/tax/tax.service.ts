import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Tax } from '@prisma/client';
import { TaxRequestDto, TaxResponseDto } from '@investments/shared';
import { PrismaService } from '../prisma/prisma.service';

const mapTaxToDto = ({ id, year, amount }: Tax): TaxResponseDto => ({
  id,
  year,
  amount: Number(amount),
});

@Injectable()
export class TaxService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<TaxResponseDto[]> {
    const taxes = await this.prisma.tax.findMany({ orderBy: { year: 'asc' } });
    return taxes.map(mapTaxToDto);
  }

  /** Un seul montant par année : une nouvelle saisie remplace l'existante. */
  async create({ year, amount }: TaxRequestDto): Promise<void> {
    const existing = await this.prisma.tax.findFirst({ where: { year } });

    if (existing) {
      await this.prisma.tax.update({
        where: { id: existing.id },
        data: { amount },
      });
      return;
    }

    await this.prisma.tax.create({ data: { year, amount } });
  }

  async update(
    id: number,
    { year, amount }: TaxRequestDto,
  ): Promise<TaxResponseDto> {
    await this.findExistingOrThrow(id);

    const sameYear = await this.prisma.tax.findFirst({
      where: { year, id: { not: id } },
    });
    if (sameYear) {
      throw new ConflictException(`A tax already exists for ${year}`);
    }

    const tax = await this.prisma.tax.update({
      where: { id },
      data: { year, amount },
    });

    return mapTaxToDto(tax);
  }

  async remove(id: number): Promise<void> {
    await this.findExistingOrThrow(id);
    await this.prisma.tax.delete({ where: { id } });
  }

  private async findExistingOrThrow(id: number) {
    const tax = await this.prisma.tax.findUnique({ where: { id } });
    if (!tax) {
      throw new NotFoundException(`Tax ${id} not found`);
    }
    return tax;
  }
}
