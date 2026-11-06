import { api } from "@/utils/fetch.utils";
import type { TaxRequestDto, TaxResponseDto } from "@investments/shared";

const TAXES = "taxes";

export const getTaxesApi = () => api<TaxResponseDto[]>("GET", TAXES);

export const postTaxApi = (tax: TaxRequestDto) =>
  api<TaxRequestDto>("POST", TAXES, tax);

export const patchTaxApi = (id: number, tax: TaxRequestDto) =>
  api<TaxResponseDto>("PATCH", `${TAXES}/${id}`, tax);

export const deleteTaxApi = (id: number) =>
  api<void>("DELETE", `${TAXES}/${id}`);
