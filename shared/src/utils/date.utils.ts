import { MONTHS } from "../constants/date.constant";
import type { Months } from "../types/date.type";

export const buildYearsUntilCurrent = (startYear = 2014): number[] =>
  Array.from(
    { length: new Date().getFullYear() - startYear + 1 },
    (_, i) => startYear + i,
  );

export const getCurrentYear = () => new Date().getFullYear();

export const getMonthIndex = (month: Months) =>
  MONTHS.findIndex((m) => m.code === month);

export const createDateNormalizedByMonthAndYear = (
  month: Months,
  year: number,
) => new Date(Date.UTC(year, getMonthIndex(month), 1));

export const createDateNormalized = (date: Date) =>
  new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
