import { Body, Controller, Get, Post } from '@nestjs/common';
import { NetWorthService } from './net-worth.service';
import {
  type NetWorthRequestDto,
  NetWorthResponseDto,
} from '@investments/shared';

@Controller('net-worthes')
export class NetWorthController {
  constructor(private readonly netWorthService: NetWorthService) {}

  @Get()
  findAll(): Promise<NetWorthResponseDto[]> {
    return this.netWorthService.findAll();
  }

  @Post()
  async create(
    @Body() netWorth: NetWorthRequestDto,
  ): Promise<{ success: boolean }> {
    await this.netWorthService.create(netWorth);
    return { success: true };
  }
}
