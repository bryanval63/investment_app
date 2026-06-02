import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AccountResponseDto,
  CreateAccountRequestDto,
} from '@investments/shared';
import { SELECT_ACCOUNT_WITH_TYPE } from './account.select';
import { mapAccountToDto } from './account.mapper';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<AccountResponseDto[]> {
    const accounts = await this.prisma.account.findMany(
      SELECT_ACCOUNT_WITH_TYPE,
    );

    return mapAccountToDto(accounts);
  }

  async create(
    createAccountDto: CreateAccountRequestDto,
  ): Promise<AccountResponseDto> {
    // Find the investment type ref by code
    const investmentType = await this.prisma.investmentTypeRef.findUnique({
      where: { code: createAccountDto.type },
    });

    if (!investmentType) {
      throw new Error(`Investment type ${createAccountDto.type} not found`);
    }

    const account = await this.prisma.account.create({
      data: {
        name: createAccountDto.name,
        typeId: investmentType.id,
        category: createAccountDto.category,
      },
      select: SELECT_ACCOUNT_WITH_TYPE.select,
    });

    const [accountDto] = mapAccountToDto([account]);
    return accountDto;
  }
}
