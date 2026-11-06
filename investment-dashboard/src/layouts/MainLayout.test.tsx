import { act, render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { MainLayout } from "./MainLayout";

// Le header charge ses propres données : hors sujet ici.
vi.mock("./Header/Header", () => ({ Header: () => null }));

// Page dont les données n'arrivent jamais : elle reste suspendue.
const neverResolving = new Promise<never>(() => {});
const SuspendedPage = () => {
  throw neverResolving;
};

describe("MainLayout", () => {
  it("affiche le squelette dès la navigation vers une page qui charge, au lieu de figer l'ancienne", async () => {
    const router = createMemoryRouter(
      [
        {
          path: "/",
          Component: MainLayout,
          children: [
            { path: "a", Component: () => <p>Page A</p> },
            { path: "b", Component: SuspendedPage },
          ],
        },
      ],
      { initialEntries: ["/a"] },
    );
    render(<RouterProvider router={router} />);
    expect(screen.getByText("Page A")).toBeInTheDocument();

    await act(() => router.navigate("/b"));

    expect(screen.queryByText("Page A")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
