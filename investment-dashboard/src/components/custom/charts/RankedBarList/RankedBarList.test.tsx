import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RankedBarList, type RankedBarItem } from "./RankedBarList";

const items: RankedBarItem[] = [
  { key: 1, label: "PEA", value: 0.05, formatted: "5 %" },
  { key: 2, label: "Crypto", value: -0.2, formatted: "-20 %" },
  { key: 3, label: "Assurance vie", value: 0.1, formatted: "10 %" },
];

describe("RankedBarList", () => {
  it("sorts items by descending value", () => {
    render(<RankedBarList items={items} />);
    const labels = screen
      .getAllByRole("listitem")
      .map((item) => item.textContent);
    expect(labels).toEqual(["Assurance vie10 %", "PEA5 %", "Crypto-20 %"]);
  });

  it("colors values by sign in signed mode", () => {
    render(<RankedBarList items={items} />);
    expect(screen.getByText("-20 %").className).toContain("text-red-500");
    expect(screen.getByText("10 %").className).toContain("text-emerald-600");
  });

  it("draws negative bars to the left of the center line", () => {
    const { container } = render(<RankedBarList items={items} />);
    const bars = [
      ...container.querySelectorAll<HTMLElement>("span[style*='width']"),
    ];
    // Crypto (dernier) : la plus grande valeur absolue → 50 %, vers la gauche.
    expect(bars[2].style.width).toBe("50%");
    expect(bars[2].style.right).toBe("50%");
    expect(bars[0].style.left).toBe("50%");
  });

  it("shows the empty label when there is no item", () => {
    render(<RankedBarList items={[]} emptyLabel="Rien" />);
    expect(screen.getByText("Rien")).toBeTruthy();
  });
});
