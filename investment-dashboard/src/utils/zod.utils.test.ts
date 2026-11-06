import { describe, expect, it } from "vitest";
import { InvestmentSchema } from "@/features/investments/AddInvestmentsForm/investments-form.schema";
import { IncomeSchema } from "@/features/incomes/AddIncomesForm/incomes-form.schema";
import { TaxFormSchema } from "@/features/incomes/AddTaxForm/tax-form.schema";
import { NetWorthFormSchema } from "@/features/netWorth/AddNetWorthForm/net-worth-form.schema";
import { AccountFormSchema } from "@/features/accounts/AddAccountForm/account-form.schema";
import { decimalNumber } from "./zod.utils";

describe("decimalNumber", () => {
  const schema = decimalNumber();

  it.each([
    ["12,5", 12.5],
    ["12.5", 12.5],
    ["-3,25", -3.25],
    ["1 234,56", 1234.56],
    ["1\u202f234,56", 1234.56],
    [42, 42],
  ])("accepte %j", (input, expected) => {
    expect(schema.parse(input)).toBe(expected);
  });

  it.each(["abc", "1,2,3", "1,2.3"])("refuse %j", (input) => {
    expect(schema.safeParse(input).success).toBe(false);
  });
});

describe("formulaires : la virgule décimale est acceptée", () => {
  it("investissements", () => {
    expect(
      InvestmentSchema.parse({
        accountId: "1",
        totalAmount: "1 000,50",
        capitalGain: "-12,3",
        transactionAmount: "100,25",
      }),
    ).toMatchObject({
      totalAmount: 1000.5,
      capitalGain: -12.3,
      transactionAmount: 100.25,
    });
  });

  it("revenus", () => {
    expect(IncomeSchema.shape.amount.parse("1500,75")).toBe(1500.75);
  });

  it("impôts", () => {
    expect(TaxFormSchema.shape.amount.parse("850,5")).toBe(850.5);
  });

  it("capital", () => {
    expect(NetWorthFormSchema.shape.amount.parse("25 000,9")).toBe(25000.9);
  });

  it("compte", () => {
    expect(
      AccountFormSchema.shape.defaultTransactionAmount.parse("150,5"),
    ).toBe(150.5);
  });
});
