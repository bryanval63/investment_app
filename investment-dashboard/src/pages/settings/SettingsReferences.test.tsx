import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createIncomeTypeRefApi,
  deleteIncomeTypeRefApi,
  getIncomeTypesRefApi,
} from "@/services/incomes/income-types-ref.service";
import { getInvestmentTypesRefApi } from "@/services/investments/investment-types-ref.service";
import { getInvestmentCategoriesRefApi } from "@/services/investments/investment-categories-ref.service";
import { createQueryWrapper } from "@/test/test-utils";
import { SettingsReferences } from "./SettingsReferences";

vi.mock("@/services/incomes/income-types-ref.service", () => ({
  getIncomeTypesRefApi: vi.fn(),
  createIncomeTypeRefApi: vi.fn(),
  patchIncomeTypeRefApi: vi.fn(),
  deleteIncomeTypeRefApi: vi.fn(),
}));
vi.mock("@/services/investments/investment-types-ref.service", () => ({
  getInvestmentTypesRefApi: vi.fn(),
  createInvestmentTypeRefApi: vi.fn(),
  patchInvestmentTypeRefApi: vi.fn(),
  deleteInvestmentTypeRefApi: vi.fn(),
}));
vi.mock("@/services/investments/investment-categories-ref.service", () => ({
  getInvestmentCategoriesRefApi: vi.fn(),
  createInvestmentCategoryRefApi: vi.fn(),
  patchInvestmentCategoryRefApi: vi.fn(),
  deleteInvestmentCategoryRefApi: vi.fn(),
}));

const renderPage = () => {
  const Wrapper = createQueryWrapper();
  return render(
    <Wrapper>
      <Suspense fallback={<p>Chargement</p>}>
        <SettingsReferences />
      </Suspense>
    </Wrapper>,
  );
};

/** Section dont le titre est donné. */
const section = async (title: string) => {
  const heading = await screen.findByText(title);
  return within(heading.closest("[data-slot='card']") as HTMLElement);
};

describe("SettingsReferences — types de revenus", () => {
  beforeEach(() => {
    vi.mocked(getInvestmentTypesRefApi).mockResolvedValue([]);
    vi.mocked(getInvestmentCategoriesRefApi).mockResolvedValue([]);
    vi.mocked(getIncomeTypesRefApi).mockResolvedValue([
      { id: 1, code: "SALARY", label: "Salaire" },
    ]);
  });

  it("liste les types de revenus", async () => {
    renderPage();

    const incomeTypes = await section("Types de revenus");
    expect(incomeTypes.getByText("Salaire")).toBeInTheDocument();
  });

  it("ajoute un type de revenu", async () => {
    vi.mocked(createIncomeTypeRefApi).mockResolvedValue({
      id: 8,
      code: "DIVIDENDES",
      label: "Dividendes",
    });
    renderPage();
    const incomeTypes = await section("Types de revenus");

    await userEvent.type(
      incomeTypes.getByLabelText("Nouveau libellé (Types de revenus)"),
      "Dividendes{Enter}",
    );

    await waitFor(() =>
      expect(createIncomeTypeRefApi).toHaveBeenCalledWith({
        label: "Dividendes",
      }),
    );
  });

  it("affiche une erreur si la suppression est refusée", async () => {
    vi.mocked(deleteIncomeTypeRefApi).mockRejectedValue(new Error("API error"));
    renderPage();
    const incomeTypes = await section("Types de revenus");

    await userEvent.click(incomeTypes.getByRole("button", { name: "Supprimer" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Opération impossible",
    );
  });
});
