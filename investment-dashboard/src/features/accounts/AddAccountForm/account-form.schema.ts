import { INVESTMENT_CATEGORIES } from "@investments/shared";
import { z } from "zod";

export const AccountFormSchema = z.object({
  name: z.string().min(1, "Le nom du compte est requis"),
  type: z.string().min(1, "Le type de compte est requis"),
  category: z.enum(
    INVESTMENT_CATEGORIES.map((cat) => cat.code) as [string, ...string[]],
    {
      message: "La catégorie de compte est invalide",
    },
  ),
  openingDate: z.string().optional(),
  defaultTransactionAmount: z.coerce
    .number()
    .min(0, "Le montant doit être positif ou nul"),
});

export const DEFAULT_ACCOUNT: AccountFormInput = {
  name: "",
  type: "",
  category: "STOCK",
  openingDate: "",
  defaultTransactionAmount: 0,
};

export type AccountFormInput = z.input<typeof AccountFormSchema>;
export type AccountFormOutput = z.infer<typeof AccountFormSchema>;
