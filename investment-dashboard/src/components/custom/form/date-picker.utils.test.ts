import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildCalendarDays,
  buildPickerYears,
  parseInputValue,
  startOfMonth,
  toDate,
  toInputValue,
  toValue,
} from "./date-picker.utils";

describe("date-picker.utils", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 10, 5, 12, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("buildPickerYears lists current year +/- 100 in descending order", () => {
    const years = buildPickerYears();
    expect(years).toHaveLength(201);
    expect(years[0]).toBe(2126);
    expect(years.at(-1)).toBe(1926);
  });

  it("startOfMonth returns the first day of the month with an optional offset", () => {
    const date = new Date(2025, 0, 20);
    expect(startOfMonth(date)).toEqual(new Date(2025, 0, 1));
    expect(startOfMonth(date, -1)).toEqual(new Date(2024, 11, 1));
    expect(startOfMonth(date, 12)).toEqual(new Date(2026, 0, 1));
  });

  it("toDate and toValue are inverse", () => {
    expect(toDate("2024-02-29")).toEqual(new Date(2024, 1, 29));
    expect(toValue(new Date(2024, 1, 9))).toBe("2024-02-09");
  });

  it("toInputValue formats in French or returns empty", () => {
    expect(toInputValue("2024-02-09")).toBe("09/02/2024");
    expect(toInputValue(null)).toBe("");
    expect(toInputValue(undefined)).toBe("");
  });

  it("parseInputValue parses valid dates and rejects invalid ones", () => {
    expect(parseInputValue(" 5/11/2026 ")).toEqual(new Date(2026, 10, 5));
    expect(parseInputValue("05.11.2026")).toEqual(new Date(2026, 10, 5));
    expect(parseInputValue("31/02/2024")).toBeNull();
    expect(parseInputValue("2024-02-01")).toBeNull();
    expect(parseInputValue("")).toBeNull();
  });

  it("buildCalendarDays offsets days so weeks start on Monday", () => {
    const february = buildCalendarDays(new Date(2026, 1, 10));
    expect(february.slice(0, 6)).toEqual(Array(6).fill(null));
    expect(february.slice(6)).toEqual(
      Array.from({ length: 28 }, (_, i) => i + 1),
    );
    expect(buildCalendarDays(new Date(2026, 5, 1))[0]).toBe(1);
  });
});
