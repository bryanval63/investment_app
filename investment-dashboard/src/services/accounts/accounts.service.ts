import { api } from "@/utils/fetch.utils";
import type {
  AccountResponseDto,
  CreateAccountRequestDto,
} from "@investments/shared";

const ACCOUNTS_URL = "accounts";

export const getAccountsApi = () =>
  api<AccountResponseDto[]>("GET", `${ACCOUNTS_URL}`);

export const createAccountApi = (account: CreateAccountRequestDto) =>
  api<AccountResponseDto>("POST", ACCOUNTS_URL, account);
