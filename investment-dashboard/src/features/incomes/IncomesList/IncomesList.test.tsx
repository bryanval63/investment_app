import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Suspense } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  deleteIncomeApi,
  getIncomesApi,
  patchIncomeApi,
} from "@/services/incomes/incomes.service";
import { getIncomeTypesRefApi } from "@/services/incomes/income-types-ref.service";
import { createQueryWrapper, normalizeSpaces } from "@/test/test-utils";
import type { IncomeResponseDto } from "@investments/shared";
import { IncomesList } from "./IncomesList";

vi.mock("@/services/incomes/incomes.service", () => ({
  getIncomesApi: vi.fn(),
  patchIncomeApi: vi.fn(),
  deleteIncomeApi: vi.fn(),
}));
vi.mock("@/services/incomes/income-types-ref.service", () => ({
  getIncomeTypesRefApi: vi.fn(),
}));

const income = (
  id: number,
  amount: number,
  date: string,
): IncomeResponseDto =>
  ({
    id,
    amount,
    date,
    type: { code: "SALARY", label: "Salaire" },
  }) as unknown as IncomeResponseDto;

const renderList = () => {
  const Wrapper = createQueryWrapper();
  return render(
    <Wrapper>
      <Suspense fallback={<p>Chargement</p>}>
        <IncomesList year={2026} />
      </Suspense>
    </Wrapper>,
  );
};

/** Tableau desktop (les cartes mobiles dupliquent les cellules sous jsdom). */
const desktopTable = async () => within(await screen.findByRole("table"));

describe("IncomesList", () => {
  beforeEach(() => {
    vi.mocked(getIncomeTypesRefApi).mockResolvedValue([
      { id: 1, code: "SALARY", label: "Salaire" },
      { id: 2, code: "BONUS", label: "Prime" },
    ]);
    vi.mocked(getIncomesApi).mockResolvedValue([
      income(1, 2000, "2026-01-01T00:00:00.000Z"),
      income(2, 2100, "2026-02-01T00:00:00.000Z"),
    ]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("liste chaque saisie de l'année, de la plus récente à la plus ancienne", async () => {
    renderList();
    const table = await desktopTable();

    const rows = table.getAllByRole("row").slice(1);
    expect(normalizeSpaces(rows[0].textContent)).toContain("02/2026");
    expect(normalizeSpaces(rows[0].textContent)).toContain("2 100,00 €");
    expect(normalizeSpaces(rows[1].textContent)).toContain("01/2026");
    expect(getIncomesApi).toHaveBeenCalledWith(2026);
  });

  it("modifie le montant d'une saisie", async () => {
    vi.mocked(patchIncomeApi).mockResolvedValue(
      income(1, 2050.5, "2026-01-01T00:00:00.000Z"),
    );
    renderList();
    const table = await desktopTable();

    await userEvent.click(table.getAllByRole("button", { name: "Éditer" })[1]);
    const amount = table.getByLabelText("Montant du revenu");
    await userEvent.clear(amount);
    await userEvent.type(amount, "2050,5");
    await userEvent.click(table.getByRole("button", { name: "Sauvegarder" }));

    await waitFor(() =>
      expect(patchIncomeApi).toHaveBeenCalledWith(1, {
        amount: 2050.5,
        type: "SALARY",
        date: new Date(Date.UTC(2026, 0, 1)),
      }),
    );
  });

  it("supprime une saisie après confirmation", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    vi.mocked(deleteIncomeApi).mockResolvedValue(undefined);
    renderList();
    const table = await desktopTable();

    await userEvent.click(table.getAllByRole("button", { name: "Supprimer" })[0]);

    await waitFor(() => expect(deleteIncomeApi).toHaveBeenCalledWith(2));
  });

  it("ne supprime rien si la confirmation est refusée", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    renderList();
    const table = await desktopTable();

    await userEvent.click(table.getAllByRole("button", { name: "Supprimer" })[0]);

    expect(deleteIncomeApi).not.toHaveBeenCalled();
  });
});
