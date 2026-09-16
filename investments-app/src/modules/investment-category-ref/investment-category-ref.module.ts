import { Module } from '@nestjs/common';
import { InvestmentCategoryRefController } from './investment-category-ref.controller';
import { InvestmentCategoryRefService } from './investment-category-ref.service';

@Module({
  controllers: [InvestmentCategoryRefController],
  providers: [InvestmentCategoryRefService],
})
export class InvestmentCategoryRefModule {}
