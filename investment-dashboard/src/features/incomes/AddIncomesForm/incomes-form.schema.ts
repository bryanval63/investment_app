import { MONTHS_CODE } from "@investments/shared/constants/date.constant";
import { IncomeType } from "@investments/shared";
import z from "zod";

export const IncomeSchema = z.object({
  type: z.enum(IncomeType),
  amount: z.coerce.number().positive(),
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
