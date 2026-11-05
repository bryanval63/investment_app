import { MONTHS } from "../constants/date.constant";
import type { Months } from "../types/date.type";

export const getCurrentYear = () => new Date().getFullYear();

export const getCurrentMonthCode = (): Months =>
  MONTHS[new Date().getMonth()].code;

/** Timestamp du 1er janvier de l'année courante à minuit (heure locale). */
export const getStartOfCurrentYear = () =>
  new Date(getCurrentYear(), 0, 1).getTime();

export const buildYearsUntilCurrent = (startYear = 2014): number[] =>
  Array.from(
    { length: getCurrentYear() - startYear + 1 },
    (_, i) => startYear + i,
  );

export const getMonthIndex = (month: Months) =>
  MONTHS.findIndex((m) => m.code === month);

export const createDateNormalizedByMonthAndYear = (
  month: Months,
  year: number,
) => new Date(Date.UTC(year, getMonthIndex(month), 1));

export const createDateNormalized = (date: Date) =>
  new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
