import { INCOME_UNIT } from "../constants/income.constant";

export const IncomeType = {
  SALARY: "SALARY",
  PEE: "PEE",
  RESTAURANT_TICKETS: "RESTAURANT_TICKETS",
  BONUS: "BONUS",
  APL: "APL",
  PARKING_RENT: "PARKING_RENT",
  SCPI: "SCPI",
} as const;

export type IncomeUnit = (typeof INCOME_UNIT)[number]["code"];
