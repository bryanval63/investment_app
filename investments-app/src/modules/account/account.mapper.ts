import { AccountResponseDto } from '@investments/shared';
import { AccountWithType } from './account.type';

export const mapAccountToDto = (
  accounts: AccountWithType[],
): AccountResponseDto[] =>
  accounts.map(({ category, id, name, type, isClosed, openingDate }) => ({
    category,
    id,
    name,
    type: type.code,
    isClosed,
    openingDate: openingDate?.toISOString() ?? null,
  }));
