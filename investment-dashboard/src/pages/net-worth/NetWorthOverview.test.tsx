import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getInvestmentsOverviewApi } from "@/services/investments/investments.service";
import { getNetWorthesApi } from "@/services/net-worthes/net-worthes.service";
import { createQueryWrapper, normalizeSpaces } from "@/test/test-utils";
import type {
  InvestmentOverviewResponseDto,
  NetWorthResponseDto,
} from "@investments/shared";
import { NetWorthOverview } from "./NetWorthOverview";

vi.mock("@/services/net-worthes/net-worthes.service", () => ({
  getNetWorthesApi: vi.fn(),
}));
vi.mock("@/services/investments/investments.service", () => ({
  getInvestmentsOverviewApi: vi.fn(),
}));
vi.mock("@/components/custom/charts/CustomAreaChart/CustomAreaChart", () => ({
  CustomAreaChart: ({ chartData }: { chartData: unknown[] }) => (
    <pre data-testid="area-chart">{JSON.stringify(chartData)}</pre>
  ),
}));
vi.mock("@/components/custom/charts/CustomBarChart/CustomBarChart", () => ({
  CustomBarChart: ({
    chartData,
    labelFormatter,
  }: {
    chartData: { xAxis: number; yAxis: number }[];
    labelFormatter: (value: number) => string;
  }) => (
    <ul data-testid="bar-chart">
      {chartData.map(({ xAxis, yAxis }) => (
        <li key={xAxis}>{`${xAxis}:${yAxis}:${labelFormatter(yAxis)}`}</li>
      ))}
    </ul>
  ),
}));

const netWorth = (
  year: number,
  month: number,
  amount: number,
): NetWorthResponseDto => ({
  id: year * 100 + month,
  amount,
  date: new Date(Date.UTC(year, month, 1)),
});

const renderPage = () =>
  render(<NetWorthOverview />, { wrapper: createQueryWrapper() });

/** Texte de la carte contenant le titre donné. */
const cardText = async (title: string) => {
  const titleElement = await screen.findByText(title);
  const card = titleElement.closest("[data-slot='card']");
  return normalizeSpaces(card?.textContent);
};

const barsText = (bars: HTMLElement) =>
  [...bars.querySelectorAll("li")].map((li) => normalizeSpaces(li.textContent));

describe("NetWorthOverview", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 10, 5, 12, 0, 0));
    vi.mocked(getInvestmentsOverviewApi).mockResolvedValue({
      totalAmount: 50000,
      totalNetAmount: 45000,
    } as InvestmentOverviewResponseDto);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("displays synthesis, monthly gain, year-to-date gain and performance", async () => {
    vi.mocked(getNetWorthesApi).mockResolvedValue([
      netWorth(2024, 11, 80000),
      netWorth(2025, 11, 100000),
      netWorth(2026, 8, 110000),
      netWorth(2026, 9, 120000),
    ]);
    renderPage();

    await waitFor(async () =>
      expect(await cardText("Patrimoine financier total")).toContain(
        "115 000,00 €",
      ),
    );
    const hero = await cardText("Patrimoine financier total");
    expect(hero).toContain("120 000,00 €");
    // Gain et performance du mois : uniquement dans la tuile dédiée.
    expect(hero).not.toContain("+10 000,00 €");
    expect(hero).not.toContain("9,09 %");
    const monthly = await cardText("Gain du mois");
    expect(monthly).toContain("+10 000,00 €");
    expect(monthly).toContain("9,09 %");
    expect(await cardText("Depuis le début de l'année")).toContain(
      "+20 000,00 €",
    );
    expect(await cardText("Impôts et frais")).toContain("5 000,00 €");
  });

  it("displays the best yearly gain", async () => {
    vi.mocked(getNetWorthesApi).mockResolvedValue([
      netWorth(2023, 11, 50000),
      netWorth(2024, 11, 80000),
      netWorth(2025, 11, 100000),
      netWorth(2026, 9, 120000),
    ]);
    renderPage();

    await waitFor(async () =>
      expect(await cardText("Meilleure année")).toContain("+30 000,00 €"),
    );
    expect(await cardText("Meilleure année")).toContain("2024");
  });

  it("computes yearly gains against the previous December", async () => {
    vi.mocked(getNetWorthesApi).mockResolvedValue([
      netWorth(2024, 5, 70000), // pas de décembre 2023 → pas de barre 2024
      netWorth(2024, 11, 80000),
      netWorth(2025, 11, 100000),
      netWorth(2026, 9, 120000),
    ]);
    renderPage();

    const bars = await screen.findByTestId("bar-chart");
    await waitFor(() =>
      expect(barsText(bars)).toEqual(["2025:20000:20 k€", "2026:20000:20 k€"]),
    );
  });

  it("formats yearly gains in thousands with one decimal", async () => {
    vi.mocked(getNetWorthesApi).mockResolvedValue([
      netWorth(2025, 11, 100000),
      netWorth(2026, 9, 101234),
    ]);
    renderPage();

    const bars = await screen.findByTestId("bar-chart");
    await waitFor(() => expect(barsText(bars)).toEqual(["2026:1234:1,2 k€"]));
  });

  it("renders nothing until data is loaded", async () => {
    vi.mocked(getNetWorthesApi).mockReturnValue(new Promise(() => {}));
    renderPage();
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(screen.queryByText("Depuis le début de l'année")).toBeNull();
  });

  it("shows every year on desktop, without pagination", async () => {
    const data = [netWorth(2010, 11, 1000)];
    for (let year = 2011; year <= 2026; year++) {
      data.push(netWorth(year, 11, 1000 * (year - 2009)));
    }
    vi.mocked(getNetWorthesApi).mockResolvedValue(data);
    renderPage();

    const bars = await screen.findByTestId("bar-chart");
    await waitFor(() => expect(barsText(bars)).toHaveLength(16));
    expect(
      screen.queryByRole("button", { name: "Afficher les années précédentes" }),
    ).toBeNull();
  });

  it("paginates yearly gains by 10 years on mobile", async () => {
    vi.spyOn(window, "matchMedia").mockImplementation(
      (query: string) =>
        ({
          matches: true,
          media: query,
          addEventListener: () => {},
          removeEventListener: () => {},
        }) as unknown as MediaQueryList,
    );

    const data = [netWorth(2010, 11, 1000)];
    for (let year = 2011; year <= 2026; year++) {
      data.push(netWorth(year, 11, 1000 * (year - 2009)));
    }
    vi.mocked(getNetWorthesApi).mockResolvedValue(data);
    renderPage();

    const bars = await screen.findByTestId("bar-chart");
    await waitFor(() => expect(barsText(bars)).toHaveLength(10));
    expect(barsText(bars)[0]).toMatch(/^2017:/);

    await userEvent.click(
      screen.getByRole("button", { name: "Afficher les années précédentes" }),
    );
    expect(barsText(bars)[0]).toMatch(/^2016:/);
  });
});
