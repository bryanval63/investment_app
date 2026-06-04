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
