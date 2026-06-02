import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { AccountFormInput } from "./account-form.schema";
import { AccountFormSchema, DEFAULT_ACCOUNT } from "./account-form.schema";
import { createAccountApi } from "@/services/accounts/accounts.service";
import { getInvestmentTypesRefApi } from "@/services/investments/investment-types-ref.service";
import type { CreateAccountRequestDto } from "@investments/shared";

export const useAddAccountForm = () => {
  const navigate = useNavigate();
  const form = useForm<AccountFormInput>({
    resolver: zodResolver(AccountFormSchema),
    defaultValues: DEFAULT_ACCOUNT,
  });

  // Fetch investment types
  const { data: investmentTypes, isLoading: isLoadingTypes } = useQuery({
    queryKey: ["investment-types-ref"],
    queryFn: getInvestmentTypesRefApi,
  });

  // Create account mutation
  const createAccountMutation = useMutation({
    mutationFn: createAccountApi,
    onSuccess: () => {
      navigate("/investments/accounts");
    },
  });

  const onSubmit = async (data: AccountFormInput) => {
    const payload: CreateAccountRequestDto = {
      name: data.name,
      type: data.type as CreateAccountRequestDto["type"],
      category: data.category as CreateAccountRequestDto["category"],
    };

    createAccountMutation.mutate(payload);
  };

  return {
    form,
    investmentTypes: investmentTypes || [],
    isLoadingTypes,
    onSubmit,
    isSubmitting: createAccountMutation.isPending,
    error: createAccountMutation.error,
  };
};
