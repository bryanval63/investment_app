# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal investment / income / net-worth tracker ("InvestTrack"). npm-workspaces monorepo with three packages:

- `investment-dashboard/` — React 19 + Vite SPA (PWA), TanStack Query, React Router 7, react-hook-form + zod, Tailwind 4 + shadcn/ui, Recharts.
- `investments-app/` — NestJS 11 REST API, Prisma 7 on SQLite (`better-sqlite3` driver adapter).
- `shared/` (`@investments/shared`) — DTOs, constants, types and pure utils used by both sides. The API contract lives here.

UI text, code comments and many commit messages are in French; keep that style.

## Commands

Run `npm install` once at the repo root (workspaces). All commands below are from the root.

```bash
npm test                                         # tests in every workspace
npm run dev -w investment-dashboard              # front on http://localhost:5173
npm run start:dev -w investments-app             # API on http://localhost:3000 (prestart builds shared)
npm run build -w @investments/shared             # needed before building/running the API
npm run build -w investment-dashboard            # tsc -b && vite build
npm run lint -w investment-dashboard
npm run lint -w investments-app                  # runs eslint --fix
npm run format -w investments-app                # prettier
```

Single tests:

```bash
npx -w investment-dashboard vitest run src/utils/format.utils.test.ts   # front (vitest, jsdom)
npx -w shared vitest run src/utils/date.utils.test.ts                    # shared (vitest)
npm test -w investments-app -- tax.utils                                 # back (jest, *.spec.ts under src/)
```

Prisma (schema in `investments-app/prisma/schema.prisma`, config in `prisma.config.ts`, needs `DATABASE_URL` from `investments-app/.env`):

```bash
npm run prisma -w investments-app -- migrate dev --name <name>
npm run prisma -w investments-app -- generate
npm run prisma:studio -w investments-app
```

The generated client is emitted to the **root** `node_modules/.prisma/client` (see `output` in the schema), not the workspace's.

## How the pieces connect

- **Shared package resolution differs per consumer**: the dashboard aliases `@investments/shared` to `shared/src` (vite.config.ts), so changes are live; the API's tsconfig points to `shared/dist`, so after editing `shared/` you must rebuild it (`npm run build -w @investments/shared`) before the API sees the change. Export everything new from `shared/src/index.ts`.
- **API calls**: the front uses `api()` in `src/utils/fetch.utils.ts`, prefixing `VITE_API_URL` (from `investment-dashboard/.env`). In production nginx serves the SPA and proxies `/api/` → `backend:3000/` (prefix stripped), so Nest controllers have no global prefix. CORS in `main.ts` only allows `http://localhost:5173`.
- **Adding an endpoint end-to-end**: DTO in `shared/src/dtos/<domain>/` → Nest module in `investments-app/src/modules/<domain>/` → front service in `investment-dashboard/src/services/<domain>/` → hooks/components in `src/features/<domain>/` → page in `src/pages/` wired in `src/router.tsx`.

## Backend conventions (`investments-app/src/modules/<domain>/`)

Each module is `*.module.ts` / `*.controller.ts` / `*.service.ts`, plus where relevant:
- `*.select.ts` — Prisma `select` objects built with `Prisma.validator`, reused for queries and to derive row types (`*.type.ts`).
- `*.mapper.ts` — maps Prisma rows to shared response DTOs (e.g. relation → its `code`, `Date` → ISO string). Services return DTOs, never raw Prisma models.
- `PrismaService` (global `PrismaModule`) extends `PrismaClient` with the better-sqlite3 adapter; defaults to `file:./dev.db` if `DATABASE_URL` is unset.
- Reference tables (`IncomeTypeRef`, `InvestmentTypeRef`, `InvestmentCategoryRef`) are user-extensible: codes are derived from labels via `modules/reference/reference.utils.ts` (`buildReferenceCode`). Other models link to refs by id but the API exchanges the `code` string.

## Frontend conventions (`investment-dashboard/src/`)

- `@/` alias → `src/`. `components/ui/` is shadcn-generated (config in `components.json`); custom reusable pieces go in `components/custom/`.
- `features/<domain>/` holds domain components; forms follow `XxxForm.tsx` + `useXxxForm.ts` + `xxx-form.schema.ts` (zod), submitting through `hooks/useFormMutation.ts`.
- Data loading uses `useSuspenseQuery`; `MainLayout` wraps the `<Outlet />` in `<Suspense>` and the root route has an `errorElement`. After mutations, invalidate the relevant query keys (string keys like `["accounts"]`, `["investments"]`, `["investmentsOverview"]`).
- Routing: each top-level section sets `handle.sidebar`; `MainLayout` renders the sidebar of the deepest matched route that has a handle.
- Layout must work on mobile (`hooks/useIsMobile.ts`; `DataTable` has a `DataTableMobileCards` variant).
- Tests: vitest + Testing Library, setup in `src/test/setup.ts`; `src/test/test-utils.tsx` provides `createQueryWrapper()` and `normalizeSpaces()` (fr-FR `Intl` output contains non-breaking spaces). The setup stubs `window.matchMedia` with `matches: false`, so `useIsMobile()` is desktop by default; spy on `window.matchMedia` to test mobile behaviour.

## UI design system (`investment-dashboard/src/components/custom/`)

The look is shared through components: change the shared piece rather than restyling one screen, so the whole app stays consistent. Style reference: slate neutrals + indigo accent (header/nav), `rounded-xl` cards, labels `text-xs font-medium uppercase tracking-wide text-muted-foreground`, numbers `tabular-nums`, positive emerald / negative red (`utils/style.utils.ts#getColorAndBgColor`).

- **Charts** (`charts/`): colours, axis, grid and zero-line props come from `chart-theme.ts` (`CHART_COLORS`, `SERIES_COLORS`/`getSeriesColor`, `getValueColor`, `axisProps`, `gridProps`, `zeroLineProps`); never hard-code colours or use `var(--chart-n)`. Formatting in `custom-chart.utils.ts` (axis amounts are compact via `formatToCompactEuro`, « 40 k€ »). Tooltips render `CustomTooltip/ChartTooltipCard`.
  - `CustomAreaChart` (gradient; `tone="auto"` = green/red by last value, for perf and capital-gain curves), `CustomBarChart` (vertical only; `displayLabels` puts `BarLabel` at the bar end, auto-hidden when bars are narrow), `RankedBarList` (ranked rows with progress bars; use it instead of horizontal bar charts), `summary/Sparkline`.
  - Recharts gotchas: put `<Tooltip>` **before** `<Bar>` in the JSX (the hover cursor is painted at the Tooltip's position and would hide the hovered bar); in a custom bar `shape`, negative bars get a negative `height` with `y` at the bar end, so a single `radius={[6, 6, 0, 0]}` rounds the outer end of both signs. Animations stall while the preview pane is hidden, so charts can look empty in screenshots.
- **Cards and layout**: `containers/CardContainer` for every chart/content card (`title`, optional `description`, `action` slot on the right for period switch or pagination); `summary/SummarySection` + `SummaryHero` + `KpiTile`/`KpiValue` for page summaries; `containers/SectionCard` for form/settings sections; `containers/PageToolbar` + `ToolbarField` for page filters (with `CustomSelect variant="pill"`, `Switch` for booleans); `fields/SegmentedControl` for 2–4 exclusive options.
- **Tables**: `DataTable` (+ `mobileCards`); row actions with `DataTable/IconActionButton`.
- **Forms**: `form/FormActions` (`RemoveRowButton`, `AddRowButton`, `SubmitButton`, `FormFooter`, `FormSubmitError`), `form/InputWithSuffix` for units (%, €, ans).

## Deployment

`docker-compose.yml` builds `backend` (runs `prisma migrate deploy` on start, SQLite in the `sqlite_data` volume) and `frontend` (nginx on 8443 with Tailscale certs, root `nginx.conf`). Both Dockerfiles use the repo root as build context. `deploy.sh` (on the server) does `git pull origin main` + `docker compose up -d --build`.

## Preview

`.claude/launch.json` defines the `investment-dashboard` preview (Vite on port 5173). The API must be running separately for pages to load data.
