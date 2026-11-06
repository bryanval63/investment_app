import { Header } from "./Header/Header";
import { Suspense } from "react";
import { Outlet, useMatches } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import type { AppMatch } from "./layouts.type";

// Affiché pendant que les données d'une page sont en cours de chargement.
const PageLoader = () => (
  <div
    role="status"
    aria-busy="true"
    className="flex flex-col gap-3 lg:gap-4 xl:gap-8"
  >
    <span className="sr-only">Chargement...</span>
    <div className="h-36 animate-pulse rounded-xl bg-slate-100 lg:h-44" />
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          className="h-24 animate-pulse rounded-xl bg-slate-100"
        />
      ))}
    </div>
    <div className="h-64 animate-pulse rounded-xl bg-slate-100" />
  </div>
);

export const MainLayout = () => {
  const matches = useMatches() as AppMatch[];
  const routeWithHandle = [...matches].reverse().find((m) => m.handle);

  const Sidebar = routeWithHandle?.handle?.sidebar;

  return (
    <div className="h-dvh bg-linear-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 from-slate-50 via-slate-200 to-slate-50 flex flex-col overflow-hidden">
      <Header />

      {/* Sous lg : le padding bas réserve la place du menu flottant pour que la fin du contenu reste visible. */}
      <div className="flex flex-1 min-h-0 p-2 pb-[calc(5.5rem+env(safe-area-inset-bottom))] gap-3 lg:p-4 lg:gap-4 xl:p-8 xl:gap-8 justify-between overflow-auto lg:overflow-hidden flex-col lg:flex-row">
        {/* Sous lg : menu flottant fixé en bas de l'écran, au-dessus du contenu. */}
        <aside className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-40 lg:static lg:inset-auto lg:z-auto shrink-0 lg:w-60 xl:w-80">
          <Card className="h-full futuristic-card futuristic-border rounded-full lg:rounded-2xl p-1.5 px-2 lg:p-6 xl:p-8 shadow-xl shadow-slate-900/15 lg:shadow-sm">
            {Sidebar && <Sidebar />}
          </Card>
        </aside>

        <main className="flex-1 min-w-0 lg:min-h-full">
          <Card className="h-full lg:p-4 xl:p-8 futuristic-card futuristic-border lg:overflow-hidden">
            {/* lg : le padding bas (compensé par la marge négative) évite que l'overflow rogne l'ombre des dernières cards. */}
            <CardContent className="flex-1 relative lg:px-4 xl:px-8 lg:overflow-auto lg:pb-4 lg:-mb-4">
              <Suspense fallback={<PageLoader />}>
                <Outlet />
              </Suspense>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};
