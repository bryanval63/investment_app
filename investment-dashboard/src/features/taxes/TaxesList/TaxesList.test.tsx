import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Suspense } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  deleteTaxApi,
  getTaxesApi,
  patchTaxApi,
} from "@/services/taxes/taxes.service";
import { createQueryWrapper, normalizeSpaces } from "@/test/test-utils";
import { TaxesList } from "./TaxesList";

vi.mock("@/services/taxes/taxes.service", () => ({
  getTaxesApi: vi.fn(),
  patchTaxApi: vi.fn(),
  deleteTaxApi: vi.fn(),
}));

const renderList = () => {
  const Wrapper = createQueryWrapper();
  return render(
    <Wrapper>
      <Suspense fallback={<p>Chargement</p>}>
        <TaxesList />
      </Suspense>
    </Wrapper>,
  );
};

/** Tableau desktop (les cartes mobiles dupliquent les cellules sous jsdom). */
const desktopTable = async () => within(await screen.findByRole("table"));

describe("TaxesList", () => {
  beforeEach(() => {
    vi.mocked(getTaxesApi).mockResolvedValue([
      { id: 1, year: 2024, amount: 265 },
      { id: 2, year: 2025, amount: -209 },
    ]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("liste les impôts de la plus récente à la plus ancienne année", async () => {
    renderList();
    const table = await desktopTable();

    const rows = table.getAllByRole("row").slice(1);
    expect(normalizeSpaces(rows[0].textContent)).toContain("2025");
    expect(normalizeSpaces(rows[0].textContent)).toContain("-209,00 €");
    expect(normalizeSpaces(rows[1].textContent)).toContain("2024");
  });

  it("modifie le montant d'une année, y compris en négatif", async () => {
    vi.mocked(patchTaxApi).mockResolvedValue({
      id: 2,
      year: 2025,
      amount: -300.5,
    });
    renderList();
    const table = await desktopTable();

    await userEvent.click(table.getAllByRole("button", { name: "Éditer" })[0]);
    const amount = table.getByLabelText("Montant de l'impôt");
    await userEvent.clear(amount);
    await userEvent.type(amount, "-300,5");
    await userEvent.click(table.getByRole("button", { name: "Sauvegarder" }));

    await waitFor(() =>
      expect(patchTaxApi).toHaveBeenCalledWith(2, {
        year: 2025,
        amount: -300.5,
      }),
    );
  });

  it("supprime une année après confirmation", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    vi.mocked(deleteTaxApi).mockResolvedValue(undefined);
    renderList();
    const table = await desktopTable();

    await userEvent.click(table.getAllByRole("button", { name: "Supprimer" })[1]);

    await waitFor(() => expect(deleteTaxApi).toHaveBeenCalledWith(1));
  });
});
