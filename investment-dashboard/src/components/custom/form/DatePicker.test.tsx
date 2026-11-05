import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DatePicker } from "./DatePicker";

const LABEL = "Date d'ouverture";

const renderPicker = (props: Partial<ComponentProps<typeof DatePicker>> = {}) => {
  const onChange = vi.fn();
  render(<DatePicker label={LABEL} onChange={onChange} {...props} />);
  return { onChange, input: screen.getByLabelText(LABEL) };
};

const openCalendar = () =>
  userEvent.click(
    screen.getByRole("button", { name: `Ouvrir le calendrier pour ${LABEL}` }),
  );

const getDayButtons = () =>
  screen
    .getAllByRole("button")
    .filter((button) => button.className.includes("h-8 rounded-md"));

describe("DatePicker", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 10, 5, 12, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("displays the value in French format", () => {
    const { input } = renderPicker({ value: "2025-03-09" });
    expect(input).toHaveValue("09/03/2025");
  });

  it("displays an empty input without value", () => {
    const { input } = renderPicker({ value: null });
    expect(input).toHaveValue("");
  });

  it("commits a typed date on blur", async () => {
    const { input, onChange } = renderPicker();
    await userEvent.type(input, "5/11/2026");
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledWith("2026-11-05");
    expect(input).toHaveValue("05/11/2026");
  });

  it.each(["05-11-2026", "05.11.2026", "05 11 2026"])(
    "accepts the %s separator format",
    async (typed) => {
      const { input, onChange } = renderPicker();
      await userEvent.type(input, typed);
      fireEvent.blur(input);
      expect(onChange).toHaveBeenCalledWith("2026-11-05");
    },
  );

  it("commits a typed date on Enter", async () => {
    const { input, onChange } = renderPicker();
    await userEvent.type(input, "01/02/2024{Enter}");
    expect(onChange).toHaveBeenCalledWith("2024-02-01");
  });

  it.each(["31/02/2024", "abc", "2024-02-01"])(
    "restores the previous value when %s is invalid",
    async (typed) => {
      const { input, onChange } = renderPicker({ value: "2025-03-09" });
      await userEvent.clear(input);
      await userEvent.type(input, typed);
      fireEvent.blur(input);
      expect(onChange).not.toHaveBeenCalled();
      expect(input).toHaveValue("09/03/2025");
    },
  );

  it("opens on the month of the value", async () => {
    renderPicker({ value: "2025-03-09" });
    await openCalendar();
    expect(screen.getByLabelText("Mois")).toHaveValue("2");
    expect(screen.getByLabelText("Année")).toHaveValue("2025");
  });

  it("opens on the current month without value", async () => {
    renderPicker();
    await openCalendar();
    expect(screen.getByLabelText("Mois")).toHaveValue("10");
    expect(screen.getByLabelText("Année")).toHaveValue("2026");
  });

  it("lists the 12 months in French", async () => {
    renderPicker();
    await openCalendar();
    const options = within(screen.getByLabelText("Mois"))
      .getAllByRole("option")
      .map((option) => option.textContent?.toLowerCase());
    expect(options).toEqual([
      "janvier",
      "février",
      "mars",
      "avril",
      "mai",
      "juin",
      "juillet",
      "août",
      "septembre",
      "octobre",
      "novembre",
      "décembre",
    ]);
  });

  it("lists years from current year + 100 down to current year - 100", async () => {
    renderPicker();
    await openCalendar();
    const years = within(screen.getByLabelText("Année"))
      .getAllByRole("option")
      .map((option) => Number(option.textContent));
    expect(years).toHaveLength(201);
    expect(years[0]).toBe(2126);
    expect(years.at(-1)).toBe(1926);
  });

  it("navigates to the previous and next month across years", async () => {
    renderPicker({ value: "2025-01-15" });
    await openCalendar();
    await userEvent.click(screen.getByRole("button", { name: "Mois précédent" }));
    expect(screen.getByLabelText("Mois")).toHaveValue("11");
    expect(screen.getByLabelText("Année")).toHaveValue("2024");
    await userEvent.click(screen.getByRole("button", { name: "Mois suivant" }));
    await userEvent.click(screen.getByRole("button", { name: "Mois suivant" }));
    expect(screen.getByLabelText("Mois")).toHaveValue("1");
    expect(screen.getByLabelText("Année")).toHaveValue("2025");
  });

  it("changes month and year with the selects", async () => {
    renderPicker({ value: "2025-01-15" });
    await openCalendar();
    await userEvent.selectOptions(screen.getByLabelText("Mois"), "5");
    await userEvent.selectOptions(screen.getByLabelText("Année"), "2030");
    expect(screen.getByLabelText("Mois")).toHaveValue("5");
    expect(screen.getByLabelText("Année")).toHaveValue("2030");
  });

  it("renders the days grid with a Monday-first offset", async () => {
    // Février 2026 commence un dimanche → 6 cases vides avant le 1er.
    renderPicker({ value: "2026-02-10" });
    await openCalendar();
    const dayButtons = getDayButtons();
    expect(dayButtons).toHaveLength(6 + 28);
    expect(dayButtons.slice(0, 6).every((b) => b.hasAttribute("disabled"))).toBe(
      true,
    );
    expect(dayButtons[6]).toHaveTextContent("1");
    expect(dayButtons.at(-1)).toHaveTextContent("28");
  });

  it("renders a month starting on Monday without offset", async () => {
    // Juin 2026 commence un lundi, 30 jours.
    renderPicker({ value: "2026-06-10" });
    await openCalendar();
    const dayButtons = getDayButtons();
    expect(dayButtons).toHaveLength(30);
    expect(dayButtons[0]).toHaveTextContent("1");
  });

  it("selects a day and closes the calendar", async () => {
    const { input, onChange } = renderPicker({ value: "2025-03-09" });
    await openCalendar();
    await userEvent.click(screen.getByRole("button", { name: "20" }));
    expect(onChange).toHaveBeenCalledWith("2025-03-20");
    expect(input).toHaveValue("20/03/2025");
    expect(screen.queryByLabelText("Mois")).not.toBeInTheDocument();
  });

  it("highlights the selected day", async () => {
    renderPicker({ value: "2025-03-09" });
    await openCalendar();
    expect(screen.getByRole("button", { name: "9" })).toHaveClass("bg-primary");
    expect(screen.getByRole("button", { name: "10" })).not.toHaveClass(
      "bg-primary",
    );
  });

  it("closes when clicking outside", async () => {
    renderPicker();
    await openCalendar();
    expect(screen.getByLabelText("Mois")).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByLabelText("Mois")).not.toBeInTheDocument();
  });

  it("hides the clear button when not clearable", () => {
    renderPicker({ value: "2025-03-09" });
    expect(
      screen.queryByRole("button", { name: "Effacer la date" }),
    ).not.toBeInTheDocument();
  });

  it("clears the value", async () => {
    const { input, onChange } = renderPicker({
      value: "2025-03-09",
      clearable: true,
    });
    await userEvent.click(screen.getByRole("button", { name: "Effacer la date" }));
    expect(onChange).toHaveBeenCalledWith(null);
    expect(input).toHaveValue("");
  });
});
