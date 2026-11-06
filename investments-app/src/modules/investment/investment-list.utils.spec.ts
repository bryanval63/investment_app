import {
  buildInvestmentListWhere,
  parseOptionalInt,
} from './investment-list.utils';

describe('buildInvestmentListWhere', () => {
  it('returns no filter when nothing is given', () => {
    expect(buildInvestmentListWhere({})).toEqual({});
  });

  it('filters by account', () => {
    expect(buildInvestmentListWhere({ accountId: 3 })).toEqual({
      accountId: 3,
    });
  });

  it('filters on the whole calendar year (UTC bounds, end excluded)', () => {
    expect(buildInvestmentListWhere({ year: 2024 })).toEqual({
      date: {
        gte: new Date('2024-01-01T00:00:00.000Z'),
        lt: new Date('2025-01-01T00:00:00.000Z'),
      },
    });
  });

  it('combines account and year', () => {
    expect(buildInvestmentListWhere({ accountId: 3, year: 2024 })).toEqual({
      accountId: 3,
      date: {
        gte: new Date('2024-01-01T00:00:00.000Z'),
        lt: new Date('2025-01-01T00:00:00.000Z'),
      },
    });
  });
});

describe('parseOptionalInt', () => {
  it('parses numeric query params and ignores missing or invalid ones', () => {
    expect(parseOptionalInt('2024')).toBe(2024);
    expect(parseOptionalInt(undefined)).toBeUndefined();
    expect(parseOptionalInt('')).toBeUndefined();
    expect(parseOptionalInt('abc')).toBeUndefined();
  });
});
