import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { IncomesSidebar } from "./layouts/Sidebars/IncomesSidebar";
import { InvestmentsSidebar } from "./layouts/Sidebars/InvestmentsSidebar";
import { IncomesAdd } from "./pages/incomes/IncomesAdd";
import { IncomesOverview } from "./pages/incomes/IncomesOverview";
import { IncomesData } from "./pages/incomes/IncomesData";
import { InvestmentsOverview } from "./pages/investments/InvestmentsOverview";
import { InvestmentsAdd } from "./pages/investments/InvestmentsAdd";
import { InvestmentsTotalGains } from "./pages/investments/InvestmentsTotalGains";
import { InvestmentsPerformances } from "./pages/investments/InvestmentsPerformances";
import { InvestmentsAccounts } from "./pages/investments/InvestmentsAccounts";
import { NetWorthSidebar } from "./layouts/Sidebars/NetWorthSidebar";
import { NetWorthOverview } from "./pages/net-worth/NetWorthOverview";
import { NetWorthAdd } from "./pages/net-worth/NetWorthAdd";
import { TaxAdd } from "./pages/incomes/TaxAdd";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: Dashboard,
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
          },
          {
            Component: IncomesData,
            path: "data",
          },
          {
            Component: IncomesAdd,
            path: "add",
          },
          {
            Component: TaxAdd,
            path: "tax/add",
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
          },
          {
            Component: InvestmentsAdd,
            path: "add",
          },
          {
            Component: InvestmentsTotalGains,
            path: "total-gains",
          },
          {
            Component: InvestmentsPerformances,
            path: "performances",
          },
          {
            Component: InvestmentsAccounts,
            path: "accounts",
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
          },
          {
            Component: NetWorthAdd,
            path: "add",
          },
        ],
      },
    ],
  },
]);
