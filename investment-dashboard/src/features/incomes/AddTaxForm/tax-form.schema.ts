import { getCurrentYear } from "@investments/shared";
import z from "zod";

export const TaxFormSchema = z.object({
  year: z.coerce.number().min(2000).max(2100).int(),
  amount: z.coerce.number().positive(),
});

export const DEFAULT_TAX: TaxFormInput = {
  amount: 0,
  year: getCurrentYear() - 1,
};

export type TaxFormInput = z.input<typeof TaxFormSchema>;
export type TaxFormOutput = z.infer<typeof TaxFormSchema>;
