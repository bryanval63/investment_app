import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  getCurrentYear,
  InvestmentCategory,
  InvestmentColumnKey,
  InvestmentOverviewResponseDto,
  InvestmentRequestDto,
  InvestmentTotalByMonthGroupByAccountResponseDto,
  InvestmentTotalByMonthGroupByCategoryResponseDto,
  InvestmentTotalByYearGroupByAccountResponseDto,
  InvestmentTotalByYearGroupByCategoryResponseDto,
} from '@investments/shared';
import { COLUMN_MAP } from './investment.constant';
import {
  computeCAGR,
  findInvestmentByDate,
  getFirstInvestmentCategory,
  getLastInvestmentCategory,
  performanceByAccount,
  performanceByCategory,
} from './investment.utils';
import {
  calculateInvestmentEntryFee,
  calculateInvestmentTax,
  DEFAULT_INCOME_TAX_RATE,
  DEFAULT_LIFE_INSURANCE_ALLOWANCE,
  DEFAULT_LIFE_INSURANCE_ALLOWANCE_DURATION_YEARS,
  DEFAULT_LIFE_INSURANCE_REDUCED_INCOME_TAX_RATE,
  DEFAULT_LIFE_INSURANCE_SOCIAL_CONTRIBUTIONS_RATE,
  DEFAULT_LIFE_INSURANCE_THRESHOLD,
  DEFAULT_LIFE_INSURANCE_COUPLE_ALLOWANCE_MULTIPLIER,
  DEFAULT_PEA_ALLOWANCE_DURATION_YEARS,
  DEFAULT_CRYPTO_CESSION_THRESHOLD,
  DEFAULT_SOCIAL_CONTRIBUTIONS_RATE,
} from './tax.utils';
import { SETTING_KEYS, SettingsService } from '../settings/settings.service';

@Injectable()
export class InvestmentService {
  constructor(
    private prisma: PrismaService,
    private settingsService: SettingsService,
  ) {}

  private getFullYearsBetween(
    startDate: Date | undefined,
    endDate: Date,
  ): number {
    if (!startDate) {
      return 0;
    }

    const start = new Date(startDate);
    let years = endDate.getFullYear() - start.getFullYear();
    const anniversary = new Date(start);
    anniversary.setFullYear(start.getFullYear() + years);
    if (anniversary > endDate) {
      years -= 1;
    }
    return Math.max(0, years);
  }

  async getOverview(
    previousMonth = false,
  ): Promise<InvestmentOverviewResponseDto> {
    const resultTotalAmountCategory =
      await this.findTotalByMonthGroupedByCategory('totalAmount');

    const resultCapitalGainCategory =
      await this.findTotalByMonthGroupedByCategory('capitalGain');

    const resultYearlyCategory = await this.findTotalByYearGroupedByCategory();

    const resultTotalAmountAccount =
      await this.findTotalByMonthGroupedByAccount('totalAmount');

    const latestAvailableDate = resultTotalAmountCategory
      .filter((item) => item.category === 'ALL')
      .reduce<Date | undefined>((latest, item) => {
        const itemDate = new Date(item.date);
        return !latest || itemDate > latest ? itemDate : latest;
      }, undefined);
    const cutoffDate =
      previousMonth && latestAvailableDate
        ? new Date(
            latestAvailableDate.getFullYear(),
            latestAvailableDate.getMonth(),
            0,
            23,
            59,
            59,
            999,
          )
        : undefined;
    const filterByCutoff = <T extends { date: Date }>(items: T[]) =>
      cutoffDate
        ? items.filter(
            (item) => new Date(item.date).getTime() <= cutoffDate.getTime(),
          )
        : items;

    const filteredTotalAmountCategory = filterByCutoff(
      resultTotalAmountCategory,
    );
    const filteredCapitalGainCategory = filterByCutoff(
      resultCapitalGainCategory,
    );
    const filteredTotalAmountAccount = filterByCutoff(resultTotalAmountAccount);
    const latestNetAmount = filteredTotalAmountAccount
      .filter((item) => item.accountId > 0)
      .reduce((latest, item) => {
        const current = latest.get(item.accountId);
        if (!current || new Date(item.date) > new Date(current.date)) {
          latest.set(item.accountId, item);
        }
        return latest;
      }, new Map<number, InvestmentTotalByMonthGroupByAccountResponseDto>());
    const totalNetAmount = [...latestNetAmount.values()].reduce(
      (sum, item) => sum + item.netAmount,
      0,
    );

    const perfByAccount = performanceByAccount(filteredTotalAmountAccount);

    const perfByCategory = performanceByCategory(filteredTotalAmountCategory);

    if (
      filteredTotalAmountCategory.length === 0 ||
      filteredCapitalGainCategory.length === 0
    ) {
      return {
        totalAmount: 0,
        totalNetAmount: 0,
        totalCapitalGain: 0,
        totalPerf: 0,
        totalMonthAvg: 0,
        avgYearlyPerf: 0,
        currentYearCapitalGain: 0,
        currentYearPerf: 0,
        perfByAccount: [],
        perfByCategory: [],
        worstMonth: { date: new Date(), perf: 0, amount: 0 },
        bestMonth: { date: new Date(), perf: 0, amount: 0 },
      };
    }

    const latestInvestmentTotalAmount = getLastInvestmentCategory(
      filteredTotalAmountCategory,
    );

    const firstInvestmentTotalAmount = getFirstInvestmentCategory(
      filteredTotalAmountCategory,
    );

    const latestInvestmentCapitalGain = getLastInvestmentCategory(
      filteredCapitalGainCategory,
    );

    const filteredYearly = resultYearlyCategory.filter(
      (inv) =>
        inv.category === 'ALL' &&
        inv.year > 2022 &&
        (!cutoffDate || inv.year < cutoffDate.getFullYear()),
    );

    const averageYearlyPerf = computeCAGR(
      latestInvestmentTotalAmount.cumulativePerformance,
      firstInvestmentTotalAmount.date,
      latestInvestmentTotalAmount.date,
    );

    const currentYear = cutoffDate?.getFullYear() ?? getCurrentYear();
    const currentYearCapitalGainRows = filteredCapitalGainCategory.filter(
      (inv) =>
        inv.category === 'ALL' &&
        new Date(inv.date).getFullYear() === currentYear,
    );
    const currentYearPerformanceRows = filteredTotalAmountCategory.filter(
      (inv) =>
        inv.category === 'ALL' &&
        new Date(inv.date).getFullYear() === currentYear,
    );
    const currentYearCapitalGain = currentYearCapitalGainRows.reduce(
      (sum, current) => sum + Number(current.amountDiff),
      0,
    );
    const currentYearPerf = currentYearPerformanceRows.reduce(
      (performance, current) =>
        current.performance <= -1
          ? -1
          : (1 + performance) * (1 + Number(current.performance)) - 1,
      0,
    );

    const yearlyCurrentYear = filteredYearly.find(
      (inv) => Number(inv.year) === currentYear,
    );
    const amount = cutoffDate
      ? currentYearCapitalGain
      : yearlyCurrentYear?.amount || 0;
    const performance = cutoffDate
      ? currentYearPerf
      : yearlyCurrentYear?.performance || 0;

    const findWorstMonth = filteredTotalAmountCategory
      .filter((inv) => inv.category === 'ALL')
      .reduce(
        (worst, current) => {
          return current.performance < worst.performance ? current : worst;
        },
        {
          date: new Date(),
          performance: 0,
          amount: 0,
          amountDiff: 0,
          avgDiff: 0,
          cumulativePerformance: 0,
          category: 'ALL' as InvestmentCategory,
        },
      );

    const findBestMonth = filteredTotalAmountCategory
      .filter((inv) => inv.category === 'ALL')
      .reduce(
        (best, current) => {
          return current.performance > best.performance ? current : best;
        },
        {
          date: new Date(),
          performance: 0,
          amount: 0,
          amountDiff: 0,
          avgDiff: 0,
          cumulativePerformance: 0,
          category: 'ALL' as InvestmentCategory,
        },
      );

    const defaultMonth = { date: new Date(), perf: 0, amount: 0 };

    return {
      totalAmount: latestInvestmentTotalAmount.amount,
      totalNetAmount,
      totalCapitalGain: latestInvestmentCapitalGain.amount,
      totalPerf: latestInvestmentTotalAmount.cumulativePerformance,
      totalMonthAvg: latestInvestmentCapitalGain.avgDiff,
      avgYearlyPerf: averageYearlyPerf,
      currentYearCapitalGain: amount,
      currentYearPerf: performance,
      perfByAccount: Object.entries(perfByAccount)
        .map(([key, value]) => ({
          id: Number(key),
          value,
        }))
        .sort((a, b) => b.value - a.value),
      perfByCategory: Object.entries(perfByCategory)
        .map(([key, value]) => ({
          code: key as InvestmentCategory,
          value,
        }))
        .sort((a, b) => b.value - a.value),
      worstMonth: findWorstMonth
        ? {
            date: findWorstMonth.date,
            perf: findWorstMonth.performance,
            amount:
              findInvestmentByDate(
                filteredCapitalGainCategory,
                findWorstMonth.date,
              )?.amountDiff || 0,
          }
        : defaultMonth,
      bestMonth: findBestMonth
        ? {
            date: findBestMonth.date,
            perf: findBestMonth.performance,
            amount:
              findInvestmentByDate(
                filteredCapitalGainCategory,
                findBestMonth.date,
              )?.amountDiff || 0,
          }
        : defaultMonth,
    };
  }

  findTotalByMonthGroupedByCategory(
    unit: InvestmentColumnKey,
  ): Promise<InvestmentTotalByMonthGroupByCategoryResponseDto[]> {
    const column = COLUMN_MAP[unit];

    return this.prisma.$queryRaw<
      InvestmentTotalByMonthGroupByCategoryResponseDto[]
    >`
      SELECT
        category,
        date,
        amount,
        amountDiff,

        CASE
          WHEN prevAmount IS NULL OR prevAmount = 0 THEN 0
          ELSE (amountDiff - transactionAmount) / prevAmount
        END * 1.0 as performance,

        COALESCE(
          AVG(NULLIF(amountDiff, 0)) OVER (
            PARTITION BY category
            ORDER BY date
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
          ),
          0
        ) * 1.0 as avgDiff,

        CASE
          WHEN (
            CASE
              WHEN prevAmount IS NULL OR prevAmount = 0 THEN 0
              ELSE (amountDiff - transactionAmount) * 1.0 / prevAmount
            END
          ) <= -1 THEN -1
          ELSE
            EXP(
              SUM(
                LN(
                  1 + (
                    CASE
                      WHEN prevAmount IS NULL OR prevAmount = 0 THEN 0
                      ELSE (amountDiff - transactionAmount) * 1.0 / prevAmount
                    END
                  )
                )
              ) OVER (
                PARTITION BY category
                ORDER BY date
                ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
              )
            ) - 1
        END * 1.0 as cumulativePerformance

      FROM (
        SELECT
          category,
          date,
          amount,
          transactionAmount,
          prevAmount,

          COALESCE(amount - prevAmount, 0) * 1.0 as amountDiff

        FROM (
          SELECT
            category,
            date,
            amount,
            transactionAmount,

            LAG(amount) OVER (
              PARTITION BY category
              ORDER BY date
            ) as prevAmount

          FROM (
            SELECT
              a.category,
              i.date,
              SUM(${column}) * 1.0 as amount,
              SUM(i.transactionAmount) * 1.0 as transactionAmount
            FROM "Investment" i
            JOIN "Account" a ON i."accountId" = a.id
            GROUP BY a.category, i.date

            UNION ALL

            SELECT
              'ALL' as category,
              i.date,
              SUM(${column}) * 1.0 as amount,
              SUM(i.transactionAmount) * 1.0 as transactionAmount
            FROM "Investment" i
            GROUP BY i.date
          )
        )
      )

      ORDER BY category, date ASC;
    `;
  }

  async findTotalByMonthGroupedByAccount(
    unit: InvestmentColumnKey,
  ): Promise<InvestmentTotalByMonthGroupByAccountResponseDto[]> {
    const column = COLUMN_MAP[unit];

    const result = await this.prisma.$queryRaw<
      InvestmentTotalByMonthGroupByAccountResponseDto[]
    >`
      SELECT
        accountId,
        accountName,
        date,
        amount,
        amountDiff,
        capitalGain,

        CASE
          WHEN prevAmount IS NULL OR prevAmount = 0 THEN 0
          ELSE (amountDiff - transactionAmount) / prevAmount
        END * 1.0 as performance,

        COALESCE(
          AVG(NULLIF(amountDiff, 0)) OVER (
            PARTITION BY accountId
            ORDER BY date
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
          ),
          0
        ) * 1.0 as avgDiff,

        CASE
          WHEN (
            CASE
              WHEN prevAmount IS NULL OR prevAmount = 0 THEN 0
              ELSE (amountDiff - transactionAmount) * 1.0 / prevAmount
            END
          ) <= -1 THEN -1
          ELSE
            EXP(
              SUM(
                LN(
                  1 + (
                    CASE
                      WHEN prevAmount IS NULL OR prevAmount = 0 THEN 0
                      ELSE (amountDiff - transactionAmount) * 1.0 / prevAmount
                    END
                  )
                )
              ) OVER (
                PARTITION BY accountId
                ORDER BY date
                ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
              )
            ) - 1
        END * 1.0 as cumulativePerformance

      FROM (
        SELECT
          accountId,
          accountName,
          date,
          amount,
          transactionAmount,
          prevAmount,
          capitalGain,
          
          COALESCE(amount - prevAmount, 0) * 1.0 as amountDiff

        FROM (
          SELECT
            accountId,
            accountName,
            date,
            amount,
            transactionAmount,
            capitalGain,

            LAG(amount) OVER (
              PARTITION BY accountId
              ORDER BY date
            ) as prevAmount

          FROM (
            SELECT
              a.id as accountId,
              a.name as accountName,
              i.date,
              SUM(${column}) * 1.0 as amount,
              SUM(i.transactionAmount) * 1.0 as transactionAmount,
              SUM(i.capitalGain) * 1.0 as capitalGain
            FROM "Investment" i
            JOIN "Account" a ON i."accountId" = a.id
            GROUP BY a.id, a.name, i.date
          )
        )
      )

      ORDER BY accountId, date ASC;
    `;

    const accounts = await this.prisma.account.findMany({
      select: {
        id: true,
        name: true,
        type: { select: { code: true } },
        openingDate: true,
        investments: {
          orderBy: { date: 'asc' },
          take: 1,
          select: { date: true },
        },
      },
    });
    const settings = await this.settingsService.findAll();
    const globalSettings = new Map(
      settings
        .filter((setting) => setting.scope === 'GLOBAL')
        .map((setting) => [setting.key, setting.value]),
    );
    const taxSettings = {
      socialContributionsRate:
        globalSettings.get(SETTING_KEYS.SOCIAL_CONTRIBUTIONS_RATE) ??
        DEFAULT_SOCIAL_CONTRIBUTIONS_RATE,
      incomeTaxRate:
        globalSettings.get(SETTING_KEYS.INCOME_TAX_RATE) ??
        DEFAULT_INCOME_TAX_RATE,
      lifeInsuranceAllowance:
        globalSettings.get(SETTING_KEYS.LIFE_INSURANCE_ALLOWANCE) ??
        DEFAULT_LIFE_INSURANCE_ALLOWANCE,
      lifeInsuranceSocialContributionsRate:
        globalSettings.get(SETTING_KEYS.LIFE_INSURANCE_SOCIAL_CONTRIBUTIONS_RATE) ??
        DEFAULT_LIFE_INSURANCE_SOCIAL_CONTRIBUTIONS_RATE,
      lifeInsuranceReducedIncomeTaxRate:
        globalSettings.get(SETTING_KEYS.LIFE_INSURANCE_REDUCED_INCOME_TAX_RATE) ??
        DEFAULT_LIFE_INSURANCE_REDUCED_INCOME_TAX_RATE,
      lifeInsuranceContributionThreshold:
        globalSettings.get(SETTING_KEYS.LIFE_INSURANCE_CONTRIBUTION_THRESHOLD) ??
        DEFAULT_LIFE_INSURANCE_THRESHOLD,
      lifeInsuranceAllowanceDurationYears:
        globalSettings.get(
          SETTING_KEYS.LIFE_INSURANCE_ALLOWANCE_DURATION_YEARS,
        ) ?? DEFAULT_LIFE_INSURANCE_ALLOWANCE_DURATION_YEARS,
      lifeInsuranceCoupleAllowanceMultiplier:
        globalSettings.get(
          SETTING_KEYS.LIFE_INSURANCE_COUPLE_ALLOWANCE_MULTIPLIER,
        ) ?? DEFAULT_LIFE_INSURANCE_COUPLE_ALLOWANCE_MULTIPLIER,
      peaAllowanceDurationYears:
        globalSettings.get(SETTING_KEYS.PEA_ALLOWANCE_DURATION_YEARS) ??
        DEFAULT_PEA_ALLOWANCE_DURATION_YEARS,
      cryptoCessionThreshold:
        globalSettings.get(SETTING_KEYS.CRYPTO_CESSION_THRESHOLD) ??
        DEFAULT_CRYPTO_CESSION_THRESHOLD,
    };
    const accountTaxInfo = new Map(
      accounts.map((account) => [
        account.id,
        {
          type: account.type.code,
          openingDate: account.openingDate,
          firstInvestmentDate: account.investments[0]?.date,
        },
      ]),
    );

    return result.map((row) => {
      const taxInfo = accountTaxInfo.get(Number(row.accountId));
      const taxAmount = taxInfo?.type
        ? calculateInvestmentTax({
            type: taxInfo.type,
            capitalGain: Number(row.capitalGain),
            value: Number(row.amount),
            durationInYears:
              taxInfo.firstInvestmentDate &&
              ['LIFE_INSURANCE', 'PEA'].includes(taxInfo.type)
                ? this.getFullYearsBetween(
                    taxInfo.openingDate ?? taxInfo.firstInvestmentDate,
                    new Date(row.date),
                  )
                : undefined,
            totalContributions:
              taxInfo.type === 'LIFE_INSURANCE'
                ? Math.max(0, Number(row.amount) - Number(row.capitalGain))
                : undefined,
            totalCessions:
              taxInfo.type === 'CRYPTO' ? Math.max(0, Number(row.amount)) : undefined,
            settings: taxSettings,
          })
        : 0;
      const entryFee = taxInfo?.type
        ? calculateInvestmentEntryFee({
            type: taxInfo.type,
            accountName: row.accountName,
            amount: Number(row.amount),
            entryFeeRate: settings.find(
              (setting) =>
                setting.key === SETTING_KEYS.ENTRY_FEE_RATE &&
                setting.scope === row.accountName,
            )?.value,
          })
        : 0;

      return {
        ...row,
        accountId: Number(row.accountId),
        amount: Number(row.amount),
        capitalGain: Number(row.capitalGain),
        taxAmount: taxAmount + entryFee,
        netAmount: Number(row.amount) - taxAmount - entryFee,
      };
    });
  }

  findTotalByYearGroupedByCategory(): Promise<
    InvestmentTotalByYearGroupByCategoryResponseDto[]
  > {
    return this.prisma.$queryRaw<
      InvestmentTotalByYearGroupByCategoryResponseDto[]
    >`
      SELECT
        category,
        year,

        SUM(amountDiff) as amount,

        EXP(
          SUM(
            LN(1 + performance)
          )
        ) - 1 as performance

      FROM (
        SELECT
          category,
          year,
          month,
          amount,
          transactionAmount,

          COALESCE(
            amount - LAG(amount) OVER (
              PARTITION BY category
              ORDER BY month
            ),
            0
          ) as amountDiff,

          CASE
            WHEN prevTotalAmount IS NULL OR prevTotalAmount = 0 THEN 0
            ELSE (totalAmount - prevTotalAmount - transactionAmount) * 1.0 / prevTotalAmount
          END as performance

        FROM (
          SELECT
            category,
            year,
            month,
            amount,
            totalAmount,
            transactionAmount,

            LAG(totalAmount) OVER (
              PARTITION BY category
              ORDER BY month
            ) as prevTotalAmount

          FROM (
            SELECT
              a.category,
              strftime('%Y-%m', i.date) as month,
              strftime('%Y', i.date) as year,
              SUM(i.capitalGain) * 1.0 as amount,
              SUM(i.totalAmount) * 1.0 as totalAmount,
              SUM(i.transactionAmount) * 1.0 as transactionAmount
            FROM "Investment" i
            JOIN "Account" a ON i."accountId" = a.id
            GROUP BY a.category, month

            UNION ALL

            SELECT
              'ALL' as category,
              strftime('%Y-%m', i.date) as month,
              strftime('%Y', i.date) as year,
              SUM(i.capitalGain) * 1.0 as amount,
              SUM(i.totalAmount) * 1.0 as totalAmount,
              SUM(i.transactionAmount) * 1.0 as transactionAmount
            FROM "Investment" i
            GROUP BY month
          )
        )
      )

      GROUP BY category, year
      ORDER BY category, year;
    `;
  }

  async findTotalByYearGroupedByAccount(): Promise<
    InvestmentTotalByYearGroupByAccountResponseDto[]
  > {
    const result = await this.prisma.$queryRaw<
      InvestmentTotalByYearGroupByAccountResponseDto[]
    >`
      SELECT
        accountId,
        year,

        SUM(amountDiff) as amount,

        EXP(
          SUM(
            CASE
              WHEN performance <= -1 THEN NULL
              ELSE LN(1 + performance)
            END
          )
        ) - 1 as performance

      FROM (
        SELECT
          accountId,
          year,
          month,
          amount,
          transactionAmount,

          COALESCE(
            amount - LAG(amount) OVER (
              PARTITION BY accountId
              ORDER BY month
            ),
            0
          ) as amountDiff,

          CASE
            WHEN prevTotalAmount IS NULL OR prevTotalAmount = 0 THEN 0
            ELSE (totalAmount - prevTotalAmount - transactionAmount) * 1.0 / prevTotalAmount
          END as performance

        FROM (
          SELECT
            accountId,
            year,
            month,
            amount,
            totalAmount,
            transactionAmount,

            LAG(totalAmount) OVER (
              PARTITION BY accountId
              ORDER BY month
            ) as prevTotalAmount

          FROM (
            SELECT
              CAST(a.id AS INTEGER) as accountId,
              strftime('%Y-%m', i.date) as month,
              strftime('%Y', i.date) as year,
              SUM(i.capitalGain) * 1.0 as amount,
              SUM(i.totalAmount) * 1.0 as totalAmount,
              SUM(i.transactionAmount) * 1.0 as transactionAmount
            FROM "Investment" i
            JOIN "Account" a ON i."accountId" = a.id
            GROUP BY a.id, month

            UNION ALL

            SELECT
              -1 as accountId,
              strftime('%Y-%m', i.date) as month,
              strftime('%Y', i.date) as year,
              SUM(i.capitalGain) * 1.0 as amount,
              SUM(i.totalAmount) * 1.0 as totalAmount,
              SUM(i.transactionAmount) * 1.0 as transactionAmount
            FROM "Investment" i
            GROUP BY month
          )
        )
      )

      GROUP BY accountId, year
      ORDER BY accountId, year;
    `;

    return result.map((row) => ({ ...row, accountId: Number(row.accountId) }));
  }

  async createAll(investments: InvestmentRequestDto[]): Promise<void> {
    for (const {
      accountId,
      date,
      capitalGain,
      totalAmount,
      transactionAmount,
    } of investments) {
      const existing = await this.prisma.investment.findFirst({
        where: {
          accountId: accountId,
          date: date,
        },
      });

      const investment = {
        capitalGain,
        totalAmount,
        transactionAmount,
        date,
      };

      if (existing) {
        await this.prisma.investment.update({
          where: { id: existing.id },
          data: investment,
        });
      } else {
        await this.prisma.investment.create({
          data: { ...investment, accountId },
        });
      }
    }
  }

  async findAll(accountId?: number) {
    const where = accountId ? { accountId } : {};
    return this.prisma.investment.findMany({
      where,
      orderBy: { date: 'desc' },
      include: { account: true },
    });
  }

  async update(id: number, dto: InvestmentRequestDto) {
    return this.prisma.investment.update({ where: { id }, data: dto as any });
  }

  async remove(id: number) {
    return this.prisma.investment.delete({ where: { id } });
  }
}
