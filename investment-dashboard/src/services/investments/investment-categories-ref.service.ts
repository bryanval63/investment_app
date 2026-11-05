import type { InvestmentCategoryRefResponseDto } from "@investments/shared";
import { createReferenceApi } from "../reference/reference-api.factory";

const investmentCategoriesRefApi =
  createReferenceApi<InvestmentCategoryRefResponseDto>(
    "investment-categories-ref",
  );

export const getInvestmentCategoriesRefApi = investmentCategoriesRefApi.getAll;
export const createInvestmentCategoryRefApi = investmentCategoriesRefApi.create;
export const patchInvestmentCategoryRefApi = investmentCategoriesRefApi.update;
export const deleteInvestmentCategoryRefApi = investmentCategoriesRefApi.remove;
