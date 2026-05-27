import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Tax } from '@prisma/client';
import { TaxRequestDto } from '@investments/shared';

@Injectable()
export class TaxService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<Tax[]> {
    return this.prisma.tax.findMany();
  }

  async create(tax: TaxRequestDto): Promise<void> {
    await this.prisma.tax.create({
      data: {
        amount: tax.amount,
        year: tax.year,
      },
    });
  }
}
