import {
  findFirstItemByDate,
  findLastItemByDate,
  InvestmentTotalByMonthGroupByAccountResponseDto,
  InvestmentTotalByMonthGroupByCategoryResponseDto,
} from '@investments/shared';

export function getLastInvestmentCategory(
  investments: InvestmentTotalByMonthGroupByCategoryResponseDto[],
) {
  return findLastItemByDate(
    investments.filter((inv) => inv.category === 'ALL'),
  );
}

export function getFirstInvestmentCategory(
  investments: InvestmentTotalByMonthGroupByCategoryResponseDto[],
) {
  return findFirstItemByDate(
    investments.filter((inv) => inv.category === 'ALL'),
  );
}

export function computeCAGR(
  cumulative: number,
  startDate: Date,
  endDate: Date,
) {
  const start = startDate.getTime();
  const end = endDate.getTime();

  if (end < start) {
    console.warn('Dates inversées', { startDate, endDate });
    return 0;
  }

  const years = (end - start) / (1000 * 60 * 60 * 24 * 365.25);

  if (years <= 0) return 0;

  return Math.pow(1 + cumulative, 1 / years) - 1;
}

export function performanceByAccount(
  investments: InvestmentTotalByMonthGroupByAccountResponseDto[],
) {
  const grouped: Record<
    string,
    InvestmentTotalByMonthGroupByAccountResponseDto[]
  > = {};

  for (const item of investments) {
    if (!grouped[item.accountId]) {
      grouped[item.accountId] = [];
    }

    grouped[item.accountId].push(item);
  }

  const result: Record<string, number> = {};

  for (const accountId in grouped) {
    const accountData = grouped[accountId];

    const first = accountData[0];
    const last = accountData[accountData.length - 1];

    result[accountId] = computeCAGR(
      last.cumulativePerformance,
      first.date,
      last.date,
    );
  }

  return result;
}

export function performanceByCategory(
  investments: InvestmentTotalByMonthGroupByCategoryResponseDto[],
) {
  const grouped: Record<
    string,
    InvestmentTotalByMonthGroupByCategoryResponseDto[]
  > = {};

  for (const item of investments) {
    if (!grouped[item.category]) {
      grouped[item.category] = [];
    }

    grouped[item.category].push(item);
  }

  const result: Record<string, number> = {};

  for (const category in grouped) {
    const categoryData = grouped[category];

    const first = categoryData[0];
    const last = categoryData[categoryData.length - 1];

    result[category] = computeCAGR(
      last.cumulativePerformance,
      first.date,
      last.date,
    );
  }

  return result;
}

export function findInvestmentByDate(
  investments: InvestmentTotalByMonthGroupByCategoryResponseDto[],
  targetDate: Date,
) {
  return investments.find(
    (inv) =>
      inv.date.getTime() === targetDate.getTime() && inv.category === 'ALL',
  );
}
