import { Controller, Get, Post, Body } from '@nestjs/common';
import { AccountService } from './account.service';
import {
  type CreateAccountRequestDto,
  AccountResponseDto,
} from '@investments/shared';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  findAll(): Promise<AccountResponseDto[]> {
    return this.accountService.findAll();
  }

  @Post()
  create(
    @Body() createAccountDto: CreateAccountRequestDto,
  ): Promise<AccountResponseDto> {
    return this.accountService.create(createAccountDto);
  }
}
