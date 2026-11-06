import { INCOME_UNIT } from "../constants/income.constant";

/** Code d'un type de revenu (référentiel modifiable dans les paramètres). */
export type IncomeTypeCode = string;

export type IncomeUnit = (typeof INCOME_UNIT)[number]["code"];
