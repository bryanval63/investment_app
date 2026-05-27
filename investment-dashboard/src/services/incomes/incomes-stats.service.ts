import { api } from "@/utils/fetch.utils";
import type {
  IncomeGroupByDateResponseDto,
  IncomeGroupByTypeResponseDto,
  IncomeUnit,
} from "@investments/shared";

const INCOMES_STATS_URL = "incomes/stats";

export const getStatsGroupedByDateIncomesApi = (
  unit: IncomeUnit,
  hasTaxes: boolean,
) =>
  api<IncomeGroupByDateResponseDto[]>(
    "GET",
    `${INCOMES_STATS_URL}/grouped-by-date?unit=${unit}&withTaxes=${hasTaxes}`,
  );

export const getStatsGroupedByTypeIncomesApi = () =>
  api<IncomeGroupByTypeResponseDto[]>(
    "GET",
    `${INCOMES_STATS_URL}/grouped-by-type`,
  );
