import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/utils/fetch.utils";
import {
  createInvestmentTypeRefApi,
  deleteInvestmentTypeRefApi,
  getInvestmentTypesRefApi,
  patchInvestmentTypeRefApi,
} from "./investment-types-ref.service";

vi.mock("@/utils/fetch.utils", () => ({ api: vi.fn() }));

describe("investment-types-ref.service", () => {
  beforeEach(() => {
    vi.mocked(api).mockReset();
    vi.mocked(api).mockResolvedValue("response");
  });

  it("gets all investment types", async () => {
    await expect(getInvestmentTypesRefApi()).resolves.toBe("response");
    expect(api).toHaveBeenCalledWith("GET", "investment-types-ref");
  });

  it("creates an investment type", async () => {
    await createInvestmentTypeRefApi({ label: "PEA" });
    expect(api).toHaveBeenCalledWith("POST", "investment-types-ref", {
      label: "PEA",
    });
  });

  it("updates an investment type label", async () => {
    await patchInvestmentTypeRefApi(3, { label: "Nouveau" });
    expect(api).toHaveBeenCalledWith("PATCH", "investment-types-ref/3", {
      label: "Nouveau",
    });
  });

  it("deletes an investment type", async () => {
    await deleteInvestmentTypeRefApi(7);
    expect(api).toHaveBeenCalledWith("DELETE", "investment-types-ref/7");
  });
});
