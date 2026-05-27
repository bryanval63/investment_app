import { Module } from '@nestjs/common';
import { IncomeModule } from './modules/income/income.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AccountModule } from './modules/account/account.module';
import { InvestmentModule } from './modules/investment/investment.module';
import { TaxModule } from './modules/tax/tax.module';
import { IncomeTypeRefModule } from './modules/income-type-ref/income-type-ref.module';
import { NetWorthModule } from './net-worth/net-worth.module';

@Module({
  imports: [
    IncomeModule,
    PrismaModule,
    IncomeTypeRefModule,
    TaxModule,
    InvestmentModule,
    AccountModule,
    NetWorthModule,
  ],
})
export class AppModule {}
