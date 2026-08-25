import { api } from "@/utils/fetch.utils";
import type {
  AccountResponseDto,
  CreateAccountRequestDto,
  UpdateAccountRequestDto,
} from "@investments/shared";

const ACCOUNTS_URL = "accounts";

export const getAccountsApi = () =>
  api<AccountResponseDto[]>("GET", `${ACCOUNTS_URL}`);

export const createAccountApi = (account: CreateAccountRequestDto) =>
  api<AccountResponseDto>("POST", ACCOUNTS_URL, account);

export const patchAccountApi = (id: number, account: UpdateAccountRequestDto) =>
  api<AccountResponseDto>("PATCH", `${ACCOUNTS_URL}/${id}`, account);
