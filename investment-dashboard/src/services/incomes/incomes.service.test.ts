import { describe, expect, it, vi } from "vitest";
import { api } from "@/utils/fetch.utils";
import { postIncomesApi } from "./incomes.service";

vi.mock("@/utils/fetch.utils", () => ({ api: vi.fn() }));

describe("postIncomesApi", () => {
  it("renvoie la promesse de la requête pour que les erreurs remontent au formulaire", async () => {
    const error = new Error("500");
    vi.mocked(api).mockRejectedValueOnce(error);

    await expect(postIncomesApi([])).rejects.toBe(error);
  });
});
