import { FormProvider } from "react-hook-form";

import { QueryBoundary } from "@/components/custom/QueryBoundary/QueryBoundary";
import { FormSelect } from "@/components/custom/form/FormSelect";
import { SelectItem } from "@/components/ui/select";
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
import { useAddInvestmentsForm } from "./useAddInvestmentsForm";
import { TrendingUp } from "lucide-react";

export const AddInvestmentsForm = () => {
  const {
    form,
    fields,
    accounts,
    error,
    fetchStatus,
    handleAccountChange,
    onSubmit,
    remove,
    append,
    isSubmitting,
    submitError,
  } = useAddInvestmentsForm();

  const hasAccounts = (accounts?.length ?? 0) > 0;

  return (
    <QueryBoundary query={{ data: accounts, error, fetchStatus }}>
      <div className="max-w-5xl m-auto flex flex-col gap-4 lg:gap-6">
        <FormProvider {...form}>
          <form
            id="add-investments-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 lg:gap-6"
          >
            <FormMonthYear />

            <SectionCard icon={TrendingUp} title="Investissements">
              {!hasAccounts && (
                <p className="text-sm text-muted-foreground">
                  Aucun compte ouvert n'est disponible pour ajouter un
                  investissement.
                </p>
              )}

              {hasAccounts &&
                fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3 lg:p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        Ligne {index + 1}
                      </span>
                      <RemoveRowButton
                        className="-my-1.5 -mr-1.5"
                        onClick={() => remove(index)}
                      />
                    </div>

                    {/* items-end : garde les champs alignés quand un libellé passe sur deux lignes. */}
                    <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
                      <FormSelect
                        name={`investments.${index}.accountId`}
                        label="Compte"
                        onSelectChange={(value) =>
                          handleAccountChange(value, index)
                        }
                      >
                        {accounts?.map(({ id, name }) => (
                          <SelectItem key={id} value={id.toString()}>
                            {name}
                          </SelectItem>
                        ))}
                      </FormSelect>

                      <FormInput
                        name={`investments.${index}.totalAmount`}
                        required
                        label="Montant total"
                        inputMode="decimal"
                        suffix="€"
                      />

                      <FormInput
                        name={`investments.${index}.capitalGain`}
                        required
                        label="Plus value"
                        inputMode="decimal"
                        suffix="€"
                      />

                      <FormInput
                        name={`investments.${index}.transactionAmount`}
                        required
                        label="Montant de la transaction"
                        inputMode="decimal"
                        suffix="€"
                      />
                    </div>
                  </div>
                ))}

              <AddRowButton onClick={append} disabled={!accounts?.length}>
                Ajouter un investissement
              </AddRowButton>
            </SectionCard>
          </form>
        </FormProvider>

        <FormSubmitError error={submitError} />

        <FormFooter>
          <SubmitButton
            form="add-investments-form"
            disabled={isSubmitting || !accounts?.length}
          >
            {isSubmitting ? "Création..." : "Valider"}
          </SubmitButton>
        </FormFooter>
      </div>
    </QueryBoundary>
  );
};
