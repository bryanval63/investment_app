import { api } from "@/utils/fetch.utils";
import type {
  InvestmentListItemResponseDto,
  InvestmentOverviewResponseDto,
  InvestmentRequestDto,
} from "@investments/shared";

const INVESTMENTS_URL = "investments";

export const postInvestmentsApi = (investments: InvestmentRequestDto[]) =>
  api<InvestmentRequestDto[]>("POST", INVESTMENTS_URL, investments);

export const getInvestmentsOverviewApi = (previousMonth = false) =>
  api<InvestmentOverviewResponseDto>(
    "GET",
    `${INVESTMENTS_URL}/overview${previousMonth ? "?period=previous-month" : ""}`,
  );

export type InvestmentsListFilters = {
  accountId?: number;
  year?: number;
};

export const getInvestmentsApi = ({
  accountId,
  year,
}: InvestmentsListFilters = {}) => {
  const params = new URLSearchParams();
  if (accountId !== undefined) params.set("accountId", accountId.toString());
  if (year !== undefined) params.set("year", year.toString());
  const query = params.toString();

  return api<InvestmentListItemResponseDto[]>(
    "GET",
    `${INVESTMENTS_URL}${query ? `?${query}` : ""}`,
  );
};

export const patchInvestmentApi = (
  id: number,
  investment: InvestmentRequestDto,
) => api<InvestmentRequestDto>("PATCH", `${INVESTMENTS_URL}/${id}`, investment);

export const deleteInvestmentApi = (id: number) =>
  api<void>("DELETE", `${INVESTMENTS_URL}/${id}`);
