import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  type InvestmentCategoryRefResponseDto,
  type UpdateReferenceLabelRequestDto,
  type CreateReferenceRequestDto,
} from '@investments/shared';
import { InvestmentCategoryRefService } from './investment-category-ref.service';

@Controller('investment-categories-ref')
export class InvestmentCategoryRefController {
  constructor(private readonly categoryService: InvestmentCategoryRefService) {}

  @Get()
  findAll(): Promise<InvestmentCategoryRefResponseDto[]> {
    return this.categoryService.findAll();
  }

  @Post()
  create(
    @Body() createDto: CreateReferenceRequestDto,
  ): Promise<InvestmentCategoryRefResponseDto> {
    return this.categoryService.create(createDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.categoryService.remove(Number(id));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateReferenceLabelRequestDto,
  ): Promise<InvestmentCategoryRefResponseDto> {
    return this.categoryService.update(Number(id), updateDto);
  }
}
