import { Module } from '@nestjs/common';
import { InvestmentTypeRefService } from './investment-type-ref.service';
import { InvestmentTypeRefController } from './investment-type-ref.controller';

@Module({
  controllers: [InvestmentTypeRefController],
  providers: [InvestmentTypeRefService],
  exports: [InvestmentTypeRefService],
})
export class InvestmentTypeRefModule {}
