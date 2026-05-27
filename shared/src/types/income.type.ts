import { INCOME_UNIT } from "../constants/income.constant";

export { IncomeType } from "@prisma/client";

export type IncomeUnit = (typeof INCOME_UNIT)[number]["code"];
