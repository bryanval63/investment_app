import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { mapIncomeTypeRefToDto } from './income-type-ref.mapper';
import { IncomeTypeRefResponseDto } from '@investments/shared';

@Injectable()
export class IncomeTypeRefService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<IncomeTypeRefResponseDto[]> {
    const incomeTypes = await this.prisma.incomeTypeRef.findMany();

    return mapIncomeTypeRefToDto(incomeTypes);
  }
}
