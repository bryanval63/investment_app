export const getColorAndBgColor = (
  value: number,
  withBackground: boolean = true,
  onlyBackground: boolean = false,
) => {
  const isPositive = value > 0;
  const isNegative = value < 0;

  if (withBackground) {
    if (onlyBackground) {
      return isPositive
        ? "bg-emerald-600/90"
        : isNegative
          ? "bg-red-500/90"
          : "bg-gray-500/90";
    }
    return isPositive
      ? "text-green-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-400/15"
      : isNegative
        ? "text-red-600 dark:text-red-400 bg-red-500/10 dark:bg-red-400/15"
        : "text-gray-500 dark:text-slate-300 bg-gray-500/10 dark:bg-white/10";
  }

  // Variantes dark : lisibles sur le bandeau sombre des résumés (SummarySection).
  return isPositive
    ? "text-green-600 dark:text-emerald-400"
    : isNegative
      ? "text-red-600 dark:text-red-400"
      : "text-gray-500 dark:text-slate-400";
};
