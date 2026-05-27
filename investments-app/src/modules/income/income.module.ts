import { Module } from '@nestjs/common';
import { IncomeService } from './income.service';
import { IncomeController } from './income.controller';
import { IncomeTypeRefModule } from '../income-type-ref/income-type-ref.module';
import { TaxModule } from '../tax/tax.module';

@Module({
  controllers: [IncomeController],
  providers: [IncomeService],
  imports: [IncomeTypeRefModule, TaxModule],
})
export class IncomeModule {}
