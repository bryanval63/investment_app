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
import { useQueryClient } from "@tanstack/react-query";

export const useAddTaxForm = () => {
  const form = useForm<TaxFormInput, unknown, TaxFormOutput>({
    resolver: zodResolver(TaxFormSchema),
    defaultValues: DEFAULT_TAX,
  });

  const queryClient = useQueryClient();
  const { mutate, isSubmitting, error } = useFormMutation(postTaxApi, {
    // Liste des impôts et revenus « impôts inclus » à rafraîchir.
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taxes"] });
      queryClient.invalidateQueries({ queryKey: ["incomesGroupedByDate"] });
    },
    redirectTo: "/taxes",
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
