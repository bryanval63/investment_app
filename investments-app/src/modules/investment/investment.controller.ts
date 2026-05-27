import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { InvestmentService } from './investment.service';
import {
  type InvestmentColumnKey,
  InvestmentOverviewResponseDto,
  InvestmentRequestDto,
  InvestmentTotalByMonthGroupByAccountResponseDto,
  InvestmentTotalByMonthGroupByCategoryResponseDto,
  InvestmentTotalByYearGroupByAccountResponseDto,
  InvestmentTotalByYearGroupByCategoryResponseDto,
} from '@investments/shared';

@Controller('investments')
export class InvestmentController {
  constructor(private readonly investmentService: InvestmentService) {}

  @Get('/total/grouped-by-category-monthly')
  findTotalAmountGroupedByCategoryMonthly(
    @Query('unit') unit: InvestmentColumnKey,
  ): Promise<InvestmentTotalByMonthGroupByCategoryResponseDto[]> {
    return this.investmentService.findTotalByMonthGroupedByCategory(unit);
  }

  @Get('/total/grouped-by-category-yearly')
  findTotalAmountGroupedByCategoryYearly(): Promise<
    InvestmentTotalByYearGroupByCategoryResponseDto[]
  > {
    return this.investmentService.findTotalByYearGroupedByCategory();
  }

  @Get('/total/grouped-by-account-yearly')
  findTotalAmountGroupedByAccountYearly(): Promise<
    InvestmentTotalByYearGroupByAccountResponseDto[]
  > {
    return this.investmentService.findTotalByYearGroupedByAccount();
  }

  @Get('/total/grouped-by-account-monthly')
  findTotalAmountGroupedByAccountMonthly(
    @Query('unit') unit: InvestmentColumnKey,
  ): Promise<InvestmentTotalByMonthGroupByAccountResponseDto[]> {
    return this.investmentService.findTotalByMonthGroupedByAccount(unit);
  }

  @Get('/overview')
  getOverview(): Promise<InvestmentOverviewResponseDto> {
    return this.investmentService.getOverview();
  }

  @Post()
  async create(
    @Body() incomes: InvestmentRequestDto[],
  ): Promise<{ success: boolean }> {
    await this.investmentService.createAll(incomes);
    return { success: true };
  }
}
