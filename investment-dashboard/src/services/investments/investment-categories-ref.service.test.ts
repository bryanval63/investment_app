import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/utils/fetch.utils";
import {
  createInvestmentCategoryRefApi,
  deleteInvestmentCategoryRefApi,
  getInvestmentCategoriesRefApi,
  patchInvestmentCategoryRefApi,
} from "./investment-categories-ref.service";

vi.mock("@/utils/fetch.utils", () => ({ api: vi.fn() }));

describe("investment-categories-ref.service", () => {
  beforeEach(() => {
    vi.mocked(api).mockReset();
    vi.mocked(api).mockResolvedValue("response");
  });

  it("gets all investment categories", async () => {
    await expect(getInvestmentCategoriesRefApi()).resolves.toBe("response");
    expect(api).toHaveBeenCalledWith("GET", "investment-categories-ref");
  });

  it("creates an investment category", async () => {
    await createInvestmentCategoryRefApi({ label: "Actions" });
    expect(api).toHaveBeenCalledWith("POST", "investment-categories-ref", {
      label: "Actions",
    });
  });

  it("updates an investment category label", async () => {
    await patchInvestmentCategoryRefApi(3, { label: "Nouveau" });
    expect(api).toHaveBeenCalledWith("PATCH", "investment-categories-ref/3", {
      label: "Nouveau",
    });
  });

  it("deletes an investment category", async () => {
    await deleteInvestmentCategoryRefApi(7);
    expect(api).toHaveBeenCalledWith("DELETE", "investment-categories-ref/7");
  });
});
