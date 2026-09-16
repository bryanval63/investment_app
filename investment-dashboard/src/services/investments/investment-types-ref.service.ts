import { api } from "@/utils/fetch.utils";
import type {
  InvestmentTypeRefResponseDto,
  UpdateReferenceLabelRequestDto,
  CreateReferenceRequestDto,
} from "@investments/shared";

const INVESTMENT_TYPES_REF_URL = "investment-types-ref";

export const getInvestmentTypesRefApi = () =>
  api<InvestmentTypeRefResponseDto[]>("GET", INVESTMENT_TYPES_REF_URL);

export const patchInvestmentTypeRefApi = (
  id: number,
  payload: UpdateReferenceLabelRequestDto,
) =>
  api<InvestmentTypeRefResponseDto>(
    "PATCH",
    `${INVESTMENT_TYPES_REF_URL}/${id}`,
    payload,
  );

export const createInvestmentTypeRefApi = (
  payload: CreateReferenceRequestDto,
) =>
  api<InvestmentTypeRefResponseDto>("POST", INVESTMENT_TYPES_REF_URL, payload);

export const deleteInvestmentTypeRefApi = (id: number) =>
  api<void>("DELETE", `${INVESTMENT_TYPES_REF_URL}/${id}`);
