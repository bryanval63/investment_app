import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { InvestmentTypeRefService } from './investment-type-ref.service';
import {
  type InvestmentTypeRefResponseDto,
  type UpdateReferenceLabelRequestDto,
  type CreateReferenceRequestDto,
} from '@investments/shared';

@Controller('investment-types-ref')
export class InvestmentTypeRefController {
  constructor(
    private readonly investmentTypeRefService: InvestmentTypeRefService,
  ) {}

  @Get()
  findAll() {
    return this.investmentTypeRefService.findAll();
  }

  @Post()
  create(
    @Body() createDto: CreateReferenceRequestDto,
  ): Promise<InvestmentTypeRefResponseDto> {
    return this.investmentTypeRefService.create(createDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.investmentTypeRefService.remove(Number(id));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateReferenceLabelRequestDto,
  ): Promise<InvestmentTypeRefResponseDto> {
    return this.investmentTypeRefService.update(Number(id), updateDto);
  }
}
