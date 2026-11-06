import { QueryBoundary } from "@/components/custom/QueryBoundary/QueryBoundary";
import { SelectItem } from "@/components/ui/select";
import { FormProvider } from "react-hook-form";
import { DEFAULT_INCOME } from "./incomes-form.schema";
import { FormSelect } from "@/components/custom/form/FormSelect";
import { FormInput } from "@/components/custom/form/FormInput";
import { FormMonthYear } from "@/components/custom/form/FormMonthYear";
import {
  AddRowButton,
  FormFooter,
  FormSubmitError,
  RemoveRowButton,
  SubmitButton,
} from "@/components/custom/form/FormActions";
import { SectionCard } from "@/components/custom/containers/SectionCard";
import { Wallet } from "lucide-react";
import { useAddIncomesForm } from "./useAddIncomesForm";

export const AddIncomesForm = () => {
  const {
    error,
    fetchStatus,
    incomeTypes,
    fields,
    form,
    append,
    onSubmit,
    remove,
    isSubmitting,
    submitError,
  } = useAddIncomesForm();

  return (
    <QueryBoundary query={{ data: incomeTypes, error, fetchStatus }}>
      <div className="max-w-5xl m-auto flex flex-col gap-4 lg:gap-6">
        <FormProvider {...form}>
          <form
            id="add-incomes-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 lg:gap-6"
          >
            <FormMonthYear />

            <SectionCard icon={Wallet} title="Revenus">
              {fields.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Aucun revenu pour le moment.
                </p>
              )}

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-[1fr_auto] items-end gap-3 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0 sm:grid-cols-[1fr_1fr_auto] sm:gap-4"
                >
                  <div className="col-span-2 sm:col-span-1">
                    <FormSelect name={`incomes.${index}.type`} label="Type">
                      {incomeTypes?.map(({ id, code, label }) => (
                        <SelectItem key={id} value={code}>
                          {label}
                        </SelectItem>
                      ))}
                    </FormSelect>
                  </div>

                  <FormInput
                    name={`incomes.${index}.amount`}
                    required
                    label="Montant"
                    inputMode="decimal"
                    suffix="€"
                  />

                  <RemoveRowButton onClick={() => remove(index)} />
                </div>
              ))}

              <AddRowButton
                disabled={fields.length === incomeTypes?.length}
                onClick={() => append(DEFAULT_INCOME)}
              >
                Ajouter un revenu
              </AddRowButton>
            </SectionCard>
          </form>
        </FormProvider>

        <FormSubmitError error={submitError} />

        <FormFooter>
          <SubmitButton form="add-incomes-form" disabled={isSubmitting}>
            {isSubmitting ? "Création..." : "Valider"}
          </SubmitButton>
        </FormFooter>
      </div>
    </QueryBoundary>
  );
};
