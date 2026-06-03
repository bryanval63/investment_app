import type { InvestmentCategory } from "../../types/investments.type";

interface InvestmentTotalByMonthResponseDto {
  amount: number;
  amountDiff: number;
  avgDiff: number;
  performance: number;
  cumulativePerformance: number;
  date: Date;
}

export interface InvestmentTotalByMonthGroupByCategoryResponseDto extends InvestmentTotalByMonthResponseDto {
  category: InvestmentCategory;
}

export interface InvestmentTotalByMonthGroupByAccountResponseDto extends InvestmentTotalByMonthResponseDto {
  accountId: number;
  accountName: string;
  capitalGain: number;
}

interface InvestmentTotalByYearResponseDto {
  performance: number;
  amount: number;
  year: number;
}

export interface InvestmentTotalByYearGroupByCategoryResponseDto extends InvestmentTotalByYearResponseDto {
  category: InvestmentCategory;
}

export interface InvestmentTotalByYearGroupByAccountResponseDto extends InvestmentTotalByYearResponseDto {
  accountId: number;
}

export interface InvestmentOverviewResponseDto {
  totalAmount: number;
  totalCapitalGain: number;
  totalPerf: number;
  totalMonthAvg: number;
  avgYearlyPerf: number;
  currentYearCapitalGain: number;
  currentYearPerf: number;
  perfByAccount: {
    id: number;
    value: number;
  }[];
  perfByCategory: {
    code: InvestmentCategory;
    value: number;
  }[];
  worstMonth: {
    date: Date;
    perf: number;
    amount: number;
  };
  bestMonth: {
    date: Date;
    perf: number;
    amount: number;
  };
}
