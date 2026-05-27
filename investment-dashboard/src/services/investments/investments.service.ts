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
