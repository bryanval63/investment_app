import { describe, expect, it } from "vitest";
import { TaxFormSchema } from "./tax-form.schema";

describe("TaxFormSchema", () => {
  it("accepte un impôt payé (montant négatif)", () => {
    const result = TaxFormSchema.safeParse({ year: 2025, amount: "-1 011,5" });

    expect(result.success).toBe(true);
    expect(result.data?.amount).toBe(-1011.5);
  });

  it("accepte un remboursement (montant positif)", () => {
    expect(TaxFormSchema.safeParse({ year: 2025, amount: 265 }).success).toBe(
      true,
    );
  });

  it("refuse un montant nul", () => {
    expect(TaxFormSchema.safeParse({ year: 2025, amount: 0 }).success).toBe(
      false,
    );
  });
});
