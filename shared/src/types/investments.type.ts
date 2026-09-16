import { INVESTMENT_COLUMN_MAP } from "../constants/investments.constants";

export type InvestmentCategory = string;

export type InvestmentColumnKey = (typeof INVESTMENT_COLUMN_MAP)[number];
