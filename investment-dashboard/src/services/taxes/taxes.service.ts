import { api } from "@/utils/fetch.utils";
import type { TaxRequestDto } from "@investments/shared";

const TAXES = "taxes";

export const postTaxApi = (tax: TaxRequestDto) =>
  api<TaxRequestDto>("POST", TAXES, tax);
