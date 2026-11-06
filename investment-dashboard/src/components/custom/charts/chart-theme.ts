// Thème commun à tous les graphiques : couleurs et styles d'axes partagés,
// pour garder un rendu homogène dans toute l'application.

export const CHART_COLORS = {
  /** Accent de l'application (logo, navigation). */
  accent: "#6366f1",
  positive: "#059669",
  negative: "#ef4444",
  neutral: "#94a3b8",
  grid: "#e2e8f0",
  tick: "#94a3b8",
  cursor: "#f1f5f9",
} as const;

/** Palette des séries multiples (comptes, catégories, donut). */
export const SERIES_COLORS = [
  "#6366f1", // indigo
  "#14b8a6", // teal
  "#f59e0b", // ambre
  "#ec4899", // rose
  "#0ea5e9", // bleu ciel
  "#8b5cf6", // violet
  "#84cc16", // lime
  "#f97316", // orange
  "#64748b", // ardoise
  "#06b6d4", // cyan
] as const;

export const getSeriesColor = (index: number) =>
  SERIES_COLORS[index % SERIES_COLORS.length];

/** Vert si positif, rouge si négatif, gris si nul. */
export const getValueColor = (value: number) =>
  value > 0
    ? CHART_COLORS.positive
    : value < 0
      ? CHART_COLORS.negative
      : CHART_COLORS.neutral;

export const AXIS_TICK = { fontSize: 11, fill: CHART_COLORS.tick } as const;

/** Props communes aux axes X/Y. */
export const axisProps = {
  tickLine: false,
  axisLine: false,
  tick: AXIS_TICK,
  tickMargin: 8,
} as const;

/** Props communes à la grille. */
export const gridProps = {
  vertical: false,
  strokeDasharray: "3 3",
  stroke: CHART_COLORS.grid,
} as const;

/** Ligne du zéro, discrète. */
export const zeroLineProps = {
  y: 0,
  stroke: "#cbd5e1",
  strokeWidth: 1,
} as const;
