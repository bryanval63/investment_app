import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  type CreateReferenceRequestDto,
  type IncomeTypeRefResponseDto,
  type UpdateReferenceLabelRequestDto,
} from '@investments/shared';
import { IncomeTypeRefService } from './income-type-ref.service';

@Controller('income-types-ref')
export class IncomeTypeRefController {
  constructor(private readonly incomeTypeService: IncomeTypeRefService) {}

  @Get()
  findAll(): Promise<IncomeTypeRefResponseDto[]> {
    return this.incomeTypeService.findAll();
  }

  @Post()
  create(
    @Body() createDto: CreateReferenceRequestDto,
  ): Promise<IncomeTypeRefResponseDto> {
    return this.incomeTypeService.create(createDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateReferenceLabelRequestDto,
  ): Promise<IncomeTypeRefResponseDto> {
    return this.incomeTypeService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.incomeTypeService.remove(id);
  }
}
