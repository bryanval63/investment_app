import { FormProvider } from "react-hook-form";
import { Landmark } from "lucide-react";
import { FormInput } from "@/components/custom/form/FormInput";
import {
  FormFooter,
  FormSubmitError,
  SubmitButton,
} from "@/components/custom/form/FormActions";
import { SectionCard } from "@/components/custom/containers/SectionCard";
import { useAddTaxForm } from "./useAddTaxForm";

export const AddTaxForm = () => {
  const { form, onSubmit, isSubmitting, error } = useAddTaxForm();

  return (
    <div className="max-w-5xl m-auto flex flex-col gap-4 lg:gap-6">
      <FormProvider {...form}>
        <form
          id="add-tax-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 lg:gap-6"
        >
          <SectionCard
            icon={Landmark}
            title="Impôt sur le revenu"
            contentClassName="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <FormInput
              name="year"
              required
              label="Année"
              inputMode="numeric"
            />

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
        <SubmitButton form="add-tax-form" disabled={isSubmitting}>
          {isSubmitting ? "Création..." : "Valider"}
        </SubmitButton>
      </FormFooter>
    </div>
  );
};
