import { describe, expect, it } from "vitest";
import {
  findFirstItemByDate,
  findLastItemByDate,
  findSecondLastItemByDate,
} from "./array.utils";

const items = [
  { id: 1, date: new Date("2024-03-01") },
  { id: 2, date: new Date("2025-01-01") },
  { id: 3, date: new Date("2023-07-01") },
  { id: 4, date: new Date("2024-11-01") },
];

describe("array.utils", () => {
  describe("findLastItemByDate", () => {
    it("returns the most recent item", () => {
      expect(findLastItemByDate(items).id).toBe(2);
    });

    it("accepts dates serialized as strings", () => {
      const serialized = items.map((item) => ({
        ...item,
        date: item.date.toISOString() as unknown as Date,
      }));
      expect(findLastItemByDate(serialized).id).toBe(2);
    });

    it("throws on an empty array", () => {
      expect(() => findLastItemByDate([])).toThrow(TypeError);
    });
  });

  describe("findFirstItemByDate", () => {
    it("returns the oldest item", () => {
      expect(findFirstItemByDate(items).id).toBe(3);
    });
  });

  describe("findSecondLastItemByDate", () => {
    it("returns the second most recent item", () => {
      expect(findSecondLastItemByDate(items)?.id).toBe(4);
    });

    it("returns null when there are fewer than 2 items", () => {
      expect(findSecondLastItemByDate([items[0]])).toBeNull();
      expect(findSecondLastItemByDate([])).toBeNull();
    });

    it("does not mutate the input array", () => {
      const copy = [...items];
      findSecondLastItemByDate(items);
      expect(items).toEqual(copy);
    });
  });
});
