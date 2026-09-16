import { api } from "@/utils/fetch.utils";
import type {
  InvestmentCategoryRefResponseDto,
  UpdateReferenceLabelRequestDto,
  CreateReferenceRequestDto,
} from "@investments/shared";

const INVESTMENT_CATEGORIES_REF_URL = "investment-categories-ref";

export const getInvestmentCategoriesRefApi = () =>
  api<InvestmentCategoryRefResponseDto[]>("GET", INVESTMENT_CATEGORIES_REF_URL);

export const patchInvestmentCategoryRefApi = (
  id: number,
  payload: UpdateReferenceLabelRequestDto,
) =>
  api<InvestmentCategoryRefResponseDto>(
    "PATCH",
    `${INVESTMENT_CATEGORIES_REF_URL}/${id}`,
    payload,
  );

export const createInvestmentCategoryRefApi = (
  payload: CreateReferenceRequestDto,
) =>
  api<InvestmentCategoryRefResponseDto>(
    "POST",
    INVESTMENT_CATEGORIES_REF_URL,
    payload,
  );

export const deleteInvestmentCategoryRefApi = (id: number) =>
  api<void>("DELETE", `${INVESTMENT_CATEGORIES_REF_URL}/${id}`);
