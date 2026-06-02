import { Controller, Get } from '@nestjs/common';
import { InvestmentTypeRefService } from './investment-type-ref.service';

@Controller('investment-types-ref')
export class InvestmentTypeRefController {
  constructor(
    private readonly investmentTypeRefService: InvestmentTypeRefService,
  ) {}

  @Get()
  findAll() {
    return this.investmentTypeRefService.findAll();
  }
}
