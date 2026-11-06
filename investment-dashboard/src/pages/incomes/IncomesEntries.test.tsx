import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getIncomesApi } from "@/services/incomes/incomes.service";
import { getIncomeTypesRefApi } from "@/services/incomes/income-types-ref.service";
import { createQueryWrapper } from "@/test/test-utils";
import { getCurrentYear } from "@investments/shared/utils/date.utils";
import { IncomesEntries } from "./IncomesEntries";

vi.mock("@/services/incomes/incomes.service", () => ({
  getIncomesApi: vi.fn(),
  patchIncomeApi: vi.fn(),
  deleteIncomeApi: vi.fn(),
}));
vi.mock("@/services/incomes/income-types-ref.service", () => ({
  getIncomeTypesRefApi: vi.fn(),
}));
// Select Radix peu fiable sous jsdom : remplacé par un select natif.
vi.mock("@/components/custom/fields/CustomSelect/CustomSelect", () => ({
  CustomSelect: ({
    id,
    value,
    options,
    onValueChange,
  }: {
    id?: string;
    value: string;
    options: readonly { code: string; label: string }[];
    onValueChange: (value: string) => void;
  }) => (
    <select
      id={id}
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
    >
      {options.map(({ code, label }) => (
        <option key={code} value={code}>
          {label}
        </option>
      ))}
    </select>
  ),
}));

const renderPage = () => {
  const Wrapper = createQueryWrapper();
  return render(
    <Wrapper>
      <Suspense fallback={<p>Chargement</p>}>
        <IncomesEntries />
      </Suspense>
    </Wrapper>,
  );
};

describe("IncomesEntries", () => {
  beforeEach(() => {
    vi.mocked(getIncomeTypesRefApi).mockResolvedValue([]);
    vi.mocked(getIncomesApi).mockResolvedValue([]);
  });

  it("affiche le détail des saisies de l'année en cours par défaut", async () => {
    renderPage();

    expect(await screen.findByText("Détail des saisies")).toBeInTheDocument();
    expect(await screen.findByLabelText("Année")).toHaveValue(
      getCurrentYear().toString(),
    );
    expect(getIncomesApi).toHaveBeenCalledWith(getCurrentYear());
  });

  it("recharge les saisies quand on change d'année", async () => {
    renderPage();

    await userEvent.selectOptions(await screen.findByLabelText("Année"), "2022");

    await waitFor(() => expect(getIncomesApi).toHaveBeenCalledWith(2022));
  });
});
