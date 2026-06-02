import { NetWorthRequestDto, NetWorthResponseDto } from '@investments/shared';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class NetWorthService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<NetWorthResponseDto[]> {
    const netWorthes = await this.prisma.netWorth.findMany();

    return netWorthes.map(({ id, amount, date }) => ({
      id: Number(id),
      amount: Number(amount),
      date,
    }));
  }

  async create(netWorth: NetWorthRequestDto): Promise<void> {
    await this.prisma.netWorth.create({ data: netWorth });
  }
}
