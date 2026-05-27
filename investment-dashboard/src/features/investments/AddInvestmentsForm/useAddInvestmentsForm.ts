import { getAccountsApi } from "@/services/accounts/accounts.service";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createDateNormalizedByMonthAndYear,
  getCurrentYear,
  type InvestmentRequestDto,
} from "@investments/shared";
import { useQuery } from "@tanstack/react-query";
import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import {
  DEFAULT_INVESTMENT,
  InvestmentsFormSchema,
  type InvestmentsFormInput,
  type InvestmentsFormOutput,
} from "./investments-form.schema";
import { postInvestmentsApi } from "@/services/investments/investments.service";

export const TRANSACTION_AMOUNT_BY_ACCOUNT: Record<number, number> = {
  1: 100,
  2: 100,
  4: 100,
  5: 100,
  7: 50,
  8: 50,
};

export const useAddInvestmentsForm = () => {
  const {
    data: accounts,
    error,
    fetchStatus,
  } = useQuery({
    queryKey: ["accounts"],
    queryFn: getAccountsApi,
  });

  const form = useForm<InvestmentsFormInput, unknown, InvestmentsFormOutput>({
    resolver: zodResolver(InvestmentsFormSchema),
    defaultValues: {
      month: "january",
      year: getCurrentYear(),
      investments: [DEFAULT_INVESTMENT],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "investments",
  });

  const handleAccountChange = (value: unknown, index: number) => {
    const amount = TRANSACTION_AMOUNT_BY_ACCOUNT[Number(value)] ?? 0;

    update(index, {
      ...fields[index],
      accountId: value,
      transactionAmount: amount,
    });
  };

  const onSubmit: SubmitHandler<InvestmentsFormOutput> = (data) => {
    const mapped: InvestmentRequestDto[] = data.investments.map(
      (investment) => ({
        accountId: investment.accountId,
        capitalGain: investment.capitalGain,
        totalAmount: investment.totalAmount,
        transactionAmount: investment.transactionAmount,
        date: createDateNormalizedByMonthAndYear(data.month, data.year),
      }),
    );

    postInvestmentsApi(mapped);
  };

  return {
    form,
    fields,
    accounts,
    error,
    fetchStatus,
    append,
    remove,
    handleAccountChange,
    onSubmit,
  };
};
