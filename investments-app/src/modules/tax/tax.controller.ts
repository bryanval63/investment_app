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
import { TaxService } from './tax.service';
import { type TaxRequestDto, type TaxResponseDto } from '@investments/shared';

@Controller('taxes')
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  @Get()
  findAll(): Promise<TaxResponseDto[]> {
    return this.taxService.findAll();
  }

  @Post()
  async create(@Body() tax: TaxRequestDto): Promise<{ success: boolean }> {
    await this.taxService.create(tax);
    return { success: true };
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() tax: TaxRequestDto,
  ): Promise<TaxResponseDto> {
    return this.taxService.update(id, tax);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.taxService.remove(id);
  }
}
