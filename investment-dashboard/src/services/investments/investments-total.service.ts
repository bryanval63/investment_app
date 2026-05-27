import { api } from "@/utils/fetch.utils";
import type {
  InvestmentColumnKey,
  InvestmentTotalByMonthGroupByAccountResponseDto,
  InvestmentTotalByMonthGroupByCategoryResponseDto,
  InvestmentTotalByYearGroupByAccountResponseDto,
  InvestmentTotalByYearGroupByCategoryResponseDto,
} from "@investments/shared";

const INVESTMENTS_TOTAL_URL = "investments/total";

export const getInvestmentsTotalGroupedByCategoryMonthlyApi = (
  unit: InvestmentColumnKey,
) =>
  api<InvestmentTotalByMonthGroupByCategoryResponseDto[]>(
    "GET",
    `${INVESTMENTS_TOTAL_URL}/grouped-by-category-monthly?unit=${unit}`,
  );

export const getInvestmentsTotalGroupedByCategoryYearlyApi = () =>
  api<InvestmentTotalByYearGroupByCategoryResponseDto[]>(
    "GET",
    `${INVESTMENTS_TOTAL_URL}/grouped-by-category-yearly`,
  );

export const getInvestmentsTotalGroupedByAccountYearlyApi = () =>
  api<InvestmentTotalByYearGroupByAccountResponseDto[]>(
    "GET",
    `${INVESTMENTS_TOTAL_URL}/grouped-by-account-yearly`,
  );

export const getInvestmentsTotalGroupedByAccountMonthlyApi = (
  unit: InvestmentColumnKey,
) =>
  api<InvestmentTotalByMonthGroupByAccountResponseDto[]>(
    "GET",
    `${INVESTMENTS_TOTAL_URL}/grouped-by-account-monthly?unit=${unit}`,
  );
