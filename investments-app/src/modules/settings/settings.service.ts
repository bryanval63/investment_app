import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  SettingResponseDto,
  UpdateSettingRequestDto,
} from '@investments/shared';

export const SETTING_KEYS = {
  SOCIAL_CONTRIBUTIONS_RATE: 'SOCIAL_CONTRIBUTIONS_RATE',
  INCOME_TAX_RATE: 'INCOME_TAX_RATE',
  LIFE_INSURANCE_ALLOWANCE: 'LIFE_INSURANCE_ALLOWANCE',
  LIFE_INSURANCE_SOCIAL_CONTRIBUTIONS_RATE:
    'LIFE_INSURANCE_SOCIAL_CONTRIBUTIONS_RATE',
  LIFE_INSURANCE_REDUCED_INCOME_TAX_RATE:
    'LIFE_INSURANCE_REDUCED_INCOME_TAX_RATE',
  LIFE_INSURANCE_CONTRIBUTION_THRESHOLD:
    'LIFE_INSURANCE_CONTRIBUTION_THRESHOLD',
  LIFE_INSURANCE_ALLOWANCE_DURATION_YEARS:
    'LIFE_INSURANCE_ALLOWANCE_DURATION_YEARS',
  LIFE_INSURANCE_COUPLE_ALLOWANCE_MULTIPLIER:
    'LIFE_INSURANCE_COUPLE_ALLOWANCE_MULTIPLIER',
  PEA_ALLOWANCE_DURATION_YEARS: 'PEA_ALLOWANCE_DURATION_YEARS',
  CRYPTO_CESSION_THRESHOLD: 'CRYPTO_CESSION_THRESHOLD',
  ENTRY_FEE_RATE: 'ENTRY_FEE_RATE',
} as const;

const DEFAULT_SETTINGS = [
  {
    key: SETTING_KEYS.SOCIAL_CONTRIBUTIONS_RATE,
    scope: 'GLOBAL',
    value: 0.186,
  },
  { key: SETTING_KEYS.INCOME_TAX_RATE, scope: 'GLOBAL', value: 0.128 },
  {
    key: SETTING_KEYS.LIFE_INSURANCE_ALLOWANCE,
    scope: 'GLOBAL',
    value: 4600,
  },
  {
    key: SETTING_KEYS.LIFE_INSURANCE_SOCIAL_CONTRIBUTIONS_RATE,
    scope: 'GLOBAL',
    value: 0.172,
  },
  {
    key: SETTING_KEYS.LIFE_INSURANCE_REDUCED_INCOME_TAX_RATE,
    scope: 'GLOBAL',
    value: 0.075,
  },
  {
    key: SETTING_KEYS.LIFE_INSURANCE_CONTRIBUTION_THRESHOLD,
    scope: 'GLOBAL',
    value: 150000,
  },
  {
    key: SETTING_KEYS.LIFE_INSURANCE_ALLOWANCE_DURATION_YEARS,
    scope: 'GLOBAL',
    value: 8,
  },
  {
    key: SETTING_KEYS.LIFE_INSURANCE_COUPLE_ALLOWANCE_MULTIPLIER,
    scope: 'GLOBAL',
    value: 2,
  },
  {
    key: SETTING_KEYS.PEA_ALLOWANCE_DURATION_YEARS,
    scope: 'GLOBAL',
    value: 5,
  },
  {
    key: SETTING_KEYS.CRYPTO_CESSION_THRESHOLD,
    scope: 'GLOBAL',
    value: 305,
  },
  { key: SETTING_KEYS.ENTRY_FEE_RATE, scope: 'Corum Origin', value: 0.11966 },
  { key: SETTING_KEYS.ENTRY_FEE_RATE, scope: 'Corum XL', value: 0.12 },
];

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<SettingResponseDto[]> {
    await this.prisma.$transaction(
      DEFAULT_SETTINGS.map((setting) =>
        this.prisma.investmentSetting.upsert({
          where: {
            key_scope: {
              key: setting.key,
              scope: setting.scope,
            },
          },
          create: setting,
          update: {},
        }),
      ),
    );

    return this.prisma.investmentSetting.findMany({
      orderBy: [{ scope: 'asc' }, { key: 'asc' }],
      select: { key: true, scope: true, value: true },
    });
  }

  async update(setting: UpdateSettingRequestDto): Promise<SettingResponseDto> {
    if (
      !setting.key ||
      !setting.scope ||
      !Number.isFinite(setting.value) ||
      setting.value < 0
    ) {
      throw new Error('Invalid investment setting');
    }

    return this.prisma.investmentSetting.upsert({
      where: { key_scope: { key: setting.key, scope: setting.scope } },
      create: setting,
      update: { value: setting.value },
      select: { key: true, scope: true, value: true },
    });
  }
}
