import { api } from "@/utils/fetch.utils";
import type { InvestmentTypeRefResponseDto } from "@investments/shared";

const INVESTMENT_TYPES_REF_URL = "investment-types-ref";

export const getInvestmentTypesRefApi = () =>
  api<InvestmentTypeRefResponseDto[]>("GET", INVESTMENT_TYPES_REF_URL);
