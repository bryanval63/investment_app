export const formatToEuro = (
  amount: number,
  options?: Intl.NumberFormatOptions,
) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    ...options,
  }).format(amount);
};

export const formatToPercentage = (
  value: number,
  options?: Intl.NumberFormatOptions,
) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "percent",
    minimumFractionDigits: 2,
    ...options,
  }).format(value);
};

export const formatToReadableDate = (
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
  },
) => {
  return new Intl.DateTimeFormat("fr-FR", options).format(date);
};

/** Montant en milliers d'euros avec une décimale max, ex. 1234 → "1,2 k€". */
export const formatToThousandsEuro = (amount: number) =>
  `${new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 1,
  }).format(amount / 1000)} k€`;

/**
 * Montant court pour les axes et libellés de graphiques :
 * 950 → "950 €", 40 000 → "40 k€", 1 250 000 → "1,3 M€".
 */
export const formatToCompactEuro = (
  amount: number,
  options?: Intl.NumberFormatOptions,
) => {
  const abs = Math.abs(amount);
  const [divisor, suffix] =
    abs >= 1_000_000 ? [1_000_000, " M€"] : abs >= 1000 ? [1000, " k€"] : [1, " €"];

  return `${new Intl.NumberFormat("fr-FR", {
    // Millions : une décimale par défaut, sinon arrondi à l'unité.
    maximumFractionDigits: divisor === 1_000_000 ? 1 : 0,
    ...options,
  }).format(amount / divisor)}${suffix}`;
};
