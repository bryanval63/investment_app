import { MONTHS_CODE } from "@investments/shared/constants/date.constant";
import z from "zod";
import { TRANSACTION_AMOUNT_BY_ACCOUNT } from "./useAddInvestmentsForm";

export const InvestmentSchema = z.object({
  accountId: z.coerce.number().positive(),
  capitalGain: z.coerce.number(),
  totalAmount: z.coerce.number(),
  transactionAmount: z.coerce.number(),
});

export const InvestmentsFormSchema = z.object({
  month: z.enum(MONTHS_CODE),
  year: z.coerce.number().min(2000).max(2100).int(),
  investments: z.array(InvestmentSchema).min(1),
});

export const DEFAULT_INVESTMENT: InvestmentsFormInput["investments"][number] = {
  accountId: "1",
  capitalGain: 0,
  totalAmount: 0,
  transactionAmount: TRANSACTION_AMOUNT_BY_ACCOUNT[1],
};

export type InvestmentsFormInput = z.input<typeof InvestmentsFormSchema>;
export type InvestmentsFormOutput = z.infer<typeof InvestmentsFormSchema>;
