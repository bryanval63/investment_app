import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

/** Normalise les espaces insécables produits par Intl en fr-FR. */
export const normalizeSpaces = (value: string | null | undefined) =>
  (value ?? "").replace(/[^\S\r\n]/g, " ");

export const createQueryWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
