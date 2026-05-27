import { getCurrentYear, MONTHS_CODE } from "@investments/shared";
import z from "zod";

export const NetWorthFormSchema = z.object({
  month: z.enum(MONTHS_CODE),
  year: z.coerce.number().min(2000).max(2100).int(),
  amount: z.coerce.number().positive(),
});

export const DEFAULT_NET_WORTH: NetWorthFormInput = {
  month: "january",
  year: getCurrentYear(),
  amount: 0,
};

export type NetWorthFormInput = z.input<typeof NetWorthFormSchema>;
export type NetWorthFormOutput = z.infer<typeof NetWorthFormSchema>;
