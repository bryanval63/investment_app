import { FormProvider } from "react-hook-form";
import { PiggyBank } from "lucide-react";
import { FormInput } from "@/components/custom/form/FormInput";
import { FormMonthYear } from "@/components/custom/form/FormMonthYear";
import {
  FormFooter,
  FormSubmitError,
  SubmitButton,
} from "@/components/custom/form/FormActions";
import { SectionCard } from "@/components/custom/containers/SectionCard";
import { useAddNetWorthForm } from "./useAddNetWorthForm";

export const AddNetWorthForm = () => {
  const { form, onSubmit, isSubmitting, error } = useAddNetWorthForm();

  return (
    <div className="max-w-5xl m-auto flex flex-col gap-4 lg:gap-6">
      <FormProvider {...form}>
        <form
          id="add-net-worth-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 lg:gap-6"
        >
          <FormMonthYear />

          <SectionCard
            icon={PiggyBank}
            title="Capital"
            contentClassName="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <FormInput
              name="amount"
              required
              label="Montant"
              inputMode="decimal"
              suffix="€"
            />
          </SectionCard>

          <FormSubmitError error={error} />
        </form>
      </FormProvider>

      <FormFooter>
        <SubmitButton form="add-net-worth-form" disabled={isSubmitting}>
          {isSubmitting ? "Création..." : "Valider"}
        </SubmitButton>
      </FormFooter>
    </div>
  );
};
