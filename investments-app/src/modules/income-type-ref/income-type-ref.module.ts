import { Module } from '@nestjs/common';
import { IncomeTypeRefService } from './income-type-ref.service';
import { IncomeTypeRefController } from './income-type-ref.controller';

@Module({
  controllers: [IncomeTypeRefController],
  providers: [IncomeTypeRefService],
  exports: [IncomeTypeRefService],
})
export class IncomeTypeRefModule {}
