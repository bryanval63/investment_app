import { api } from "@/utils/fetch.utils";
import type { AccountResponseDto } from "@investments/shared";

const ACCOUNTS_URL = "accounts";

export const getAccountsApi = () =>
  api<AccountResponseDto[]>("GET", `${ACCOUNTS_URL}`);
