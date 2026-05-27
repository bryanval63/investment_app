import {
  DEFAULT_NET_WORTH,
  NetWorthFormSchema,
  type NetWorthFormInput,
  type NetWorthFormOutput,
} from "./net-worth-form.schema";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDateNormalizedByMonthAndYear } from "@investments/shared";
import { postNetWorthApi } from "@/services/net-worthes/net-worthes.service";

export const useAddNetWorthForm = () => {
  const form = useForm<NetWorthFormInput, unknown, NetWorthFormOutput>({
    resolver: zodResolver(NetWorthFormSchema),
    defaultValues: DEFAULT_NET_WORTH,
  });

  const onSubmit: SubmitHandler<NetWorthFormOutput> = (data) => {
    postNetWorthApi({
      date: createDateNormalizedByMonthAndYear(data.month, data.year),
      amount: data.amount,
    });
  };

  return {
    form,
    onSubmit,
  };
};
