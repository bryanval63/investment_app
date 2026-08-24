import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

type Options = {
  redirectTo?: string;
  onSuccess?: (data: unknown) => void;
};

export const useFormMutation = (
  mutationFn: (...args: any[]) => any,
  options?: Options,
) => {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn,
    onSuccess: (data: unknown) => {
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
