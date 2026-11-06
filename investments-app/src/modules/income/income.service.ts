import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  IncomeGroupByDateResponseDto,
  IncomeGroupByTypeResponseDto,
  IncomeRequestDto,
  IncomeResponseDto,
} from '@investments/shared';
import { SELECT_INCOME_WITH_TYPE } from './income.selects';
import { mapIncomeToDto, mapIncomesArrayToDto } from './income.mappers';
import { IncomeTypeRefService } from '../income-type-ref/income-type-ref.service';
import { Prisma } from '@prisma/client';
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

    taxes.forEach(({ year, amount }) => {
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

  async update(
    id: number,
    { amount, date, type }: IncomeRequestDto,
  ): Promise<IncomeResponseDto> {
    await this.findExistingOrThrow(id);

    // `code` est un enum Prisma : une valeur inconnue dans un `where` lèverait
    // une erreur de validation (500) au lieu d'une 400.
    const typeRef = (await this.prisma.incomeTypeRef.findMany()).find(
      ({ code }) => code === type,
    );
    if (!typeRef) {
      throw new BadRequestException(`Unknown income type ${type}`);
    }

    const income = await this.prisma.income.update({
      where: { id },
      data: { amount, date: new Date(date), typeId: typeRef.id },
      ...SELECT_INCOME_WITH_TYPE,
    });

    return mapIncomeToDto(income);
  }

  async remove(id: number): Promise<void> {
    await this.findExistingOrThrow(id);
    await this.prisma.income.delete({ where: { id } });
  }

  private async findExistingOrThrow(id: number) {
    const income = await this.prisma.income.findUnique({ where: { id } });
    if (!income) {
      throw new NotFoundException(`Income ${id} not found`);
    }
    return income;
  }
}
