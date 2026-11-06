import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
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

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() income: IncomeRequestDto,
  ): Promise<IncomeResponseDto> {
    return this.incomeService.update(id, income);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.incomeService.remove(id);
  }
}
