import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AccountResponseDto } from '@investments/shared';
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
}
