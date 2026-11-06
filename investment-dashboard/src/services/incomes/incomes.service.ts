import { getCurrentYear } from "@investments/shared/utils/date.utils";
import { api } from "@/utils/fetch.utils";
import type { IncomeRequestDto, IncomeResponseDto } from "@investments/shared";

const INCOMES_URL = "incomes";

export const getIncomesApi = (year = getCurrentYear()) =>
  api<IncomeResponseDto[]>("GET", `${INCOMES_URL}?year=${year}`);

export const postIncomesApi = (incomes: IncomeRequestDto[]) =>
  api<IncomeRequestDto[]>("POST", INCOMES_URL, incomes);

export const patchIncomeApi = (id: number, income: IncomeRequestDto) =>
  api<IncomeResponseDto>("PATCH", `${INCOMES_URL}/${id}`, income);

export const deleteIncomeApi = (id: number) =>
  api<void>("DELETE", `${INCOMES_URL}/${id}`);
