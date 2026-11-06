import {
  formatToCompactEuro,
  formatToEuro,
  formatToPercentage,
} from "@/utils/format.utils";
import type { CustomChartUnit } from "./custom-chart.type";

/** Graduations de l'axe des valeurs : euros compacts (« 40 k€ ») ou pourcentages. */
export const getTickFormatterYAxis = (unit: CustomChartUnit) => {
  return unit === "eur"
    ? (value: number) => formatToCompactEuro(value)
    : (value: number) =>
        formatToPercentage(value, { minimumFractionDigits: 0 });
};

/** Valeur complète, utilisée dans les tooltips. */
export const formatChartValue = (value: number, unit: CustomChartUnit) =>
  unit === "eur" ? formatToEuro(value) : formatToPercentage(value);

/** Valeur courte, utilisée dans les libellés de barres. */
export const formatChartLabel = (value: number, unit: CustomChartUnit) =>
  unit === "eur"
    ? formatToCompactEuro(value, { maximumFractionDigits: 1 })
    : formatToPercentage(value, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      });

/** Vrai si les valeurs traversent zéro (pour afficher la ligne du zéro). */
export const crossesZero = (values: (number | undefined)[]) => {
  const numbers = values.filter((value): value is number =>
    Number.isFinite(value),
  );
  return numbers.some((value) => value < 0) && numbers.some((v) => v > 0);
};
