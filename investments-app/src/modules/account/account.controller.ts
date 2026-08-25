import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import {
  type CreateAccountRequestDto,
  AccountResponseDto,
  type UpdateAccountRequestDto,
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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountRequestDto,
  ): Promise<AccountResponseDto> {
    return this.accountService.update(Number(id), updateAccountDto);
  }
}
