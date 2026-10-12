import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AccountResponseDto,
  CreateAccountRequestDto,
  UpdateAccountRequestDto,
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
    this.validateDefaultTransactionAmount(
      createAccountDto.defaultTransactionAmount,
    );

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
        openingDate: createAccountDto.openingDate
          ? new Date(createAccountDto.openingDate)
          : undefined,
        defaultTransactionAmount:
          createAccountDto.defaultTransactionAmount ?? 0,
      },
      select: SELECT_ACCOUNT_WITH_TYPE.select,
    });

    const [accountDto] = mapAccountToDto([account]);
    return accountDto;
  }

  async update(
    id: number,
    updateAccountDto: UpdateAccountRequestDto,
  ): Promise<AccountResponseDto> {
    this.validateDefaultTransactionAmount(
      updateAccountDto.defaultTransactionAmount,
    );

    const investmentType = await this.prisma.investmentTypeRef.findUnique({
      where: { code: updateAccountDto.type },
    });

    if (!investmentType) {
      throw new Error(`Investment type ${updateAccountDto.type} not found`);
    }

    const account = await this.prisma.account.update({
      where: { id },
      data: {
        name: updateAccountDto.name,
        typeId: investmentType.id,
        category: updateAccountDto.category,
        isClosed: updateAccountDto.isClosed,
        openingDate: updateAccountDto.openingDate
          ? new Date(updateAccountDto.openingDate)
          : null,
        defaultTransactionAmount: updateAccountDto.defaultTransactionAmount,
      },
      select: SELECT_ACCOUNT_WITH_TYPE.select,
    });

    const [accountDto] = mapAccountToDto([account]);
    return accountDto;
  }

  private validateDefaultTransactionAmount(amount?: number): void {
    if (amount !== undefined && (!Number.isFinite(amount) || amount < 0)) {
      throw new Error(
        'Default transaction amount must be a non-negative number',
      );
    }
  }
}
