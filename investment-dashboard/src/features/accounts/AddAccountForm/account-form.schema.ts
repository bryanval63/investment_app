import { z } from "zod";
import { decimalNumber } from "@/utils/zod.utils";

export const AccountFormSchema = z.object({
  name: z.string().min(1, "Le nom du compte est requis"),
  type: z.string().min(1, "Le type de compte est requis"),
  // Catégories éditables dans les paramètres : les choix viennent du
  // référentiel en base (liste déroulante), pas d'une liste figée.
  category: z.string().min(1, "La catégorie de compte est requise"),
  openingDate: z.string().optional(),
  defaultTransactionAmount: decimalNumber(
    z.coerce.number().min(0, "Le montant doit être positif ou nul"),
  ),
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
