import { Body, Controller, Post } from '@nestjs/common';
import { TaxService } from './tax.service';
import { type TaxRequestDto } from '@investments/shared';

@Controller('taxes')
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  @Post()
  async create(@Body() tax: TaxRequestDto): Promise<{ success: boolean }> {
    await this.taxService.create(tax);
    return { success: true };
  }
}
