import { INVESTMENT_COLUMN_MAP } from "../constants/investments.constants";

export { InvestmentCategory } from "@prisma/client";

export type InvestmentColumnKey = (typeof INVESTMENT_COLUMN_MAP)[number];
