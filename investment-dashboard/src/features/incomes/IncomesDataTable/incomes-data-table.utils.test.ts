import { describe, expect, it } from "vitest";
import type { IncomeResponseDto } from "@investments/shared";
import { pivotIncomes } from "./incomes-data-table.utils";

const income = (id: number, amount: number, month: number) =>
  ({
    id,
    amount,
    date: new Date(Date.UTC(2026, month, 1)),
    type: { code: "BONUS", label: "Prime" },
  }) as unknown as IncomeResponseDto;

describe("pivotIncomes", () => {
  it("additionne les revenus d'un même type sur un même mois", () => {
    const [row] = pivotIncomes([income(1, 100, 2), income(2, 50, 2)]);

    expect(row.type).toBe("Prime");
    expect(row.march).toBe(150);
    expect(row.january).toBe(0);
  });
});
