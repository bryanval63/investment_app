import { getCurrentYear } from "@investments/shared";
import z from "zod";
import { decimalNumber } from "@/utils/zod.utils";

export const TaxFormSchema = z.object({
  year: z.coerce.number().min(2000).max(2100).int(),
  // Négatif : impôt payé ; positif : remboursement.
  amount: decimalNumber(
    z.coerce.number().refine((value) => value !== 0, {
      message: "Le montant ne peut pas être nul",
    }),
  ),
});

export const DEFAULT_TAX: TaxFormInput = {
  amount: 0,
  year: getCurrentYear() - 1,
};

export type TaxFormInput = z.input<typeof TaxFormSchema>;
export type TaxFormOutput = z.infer<typeof TaxFormSchema>;
