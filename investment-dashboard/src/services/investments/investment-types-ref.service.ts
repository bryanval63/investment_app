import type { InvestmentTypeRefResponseDto } from "@investments/shared";
import { createReferenceApi } from "../reference/reference-api.factory";

const investmentTypesRefApi =
  createReferenceApi<InvestmentTypeRefResponseDto>("investment-types-ref");

export const getInvestmentTypesRefApi = investmentTypesRefApi.getAll;
export const createInvestmentTypeRefApi = investmentTypesRefApi.create;
export const patchInvestmentTypeRefApi = investmentTypesRefApi.update;
export const deleteInvestmentTypeRefApi = investmentTypesRefApi.remove;
