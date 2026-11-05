import { getCurrentYear } from "@investments/shared";

const YEARS_RANGE = 100;

/** Années proposées : de l'année courante + 100 à l'année courante - 100. */
export const buildPickerYears = (range = YEARS_RANGE) => {
  const currentYear = getCurrentYear();
  return Array.from(
    { length: range * 2 + 1 },
    (_, index) => currentYear + range - index,
  );
};

/** Premier jour du mois de la date donnée, éventuellement décalé de `offset` mois. */
export const startOfMonth = (date: Date, offset = 0) =>
  new Date(date.getFullYear(), date.getMonth() + offset, 1);

/** Convertit une valeur `aaaa-mm-jj` en date locale. */
export const toDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

/** Convertit une date locale en valeur `aaaa-mm-jj`. */
export const toValue = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;

export const toDisplayValue = (date: Date) => date.toLocaleDateString("fr-FR");

/** Valeur affichée dans le champ (`jj/mm/aaaa`) à partir de `aaaa-mm-jj`. */
export const toInputValue = (value?: string | null) =>
  value ? toDisplayValue(toDate(value)) : "";

/** Parse une saisie `jj/mm/aaaa` (séparateurs / . - ou espace) ; null si invalide. */
export const parseInputValue = (value: string) => {
  const match = value.trim().match(/^(\d{1,2})[/. -](\d{1,2})[/. -](\d{4})$/);
  if (!match) return null;

  const [, day, month, year] = match.map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
    ? date
    : null;
};

/** Grille du mois (semaine commençant le lundi) : `null` pour les cases vides. */
export const buildCalendarDays = (month: Date): (number | null)[] => {
  const offset = (startOfMonth(month).getDay() + 6) % 7;
  const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  return [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: count }, (_, index) => index + 1),
  ];
};
