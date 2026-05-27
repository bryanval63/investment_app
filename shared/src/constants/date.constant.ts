export const MONTHS = [
  {
    code: "january",
    label: "Janvier",
  },
  {
    code: "february",
    label: "Février",
  },
  {
    code: "march",
    label: "Mars",
  },
  {
    code: "april",
    label: "Avril",
  },
  {
    code: "may",
    label: "Mai",
  },
  {
    code: "june",
    label: "Juin",
  },
  {
    code: "july",
    label: "Juillet",
  },
  {
    code: "august",
    label: "Août",
  },
  {
    code: "september",
    label: "Septembre",
  },
  {
    code: "october",
    label: "Octobre",
  },
  {
    code: "november",
    label: "Novembre",
  },
  {
    code: "december",
    label: "Décembre",
  },
] as const;

export const MONTHS_CODE = MONTHS.map((m) => m.code);
export const MONTHS_LABEL = MONTHS.map((m) => m.label);
