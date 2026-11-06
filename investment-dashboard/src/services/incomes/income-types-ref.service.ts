import type { IncomeTypeRefResponseDto } from "@investments/shared";
import { createReferenceApi } from "../reference/reference-api.factory";

const incomeTypesRefApi =
  createReferenceApi<IncomeTypeRefResponseDto>("income-types-ref");

export const getIncomeTypesRefApi = incomeTypesRefApi.getAll;
export const createIncomeTypeRefApi = incomeTypesRefApi.create;
export const patchIncomeTypeRefApi = incomeTypesRefApi.update;
export const deleteIncomeTypeRefApi = incomeTypesRefApi.remove;
