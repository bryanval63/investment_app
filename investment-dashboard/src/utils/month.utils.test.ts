import { describe, expect, it } from "vitest";
import {
  formatMonthYear,
  fromMonthInputValue,
  toMonthInputValue,
} from "./month.utils";

describe("month.utils", () => {
  const january = new Date(Date.UTC(2026, 0, 1));

  it("formate le mois en MM/AAAA à partir de la date UTC", () => {
    expect(formatMonthYear(january)).toBe("01/2026");
    expect(formatMonthYear("2026-12-01T00:00:00.000Z")).toBe("12/2026");
  });

  it("convertit une date vers et depuis un input month", () => {
    expect(toMonthInputValue(january)).toBe("2026-01");
    expect(fromMonthInputValue("2026-01")).toEqual(january);
  });

  it("refuse une valeur d'input invalide", () => {
    expect(fromMonthInputValue("")).toBeNull();
    expect(fromMonthInputValue("2026-13")).toBeNull();
  });
});
