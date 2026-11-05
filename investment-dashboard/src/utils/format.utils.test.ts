import { describe, expect, it } from "vitest";
import { normalizeSpaces } from "@/test/test-utils";
import {
  formatToEuro,
  formatToPercentage,
  formatToReadableDate,
  formatToThousandsEuro,
} from "./format.utils";

describe("format.utils", () => {
  describe("formatToEuro", () => {
    it("formats an amount in euros with the French locale", () => {
      expect(normalizeSpaces(formatToEuro(1234.5))).toBe("1 234,50 €");
    });

    it("formats negative amounts", () => {
      expect(normalizeSpaces(formatToEuro(-42))).toBe("-42,00 €");
    });

    it("accepts Intl options overrides", () => {
      expect(
        normalizeSpaces(formatToEuro(1500, { minimumFractionDigits: 0 })),
      ).toBe("1 500 €");
      expect(
        normalizeSpaces(formatToEuro(1500000, { notation: "compact" })),
      ).toBe("1,5 M €");
    });
  });

  describe("formatToPercentage", () => {
    it("formats a ratio as a percentage with 2 decimals by default", () => {
      expect(normalizeSpaces(formatToPercentage(0.1234))).toBe("12,34 %");
    });

    it("accepts Intl options overrides", () => {
      expect(
        normalizeSpaces(
          formatToPercentage(0.5, { minimumFractionDigits: 0 }),
        ),
      ).toBe("50 %");
    });
  });

  describe("formatToThousandsEuro", () => {
    it("formats an amount in thousands with at most one decimal", () => {
      expect(normalizeSpaces(formatToThousandsEuro(1234))).toBe("1,2 k€");
      expect(normalizeSpaces(formatToThousandsEuro(20000))).toBe("20 k€");
      expect(normalizeSpaces(formatToThousandsEuro(-1500000))).toBe(
        "-1 500 k€",
      );
    });
  });

  describe("formatToReadableDate", () => {
    it("formats a date as long month and year by default", () => {
      expect(formatToReadableDate(new Date(2025, 2, 15))).toBe("mars 2025");
    });

    it("accepts custom Intl options", () => {
      expect(
        formatToReadableDate(new Date(2025, 0, 1), {
          year: "numeric",
          month: "short",
        }),
      ).toBe("janv. 2025");
    });
  });
});
