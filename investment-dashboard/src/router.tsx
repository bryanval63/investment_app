import { createBrowserRouter, Navigate } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { IncomesSidebar } from "./layouts/Sidebars/IncomesSidebar";
import { InvestmentsSidebar } from "./layouts/Sidebars/InvestmentsSidebar";
import { IncomesAdd } from "./pages/incomes/IncomesAdd";
import { IncomesOverview } from "./pages/incomes/IncomesOverview";
import { IncomesData } from "./pages/incomes/IncomesData";
import { IncomesEntries } from "./pages/incomes/IncomesEntries";
import { InvestmentsOverview } from "./pages/investments/InvestmentsOverview";
import { InvestmentsAdd } from "./pages/investments/InvestmentsAdd";
import { InvestmentsAddAccount } from "./pages/investments/InvestmentsAddAccount";
import { InvestmentsTotalGains } from "./pages/investments/InvestmentsTotalGains";
import { InvestmentsPerformances } from "./pages/investments/InvestmentsPerformances";
import { InvestmentsAccounts } from "./pages/investments/InvestmentsAccounts";
import { InvestmentsManage } from "./pages/investments/InvestmentsManage";
import { InvestmentsManageAccounts } from "./pages/investments/InvestmentsManageAccounts";
import { NetWorthSidebar } from "./layouts/Sidebars/NetWorthSidebar";
import { AccountsSidebar } from "./layouts/Sidebars/AccountsSidebar";
import { NetWorthOverview } from "./pages/net-worth/NetWorthOverview";
import { NetWorthAdd } from "./pages/net-worth/NetWorthAdd";
import { NetWorthData } from "./pages/net-worth/NetWorthData";
import { TaxAdd } from "./pages/taxes/TaxAdd";
import { TaxesData } from "./pages/taxes/TaxesData";
import { TaxesSidebar } from "./layouts/Sidebars/TaxesSidebar";
import { Settings } from "./pages/settings/Settings";
import { SettingsReferences } from "./pages/settings/SettingsReferences";
import { SettingsSidebar } from "./layouts/Sidebars/SettingsSidebar";

// Pages qui commencent par un résumé sombre : leur squelette de chargement l'annonce.
const SUMMARY_PAGE = { pageLoader: "summary" } as const;

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    // Erreur de chargement d'une page (requête Suspense en échec)
    errorElement: (
      <div className="p-8 text-sm text-red-600">
        Impossible de charger cette page. Réessaie dans un instant.
      </div>
    ),
    handle: {
      sidebar: InvestmentsSidebar,
    },
    children: [
      {
        index: true,
        Component: () => <Navigate to="/investments" replace />,
      },
      {
        path: "incomes",
        handle: {
          sidebar: IncomesSidebar,
        },
        children: [
          {
            index: true,
            Component: IncomesOverview,
            handle: SUMMARY_PAGE,
          },
          {
            Component: IncomesData,
            path: "data",
          },
          {
            Component: IncomesEntries,
            path: "entries",
          },
          {
            Component: IncomesAdd,
            path: "add",
          },
          {
            // Ancienne adresse : les impôts ont maintenant leur propre section.
            Component: () => <Navigate to="/taxes/add" replace />,
            path: "tax/add",
          },
        ],
      },
      {
        path: "taxes",
        handle: {
          sidebar: TaxesSidebar,
        },
        children: [
          {
            index: true,
            Component: TaxesData,
          },
          {
            Component: TaxAdd,
            path: "add",
          },
        ],
      },
      {
        path: "investments",
        handle: {
          sidebar: InvestmentsSidebar,
        },
        children: [
          {
            index: true,
            Component: InvestmentsOverview,
            handle: SUMMARY_PAGE,
          },
          {
            Component: InvestmentsAdd,
            path: "add",
          },
          {
            Component: () => <Navigate to="/accounts/add" replace />,
            path: "add-account",
          },
          {
            Component: InvestmentsTotalGains,
            path: "total-gains",
          },
          {
            Component: InvestmentsManage,
            path: "manage",
          },
          {
            Component: () => <Navigate to="/accounts/manage" replace />,
            path: "manage-accounts",
          },
          {
            Component: InvestmentsPerformances,
            path: "performances",
          },
          {
            Component: InvestmentsAccounts,
            path: "accounts",
            handle: SUMMARY_PAGE,
          },
        ],
      },
      {
        path: "accounts",
        handle: {
          sidebar: AccountsSidebar,
        },
        children: [
          {
            index: true,
            Component: () => <Navigate to="/accounts/manage" replace />,
          },
          {
            Component: InvestmentsAddAccount,
            path: "add",
          },
          {
            Component: InvestmentsManageAccounts,
            path: "manage",
          },
        ],
      },
      {
        path: "net-worth",
        handle: {
          sidebar: NetWorthSidebar,
        },
        children: [
          {
            index: true,
            Component: NetWorthOverview,
            handle: SUMMARY_PAGE,
          },
          {
            Component: NetWorthData,
            path: "data",
          },
          {
            Component: NetWorthAdd,
            path: "add",
          },
        ],
      },
      {
        path: "settings",
        handle: {
          sidebar: SettingsSidebar,
        },
        children: [
          {
            index: true,
            Component: () => <Navigate to="/settings/taxes" replace />,
          },
          {
            path: "taxes",
            Component: Settings,
          },
          {
            path: "references",
            Component: SettingsReferences,
          },
        ],
      },
    ],
  },
]);
