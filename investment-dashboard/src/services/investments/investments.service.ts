import { api } from "@/utils/fetch.utils";
import type {
  InvestmentOverviewResponseDto,
  InvestmentRequestDto,
} from "@investments/shared";

const INVESTMENTS_URL = "investments";

export const postInvestmentsApi = (investments: InvestmentRequestDto[]) =>
  api<InvestmentRequestDto[]>("POST", INVESTMENTS_URL, investments);

export const getInvestmentsOverviewApi = () =>
  api<InvestmentOverviewResponseDto>("GET", `${INVESTMENTS_URL}/overview`);

export const getInvestmentsApi = (accountId?: number) =>
  api<any>(
    "GET",
    `${INVESTMENTS_URL}${accountId ? `?accountId=${accountId}` : ""}`,
  );

export const patchInvestmentApi = (
  id: number,
  investment: InvestmentRequestDto,
) => api<InvestmentRequestDto>("PATCH", `${INVESTMENTS_URL}/${id}`, investment);

export const deleteInvestmentApi = (id: number) =>
  api<void>("DELETE", `${INVESTMENTS_URL}/${id}`);
