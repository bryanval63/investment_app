import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Suspense } from "react";
import { getAccountsApi } from "@/services/accounts/accounts.service";
import { getInvestmentsApi } from "@/services/investments/investments.service";
import { createQueryWrapper } from "@/test/test-utils";
import { getCurrentYear } from "@investments/shared/utils/date.utils";
import type { InvestmentListItemResponseDto } from "@investments/shared";
import { InvestmentsManage } from "./InvestmentsManage";

vi.mock("@/services/investments/investments.service", () => ({
  getInvestmentsApi: vi.fn(),
  patchInvestmentApi: vi.fn(),
  deleteInvestmentApi: vi.fn(),
}));
vi.mock("@/services/accounts/accounts.service", () => ({
  getAccountsApi: vi.fn(),
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

const investment = (
  id: number,
  date: string,
): InvestmentListItemResponseDto =>
  ({
    id,
    date,
    accountId: 1,
    account: { name: "PEA" },
    totalAmount: 1000,
    capitalGain: 10,
    transactionAmount: 100,
  }) as unknown as InvestmentListItemResponseDto;

const renderPage = () => {
  const Wrapper = createQueryWrapper();
  return render(
    <Wrapper>
      <Suspense fallback={<p>Chargement</p>}>
        <InvestmentsManage />
      </Suspense>
    </Wrapper>,
  );
};

describe("InvestmentsManage", () => {
  beforeEach(() => {
    vi.mocked(getAccountsApi).mockResolvedValue([]);
    vi.mocked(getInvestmentsApi).mockImplementation(async ({ year } = {}) => [
      investment(year ?? 0, `${year}-06-30T00:00:00.000Z`),
    ]);
  });

  it("charge les investissements de l'année en cours par défaut", async () => {
    renderPage();

    expect(await screen.findByLabelText("Année")).toHaveValue(
      getCurrentYear().toString(),
    );
    expect(getInvestmentsApi).toHaveBeenCalledWith({
      year: getCurrentYear(),
    });
  });

  it("recharge la liste quand on change d'année", async () => {
    renderPage();
    const select = await screen.findByLabelText("Année");

    await userEvent.selectOptions(select, "2022");

    await waitFor(() =>
      expect(getInvestmentsApi).toHaveBeenCalledWith({ year: 2022 }),
    );
    expect(await screen.findAllByText("30/06/2022")).not.toHaveLength(0);
  });
});
