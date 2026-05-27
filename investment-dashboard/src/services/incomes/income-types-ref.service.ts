import { api } from "@/utils/fetch.utils";
import type { IncomeTypeRefResponseDto } from "@investments/shared";

const INCOME_TYPES_REF_URL = "income-types-ref";

export const getIncomeTypesRefApi = () =>
  api<IncomeTypeRefResponseDto[]>("GET", INCOME_TYPES_REF_URL);
