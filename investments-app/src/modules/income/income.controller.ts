import {
  Body,
  Controller,
  Get,
  ParseBoolPipe,
  Post,
  Query,
} from '@nestjs/common';
import { IncomeService } from './income.service';
import {
  type IncomeResponseDto,
  type IncomeRequestDto,
  type IncomeGroupByDateResponseDto,
  type IncomeGroupByTypeResponseDto,
} from '@investments/shared';
import { type IncomeExcludingType } from './income.type';

@Controller('incomes')
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Get()
  findAll(@Query('year') year?: string): Promise<IncomeResponseDto[]> {
    if (year && !isNaN(Number(year))) {
      return this.incomeService.findByYear(Number(year));
    }

    return this.incomeService.findAll();
  }

  @Get('/stats/grouped-by-date')
  findAllGroupedByDate(
    @Query('unit') unit: IncomeExcludingType,
    @Query('withTaxes', ParseBoolPipe) withTaxes: boolean,
  ): Promise<IncomeGroupByDateResponseDto[]> {
    return this.incomeService.findAllGroupedByDate(unit, withTaxes);
  }

  @Get('/stats/grouped-by-type')
  findAllGroupByType(): Promise<IncomeGroupByTypeResponseDto[]> {
    return this.incomeService.findAllGroupedByType();
  }

  @Post()
  async create(
    @Body() incomes: IncomeRequestDto[],
  ): Promise<{ success: boolean }> {
    await this.incomeService.createAll(incomes);
    return { success: true };
  }
}
