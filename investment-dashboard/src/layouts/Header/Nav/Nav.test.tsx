import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { MobileNav } from "./Nav";
import { getActiveNavItem } from "./nav.config";

const renderMobileNav = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <MobileNav />
    </MemoryRouter>,
  );

describe("getActiveNavItem", () => {
  it.each([
    ["/", "Investissements"],
    ["/investments/performances", "Investissements"],
    ["/incomes/data", "Revenus"],
    ["/net-worth", "Capital"],
    ["/accounts/manage", "Comptes"],
    ["/settings/taxes", "Paramètres"],
  ])("%s → %s", (pathname, label) => {
    expect(getActiveNavItem(pathname)?.label).toBe(label);
  });

  it("renvoie undefined pour une route inconnue", () => {
    expect(getActiveNavItem("/inconnu")).toBeUndefined();
  });
});

describe("MobileNav", () => {
  it("affiche la section courante dans le bouton du menu", () => {
    renderMobileNav("/incomes/data");

    const button = screen.getByRole("button", { name: /section revenus/i });
    expect(button).toHaveTextContent("Revenus");
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("ouvre le menu des sections au clic", async () => {
    renderMobileNav("/settings/taxes");

    const button = screen.getByRole("button", { name: /section paramètres/i });
    await userEvent.click(button);

    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: /investissements/i })).toBeVisible();
  });
});
