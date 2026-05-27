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
      ? "text-green-600 bg-emerald-500/10"
      : isNegative
        ? "text-red-600 bg-red-500/10"
        : "text-gray-500 bg-gray-500/10";
  }

  return isPositive
    ? "text-green-600"
    : isNegative
      ? "text-red-600"
      : "text-gray-500";
};
