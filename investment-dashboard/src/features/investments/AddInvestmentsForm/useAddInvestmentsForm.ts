import { getAccountsApi } from "@/services/accounts/accounts.service";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createDateNormalizedByMonthAndYear,
  getCurrentYear,
  type InvestmentRequestDto,
} from "@investments/shared";
import { useQuery } from "@tanstack/react-query";
import {
  useFieldArray,
  useForm,
  type SubmitHandler,
} from "react-hook-form";
import { useEffect, useMemo } from "react";
import {
  DEFAULT_INVESTMENT,
  InvestmentsFormSchema,
  type InvestmentsFormInput,
  type InvestmentsFormOutput,
} from "./investments-form.schema";
import { postInvestmentsApi } from "@/services/investments/investments.service";
import useFormMutation from "@/hooks/useFormMutation";

export const useAddInvestmentsForm = () => {
  const {
    data: allAccounts,
    error,
    fetchStatus,
  } = useQuery({
    queryKey: ["accounts"],
    queryFn: getAccountsApi,
  });
  const accounts = useMemo(
    () => allAccounts?.filter(({ isClosed }) => !isClosed),
    [allAccounts],
  );

  const form = useForm<InvestmentsFormInput, unknown, InvestmentsFormOutput>({
    resolver: zodResolver(InvestmentsFormSchema),
    defaultValues: {
      month: "january",
      year: getCurrentYear(),
      investments: [DEFAULT_INVESTMENT],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "investments",
  });

  useEffect(() => {
    if (!accounts) return;

    form.getValues("investments").forEach((investment, index) => {
      const account = accounts.find(
        ({ id }) => id === Number(investment.accountId),
      );
      const defaultAccount = accounts[0];
      const selectedAccount = account ?? defaultAccount;
      if (!selectedAccount) return;

      if (!account) {
        form.setValue(
          `investments.${index}.accountId`,
          selectedAccount.id.toString(),
          { shouldDirty: true },
        );
      }

      if (
        !account ||
        (!form.getFieldState(`investments.${index}.transactionAmount`).isDirty &&
          !form.getFieldState(`investments.${index}.transactionAmount`).isTouched)
      ) {
        form.setValue(
          `investments.${index}.transactionAmount`,
          selectedAccount.defaultTransactionAmount,
        );
      }
    });
  }, [accounts, form]);

  const appendInvestment = () => {
    const defaultAccount = accounts?.[0];
    append({
      ...DEFAULT_INVESTMENT,
      accountId: defaultAccount?.id.toString() ?? "",
      transactionAmount: defaultAccount?.defaultTransactionAmount ?? 0,
    });
  };

  const handleAccountChange = (value: unknown, index: number) => {
    const account = accounts?.find(({ id }) => id === Number(value));
    if (!account) return;

    form.setValue(`investments.${index}.accountId`, value, {
      shouldDirty: true,
    });
    form.setValue(
      `investments.${index}.transactionAmount`,
      account.defaultTransactionAmount,
      {
      shouldDirty: true,
      },
    );
  };

  const {
    mutate,
    isSubmitting,
    error: submitError,
  } = useFormMutation(postInvestmentsApi, { redirectTo: "/investments" });

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

    mutate(mapped);
  };

  return {
    form,
    fields,
    accounts,
    error,
    fetchStatus,
    append: appendInvestment,
    remove,
    handleAccountChange,
    onSubmit,
    isSubmitting,
    submitError,
  };
};
