import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Suspense } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  deleteNetWorthApi,
  getNetWorthesApi,
  patchNetWorthApi,
} from "@/services/net-worthes/net-worthes.service";
import { createQueryWrapper, normalizeSpaces } from "@/test/test-utils";
import type { NetWorthResponseDto } from "@investments/shared";
import { NetWorthList } from "./NetWorthList";

vi.mock("@/services/net-worthes/net-worthes.service", () => ({
  getNetWorthesApi: vi.fn(),
  patchNetWorthApi: vi.fn(),
  deleteNetWorthApi: vi.fn(),
}));

const netWorth = (
  id: number,
  amount: number,
  month: number,
): NetWorthResponseDto => ({
  id,
  amount,
  date: new Date(Date.UTC(2026, month, 1)),
});

const renderList = () => {
  const Wrapper = createQueryWrapper();
  return render(
    <Wrapper>
      <Suspense fallback={<p>Chargement</p>}>
        <NetWorthList />
      </Suspense>
    </Wrapper>,
  );
};

/** Tableau desktop (les cartes mobiles dupliquent les cellules sous jsdom). */
const desktopTable = async () => within(await screen.findByRole("table"));

describe("NetWorthList", () => {
  beforeEach(() => {
    vi.mocked(getNetWorthesApi).mockResolvedValue([
      netWorth(1, 100000, 0),
      netWorth(2, 110000, 1),
    ]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("liste les montants du plus récent au plus ancien, avec la variation", async () => {
    renderList();
    const table = await desktopTable();

    const rows = table.getAllByRole("row").slice(1);
    const latest = normalizeSpaces(rows[0].textContent);
    expect(latest).toContain("02/2026");
    expect(latest).toContain("110 000,00 €");
    expect(latest).toContain("+10 000,00 €");
    expect(normalizeSpaces(rows[1].textContent)).toContain("01/2026");
  });

  it("modifie le montant d'un mois", async () => {
    vi.mocked(patchNetWorthApi).mockResolvedValue(netWorth(1, 99500, 0));
    renderList();
    const table = await desktopTable();

    await userEvent.click(table.getAllByRole("button", { name: "Éditer" })[1]);
    const amount = table.getByLabelText("Montant du patrimoine");
    await userEvent.clear(amount);
    await userEvent.type(amount, "99 500");
    await userEvent.click(table.getByRole("button", { name: "Sauvegarder" }));

    await waitFor(() =>
      expect(patchNetWorthApi).toHaveBeenCalledWith(1, {
        amount: 99500,
        date: new Date(Date.UTC(2026, 0, 1)),
      }),
    );
  });

  it("supprime un mois après confirmation", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    vi.mocked(deleteNetWorthApi).mockResolvedValue(undefined);
    renderList();
    const table = await desktopTable();

    await userEvent.click(table.getAllByRole("button", { name: "Supprimer" })[0]);

    await waitFor(() => expect(deleteNetWorthApi).toHaveBeenCalledWith(2));
  });
});
