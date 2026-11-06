import { describe, expect, it } from "vitest";
import { computeIncomesSummary } from "./incomes-summary.utils";

const TODAY = new Date(2026, 10, 6);

const yearly = [
  { date: "2024-01-01", amount: 24000 },
  { date: "2025-01-01", amount: 36000 },
  { date: "2026-01-01", amount: 10000 },
];

const monthly = [
  { date: "2025-01-01", amount: 3000 },
  { date: "2025-02-01", amount: 3000 },
  { date: "2025-03-01", amount: 30000 },
  { date: "2026-01-01", amount: 4000 },
  { date: "2026-02-01", amount: 6000 },
];

describe("computeIncomesSummary", () => {
  it("calcule l'année en cours et la même période de l'année précédente", () => {
    const summary = computeIncomesSummary(yearly, monthly, TODAY);

    expect(summary.currentYear).toBe(2026);
    expect(summary.yearToDate).toBe(10000);
    expect(summary.yearToDateMonthlyAverage).toBe(5000);
    // Janvier + février 2025 uniquement.
    expect(summary.previousYearToDate).toBe(6000);
  });

  it("exclut l'année en cours des moyennes", () => {
    const summary = computeIncomesSummary(yearly, monthly, TODAY);

    expect(summary.lastYearMonthlyAverage).toEqual({ year: 2025, amount: 3000 });
    expect(summary.annualAverage).toEqual({ amount: 30000, yearsCount: 2 });
  });

  it("renvoie la meilleure année, le total et la première année", () => {
    const summary = computeIncomesSummary(yearly, monthly, TODAY);

    expect(summary.bestYear).toEqual({ year: 2025, amount: 36000 });
    expect(summary.total).toBe(70000);
    expect(summary.firstYear).toBe(2024);
  });

  it("gère l'absence de données", () => {
    const summary = computeIncomesSummary([], [], TODAY);

    expect(summary.yearToDate).toBe(0);
    expect(summary.yearToDateMonthlyAverage).toBeUndefined();
    expect(summary.previousYearToDate).toBeUndefined();
    expect(summary.lastYearMonthlyAverage).toBeUndefined();
    expect(summary.annualAverage).toBeUndefined();
    expect(summary.bestYear).toBeUndefined();
    expect(summary.total).toBe(0);
  });
});
