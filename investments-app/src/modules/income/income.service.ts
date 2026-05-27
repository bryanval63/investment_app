import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  IncomeGroupByDateResponseDto,
  IncomeGroupByTypeResponseDto,
  IncomeRequestDto,
  IncomeResponseDto,
} from '@investments/shared';
import { SELECT_INCOME_WITH_TYPE } from './income.selects';
import { mapIncomesArrayToDto } from './income.mappers';
import { IncomeTypeRefService } from '../income-type-ref/income-type-ref.service';
import { Prisma, Tax } from '@prisma/client';
import { TaxService } from '../tax/tax.service';
import { IncomeExcludingType } from './income.type';

@Injectable()
export class IncomeService {
  constructor(
    private prisma: PrismaService,
    private incomeTypeRefService: IncomeTypeRefService,
    private taxService: TaxService,
  ) {}

  async findAll(): Promise<IncomeResponseDto[]> {
    const incomes = await this.prisma.income.findMany(SELECT_INCOME_WITH_TYPE);

    return mapIncomesArrayToDto(incomes);
  }

  async findByYear(year: number): Promise<IncomeResponseDto[]> {
    const incomes = await this.findAll();

    return incomes.filter((income) => income.date.getFullYear() === year);
  }

  async findAllGroupedByDate(
    unit: IncomeExcludingType,
    hasTaxes: boolean,
  ): Promise<IncomeGroupByDateResponseDto[]> {
    const prismaSqlDate = Prisma.sql`date`;
    const prismaSqlYear = Prisma.sql`strftime('%Y', date)`;

    const prismaSql = unit === 'month' ? prismaSqlDate : prismaSqlYear;

    const incomes = await this.prisma.$queryRaw<IncomeGroupByDateResponseDto[]>`
      SELECT
        date,
        CAST(SUM(amount) AS REAL) as amount
      FROM Income
      GROUP BY ${prismaSql}
      ORDER BY date ASC
    `;

    return hasTaxes ? this.incomesWithTaxes(incomes, unit) : incomes;
  }

  private async incomesWithTaxes(
    incomes: IncomeGroupByDateResponseDto[],
    unit: IncomeExcludingType,
  ) {
    const taxes = await this.taxService.findAll();

    const taxByYear = new Map<number, number>();

    taxes.forEach(({ year, amount }: Tax) => {
      taxByYear.set(
        year,
        unit === 'month' ? Number(amount) / 12 : Number(amount),
      );
    });

    return incomes.map((income) => {
      const year = new Date(income.date).getFullYear();
      const tax = taxByYear.get(year) ?? 0;

      return {
        ...income,
        amount: income.amount + tax,
      };
    });
  }

  async findAllGroupedByType() {
    return this.prisma.$queryRaw<IncomeGroupByTypeResponseDto[]>`
      SELECT 
        itr.code,
        itr.label,
        CAST(SUM(i.amount) AS REAL) as amount
      FROM Income i
      JOIN IncomeTypeRef itr ON itr.id = i.typeId
      GROUP BY itr.code, itr.label 
      ORDER BY amount DESC
    `;
  }

  async createAll(incomes: IncomeRequestDto[]): Promise<void> {
    const types = await this.incomeTypeRefService.findAll();

    const typeMap = Object.fromEntries(types.map((t) => [t.code, t.id]));

    await this.prisma.income.createMany({
      data: incomes.map(({ amount, date, type }) => ({
        amount,
        date,
        typeId: typeMap[type],
      })),
    });
  }
}
