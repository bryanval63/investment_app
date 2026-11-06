/*
 * Saisies mensuelles (revenus, patrimoine) : la date est le 1er du mois en UTC
 * (cf. createDateNormalizedByMonthAndYear). On lit donc mois et année en UTC
 * pour ne pas basculer sur le mois précédent selon le fuseau.
 */

const pad = (value: number) => value.toString().padStart(2, "0");

/** « 01/2026 » */
export const formatMonthYear = (date: Date | string) => {
  const d = new Date(date);
  return `${pad(d.getUTCMonth() + 1)}/${d.getUTCFullYear()}`;
};

/** Valeur d'un `<input type="month">` : « 2026-01 ». */
export const toMonthInputValue = (date: Date | string) => {
  const d = new Date(date);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}`;
};

/** « 2026-01 » → 1er janvier 2026 en UTC ; `null` si la valeur est invalide. */
export const fromMonthInputValue = (value: string): Date | null => {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return null;
  const month = Number(match[2]);
  if (month < 1 || month > 12) return null;
  return new Date(Date.UTC(Number(match[1]), month - 1, 1));
};
