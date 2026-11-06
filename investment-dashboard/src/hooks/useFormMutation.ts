import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

type Options<TData> = {
  redirectTo?: string;
  onSuccess?: (data: TData) => void;
};

export const useFormMutation = <TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Options<TData>,
) => {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn,
    onSuccess: (data: TData) => {
      options?.onSuccess?.(data);
      if (options?.redirectTo) navigate(options.redirectTo);
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
};

export default useFormMutation;
