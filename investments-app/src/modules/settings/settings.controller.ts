import { Body, Controller, Get, Put } from '@nestjs/common';
import {
  SettingResponseDto,
  UpdateSettingRequestDto,
} from '@investments/shared';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  findAll(): Promise<SettingResponseDto[]> {
    return this.settingsService.findAll();
  }

  @Put()
  update(
    @Body() setting: UpdateSettingRequestDto,
  ): Promise<SettingResponseDto> {
    return this.settingsService.update(setting);
  }
}
