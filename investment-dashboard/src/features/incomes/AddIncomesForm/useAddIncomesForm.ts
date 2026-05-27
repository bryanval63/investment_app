import { getIncomeTypesRefApi } from "@/services/incomes/income-types-ref.service";
import { useQuery } from "@tanstack/react-query";
import {
  DEFAULT_INCOME,
  IncomesFormSchema,
  type IncomesFormInput,
  type IncomesFormOutput,
} from "./incomes-form.schema";
import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createDateNormalizedByMonthAndYear,
  getCurrentYear,
  type IncomeRequestDto,
} from "@investments/shared";
import { postIncomesApi } from "@/services/incomes/incomes.service";

export const useAddIncomesForm = () => {
  const {
    data: incomeTypes,
    error,
    fetchStatus,
  } = useQuery({
    queryKey: ["incomeTypes"],
    queryFn: getIncomeTypesRefApi,
  });

  const form = useForm<IncomesFormInput, unknown, IncomesFormOutput>({
    resolver: zodResolver(IncomesFormSchema),
    defaultValues: {
      month: "january",
      year: getCurrentYear(),
      incomes: [DEFAULT_INCOME],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "incomes",
  });

  const onSubmit: SubmitHandler<IncomesFormOutput> = (data) => {
    const mapped: IncomeRequestDto[] = data.incomes.map((income) => ({
      type: income.type,
      amount: income.amount,
      date: createDateNormalizedByMonthAndYear(data.month, data.year),
    }));

    postIncomesApi(mapped);
  };

  return {
    incomeTypes,
    error,
    fetchStatus,
    fields,
    form,
    append,
    remove,
    onSubmit,
  };
};
