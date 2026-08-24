import {
  DEFAULT_TAX,
  TaxFormSchema,
  type TaxFormInput,
  type TaxFormOutput,
} from "./tax-form.schema";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postTaxApi } from "@/services/taxes/taxes.service";
import useFormMutation from "@/hooks/useFormMutation";

export const useAddTaxForm = () => {
  const form = useForm<TaxFormInput, unknown, TaxFormOutput>({
    resolver: zodResolver(TaxFormSchema),
    defaultValues: DEFAULT_TAX,
  });

  const { mutate, isSubmitting, error } = useFormMutation(postTaxApi, {
    redirectTo: "/incomes",
  });

  const onSubmit: SubmitHandler<TaxFormOutput> = (data) => {
    mutate(data);
  };

  return {
    form,
    onSubmit,
    isSubmitting,
    error,
  };
};
