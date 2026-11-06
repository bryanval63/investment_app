import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getAccountsApi } from "@/services/accounts/accounts.service";
import {
  getSettingsApi,
  updateSettingApi,
} from "@/services/settings/settings.service";
import { createQueryWrapper } from "@/test/test-utils";
import type { AccountResponseDto } from "@investments/shared";
import { Settings } from "./Settings";

vi.mock("@/services/accounts/accounts.service", () => ({
  getAccountsApi: vi.fn(),
}));
vi.mock("@/services/settings/settings.service", () => ({
  getSettingsApi: vi.fn(),
  updateSettingApi: vi.fn(),
}));

const renderPage = () => {
  const Wrapper = createQueryWrapper();
  return render(
    <Wrapper>
      <Suspense fallback={<p>Chargement</p>}>
        <Settings />
      </Suspense>
    </Wrapper>,
  );
};

describe("Settings — frais d'entrée SCPI", () => {
  beforeEach(() => {
    vi.mocked(getAccountsApi).mockResolvedValue([
      { id: 7, name: "SCPI renommée", type: "SCPI" } as AccountResponseDto,
    ]);
    vi.mocked(getSettingsApi).mockResolvedValue([
      { key: "ENTRY_FEE_RATE", scope: "ACCOUNT:7", value: 0.11964 },
    ]);
    vi.mocked(updateSettingApi).mockImplementation(async (setting) => setting);
  });

  it("lit le taux par id de compte, même après renommage", async () => {
    renderPage();

    expect(await screen.findByLabelText("SCPI renommée")).toHaveValue(11.964);
  });

  it("enregistre le taux avec la portée du compte", async () => {
    renderPage();

    const input = await screen.findByLabelText("SCPI renommée");
    await userEvent.clear(input);
    await userEvent.type(input, "12");
    await userEvent.click(screen.getByRole("button", { name: /enregistrer/i }));

    await waitFor(() =>
      expect(
        vi.mocked(updateSettingApi).mock.calls.map(([setting]) => setting),
      ).toContainEqual({ scope: "ACCOUNT:7", key: "ENTRY_FEE_RATE", value: 0.12 }),
    );
  });
});
