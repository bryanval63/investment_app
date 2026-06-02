import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { mapInvestmentTypeRefToDto } from './investment-type-ref.mapper';
import { InvestmentTypeRefResponseDto } from '@investments/shared';

@Injectable()
export class InvestmentTypeRefService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<InvestmentTypeRefResponseDto[]> {
    const investmentTypes = await this.prisma.investmentTypeRef.findMany();

    return mapInvestmentTypeRefToDto(investmentTypes);
  }
}
