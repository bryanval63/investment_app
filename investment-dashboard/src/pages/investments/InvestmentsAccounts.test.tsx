import { render, screen } from "@testing-library/react";
import { Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getAccountsApi } from "@/services/accounts/accounts.service";
import { createQueryWrapper } from "@/test/test-utils";
import type { AccountResponseDto } from "@investments/shared";
import { InvestmentsAccounts } from "./InvestmentsAccounts";

vi.mock("@/services/accounts/accounts.service", () => ({
  getAccountsApi: vi.fn(),
}));
// Les graphiques et cartes chargent leurs propres données : on vérifie
// seulement le compte qui leur est transmis.
vi.mock(
  "@/features/investments/InvestmentsAccountsCards/InvestmentsAccountsCards",
  () => ({
    InvestmentsAccountsCards: ({ accountId }: { accountId: number }) => (
      <p data-testid="account-content">{accountId}</p>
    ),
  }),
);
vi.mock("@/features/investments/charts/accounts/InvestmentsAreaChartAccount", () => ({
  InvestmentsAreaChartAccount: () => null,
}));
vi.mock("@/features/investments/charts/accounts/InvestmentsBarChartAccount", () => ({
  InvestmentsBarChartAccountProps: () => null,
}));
vi.mock(
  "@/features/investments/charts/accounts/InvestmentsYearlyBarChartAccount",
  () => ({ InvestmentsYearlyBarChartAccount: () => null }),
);

const account = (id: number, name: string, isClosed: boolean) =>
  ({ id, name, isClosed }) as AccountResponseDto;

const renderPage = () => {
  const Wrapper = createQueryWrapper();
  return render(
    <Wrapper>
      <Suspense fallback={<p>Chargement</p>}>
        <InvestmentsAccounts />
      </Suspense>
    </Wrapper>,
  );
};

describe("InvestmentsAccounts", () => {
  beforeEach(() => {
    vi.mocked(getAccountsApi).mockReset();
  });

  it("présélectionne le premier compte ouvert, pas le compte n°1", async () => {
    vi.mocked(getAccountsApi).mockResolvedValue([
      account(1, "Ancien PEA", true),
      account(3, "CTO", false),
      account(4, "Assurance-vie", false),
    ]);

    renderPage();

    expect(await screen.findByTestId("account-content")).toHaveTextContent(
      "3",
    );
  });

  it("affiche un message quand aucun compte n'est ouvert", async () => {
    vi.mocked(getAccountsApi).mockResolvedValue([
      account(1, "Ancien PEA", true),
    ]);

    renderPage();

    expect(await screen.findByText("Aucun compte ouvert.")).toBeInTheDocument();
    expect(screen.queryByTestId("account-content")).toBeNull();
  });
});
