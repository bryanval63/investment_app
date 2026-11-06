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
  Query,
} from '@nestjs/common';
import { NetWorthService } from './net-worth.service';
import { parseOptionalInt } from '../investment/investment-list.utils';
import {
  type NetWorthRequestDto,
  NetWorthResponseDto,
} from '@investments/shared';

@Controller('net-worthes')
export class NetWorthController {
  constructor(private readonly netWorthService: NetWorthService) {}

  @Get()
  findAll(@Query('year') year?: string): Promise<NetWorthResponseDto[]> {
    return this.netWorthService.findAll(parseOptionalInt(year));
  }

  @Post()
  async create(
    @Body() netWorth: NetWorthRequestDto,
  ): Promise<{ success: boolean }> {
    await this.netWorthService.create(netWorth);
    return { success: true };
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() netWorth: NetWorthRequestDto,
  ): Promise<NetWorthResponseDto> {
    return this.netWorthService.update(id, netWorth);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.netWorthService.remove(id);
  }
}
