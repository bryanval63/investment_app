import { describe, expect, it } from "vitest";
import { AccountFormSchema, DEFAULT_ACCOUNT } from "./account-form.schema";

const validAccount = { ...DEFAULT_ACCOUNT, name: "PEA", type: "PEA" };

describe("AccountFormSchema", () => {
  it("accepte une catégorie ajoutée dans les paramètres", () => {
    const result = AccountFormSchema.safeParse({
      ...validAccount,
      category: "OBLIGATIONS",
    });

    expect(result.success).toBe(true);
  });

  it("refuse une catégorie vide", () => {
    const result = AccountFormSchema.safeParse({
      ...validAccount,
      category: "",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "La catégorie de compte est requise",
    );
  });
});
