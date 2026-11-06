import { MONTHS_CODE } from "@investments/shared/constants/date.constant";
import z from "zod";
import { decimalNumber } from "@/utils/zod.utils";

export const IncomeSchema = z.object({
  // Référentiel modifiable : les choix viennent de la liste déroulante.
  type: z.string().min(1, "Le type de revenu est requis"),
  amount: decimalNumber(z.coerce.number().positive()),
});

export const IncomesFormSchema = z.object({
  month: z.enum(MONTHS_CODE),
  year: z.coerce.number().min(2000).max(2100).int(),
  incomes: z.array(IncomeSchema).min(1),
});

export const DEFAULT_INCOME: IncomesFormInput["incomes"][number] = {
  type: "SALARY",
  amount: 0,
};

export type IncomesFormInput = z.input<typeof IncomesFormSchema>;
export type IncomesFormOutput = z.infer<typeof IncomesFormSchema>;
