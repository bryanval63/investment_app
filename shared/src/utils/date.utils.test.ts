import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildYearsUntilCurrent,
  createDateNormalized,
  createDateNormalizedByMonthAndYear,
  getCurrentMonthCode,
  getCurrentYear,
  getMonthIndex,
  getStartOfCurrentYear,
} from "./date.utils";

describe("date.utils", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 5, 12, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("getCurrentYear", () => {
    it("returns the current year", () => {
      expect(getCurrentYear()).toBe(2026);
    });
  });

  describe("getCurrentMonthCode", () => {
    it("returns the code of the current month", () => {
      expect(getCurrentMonthCode()).toBe("november");
    });

    it("handles January and December", () => {
      vi.setSystemTime(new Date(2026, 0, 15));
      expect(getCurrentMonthCode()).toBe("january");
      vi.setSystemTime(new Date(2026, 11, 31));
      expect(getCurrentMonthCode()).toBe("december");
    });
  });

  describe("getStartOfCurrentYear", () => {
    it("returns the timestamp of January 1st of the current year", () => {
      expect(getStartOfCurrentYear()).toBe(new Date(2026, 0, 1).getTime());
    });
  });

  describe("buildYearsUntilCurrent", () => {
    it("builds every year from 2014 to the current year by default", () => {
      const years = buildYearsUntilCurrent();
      expect(years[0]).toBe(2014);
      expect(years.at(-1)).toBe(2026);
      expect(years).toHaveLength(13);
    });

    it("accepts a custom start year", () => {
      expect(buildYearsUntilCurrent(2024)).toEqual([2024, 2025, 2026]);
    });

    it("returns only the current year when starting this year", () => {
      expect(buildYearsUntilCurrent(2026)).toEqual([2026]);
    });
  });

  describe("getMonthIndex", () => {
    it("returns the 0-based index of a month code", () => {
      expect(getMonthIndex("january")).toBe(0);
      expect(getMonthIndex("june")).toBe(5);
      expect(getMonthIndex("december")).toBe(11);
    });
  });

  describe("createDateNormalizedByMonthAndYear", () => {
    it("creates the first day of the month at midnight UTC", () => {
      expect(
        createDateNormalizedByMonthAndYear("march", 2025).toISOString(),
      ).toBe("2025-03-01T00:00:00.000Z");
    });
  });

  describe("createDateNormalized", () => {
    it("normalizes any date to the first day of its month at midnight UTC", () => {
      expect(
        createDateNormalized(new Date(2024, 1, 29, 18, 30)).toISOString(),
      ).toBe("2024-02-01T00:00:00.000Z");
    });
  });
});
