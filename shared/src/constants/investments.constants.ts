export const INVESTMENT_CATEGORIES = [
  {
    code: "ALL",
    label: "Tout",
  },
  {
    code: "STOCK",
    label: "Actions",
  },
  {
    code: "SCPI",
    label: "SCPI",
  },
  {
    code: "OTHER",
    label: "Divers (or)",
  },
  {
    code: "CRYPTO",
    label: "Cryptomonnaies",
  },
] as const;

export const INVESTMENT_COLUMN_MAP = ["totalAmount", "capitalGain"] as const;
