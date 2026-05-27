import { Header } from "./Header/Header";
import { Outlet, useMatches } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import type { AppMatch } from "./layouts.type";

export const MainLayout = () => {
  const matches = useMatches() as AppMatch[];
  const routeWithHandle = [...matches].reverse().find((m) => m.handle);

  const Sidebar = routeWithHandle?.handle?.sidebar;

  return (
    <div className="h-screen bg-linear-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 from-slate-50 via-slate-200 to-slate-50 flex flex-col overflow-hidden">
      <Header />

      <div className="flex flex-1 p-8 gap-8 justify-between overflow-hidden">
        <aside className="w-80">
          <Card className="h-full futuristic-card futuristic-border p-8">
            {Sidebar && <Sidebar />}
          </Card>
        </aside>

        <main className="min-h-full flex-1">
          <Card className="h-full p-8 futuristic-card futuristic-border overflow-hidden">
            <CardContent className="flex-1 relative px-8 overflow-auto">
              <Outlet />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};
