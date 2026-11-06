import { NetWorthRequestDto, NetWorthResponseDto } from '@investments/shared';
import { Injectable, NotFoundException } from '@nestjs/common';
import { NetWorth } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const mapNetWorthToDto = ({
  id,
  amount,
  date,
}: NetWorth): NetWorthResponseDto => ({
  id: Number(id),
  amount: Number(amount),
  date,
});

@Injectable()
export class NetWorthService {
  constructor(private prisma: PrismaService) {}

  /** Toutes les saisies, ou celles d'une année civile si `year` est fourni. */
  async findAll(year?: number): Promise<NetWorthResponseDto[]> {
    const netWorthes = await this.prisma.netWorth.findMany({
      where:
        year === undefined
          ? {}
          : {
              date: {
                gte: new Date(Date.UTC(year, 0, 1)),
                lt: new Date(Date.UTC(year + 1, 0, 1)),
              },
            },
      orderBy: { date: 'asc' },
    });

    return netWorthes.map(mapNetWorthToDto);
  }

  /** Une seule valeur par mois : une nouvelle saisie remplace l'existante. */
  async create({ date, amount }: NetWorthRequestDto): Promise<void> {
    const monthDate = new Date(date);
    const existing = await this.prisma.netWorth.findFirst({
      where: { date: monthDate },
    });

    if (existing) {
      await this.prisma.netWorth.update({
        where: { id: existing.id },
        data: { amount },
      });
      return;
    }

    await this.prisma.netWorth.create({ data: { date: monthDate, amount } });
  }

  async update(
    id: number,
    { date, amount }: NetWorthRequestDto,
  ): Promise<NetWorthResponseDto> {
    await this.findExistingOrThrow(id);

    const netWorth = await this.prisma.netWorth.update({
      where: { id },
      data: { amount, date: new Date(date) },
    });

    return mapNetWorthToDto(netWorth);
  }

  async remove(id: number): Promise<void> {
    await this.findExistingOrThrow(id);
    await this.prisma.netWorth.delete({ where: { id } });
  }

  private async findExistingOrThrow(id: number) {
    const netWorth = await this.prisma.netWorth.findUnique({ where: { id } });
    if (!netWorth) {
      throw new NotFoundException(`Net worth ${id} not found`);
    }
    return netWorth;
  }
}
