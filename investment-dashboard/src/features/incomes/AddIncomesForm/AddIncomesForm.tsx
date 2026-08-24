import { QueryBoundary } from "@/components/custom/QueryBoundary/QueryBoundary";
import { SelectItem } from "@/components/ui/select";
import { FormProvider } from "react-hook-form";
import { DEFAULT_INCOME } from "./incomes-form.schema";
import { Button } from "@/components/ui/button";
import { FormSelect } from "@/components/custom/form/FormSelect";
import { FormInput } from "@/components/custom/form/FormInput";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Fragment } from "react/jsx-runtime";
import { FormMonthYear } from "@/components/custom/form/FormMonthYear";
import { useAddIncomesForm } from "./useAddIncomesForm";

export const AddIncomesForm = () => {
  const {
    error,
    fetchStatus,
    fields,
    form,
    incomeTypes,
    append,
    onSubmit,
    remove,
    isSubmitting,
    submitError,
  } = useAddIncomesForm();

  return (
    <QueryBoundary query={{ error, fetchStatus }}>
      <div className="max-w-5xl m-auto flex flex-col justify-between h-full">
        <FormProvider {...form}>
          <form
            id="add-incomes-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-8"
          >
            <FormMonthYear />

            {fields.length > 0 && (
              <Card>
                <CardContent className="flex flex-col gap-4">
                  {fields.map((field, index) => (
                    <Fragment key={field.id}>
                      <div className="flex gap-8 items-center">
                        <FormSelect name={`incomes.${index}.type`} label="Type">
                          {incomeTypes?.map(({ id, code, label }) => (
                            <SelectItem key={id} value={code}>
                              {label}
                            </SelectItem>
                          ))}
                        </FormSelect>

                        <FormInput
                          name={`incomes.${index}.amount`}
                          required
                          label="Montant"
                        />

                        <Button type="button" onClick={() => remove(index)}>
                          Supprimer
                        </Button>
                      </div>

                      {index !== fields.length - 1 && <Separator />}
                    </Fragment>
                  ))}
                </CardContent>
              </Card>
            )}
            <Button
              type="button"
              variant="outline"
              disabled={fields.length === incomeTypes?.length}
              onClick={() => append(DEFAULT_INCOME)}
            >
              Ajouter un revenu
            </Button>
          </form>
        </FormProvider>

        {submitError && (
          <div className="text-red-500 text-sm">
            Erreur:{" "}
            {submitError instanceof Error
              ? submitError.message
              : "Une erreur est survenue"}
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Button type="submit" form="add-incomes-form" disabled={isSubmitting}>
            {isSubmitting ? "Création..." : "Valider"}
          </Button>
        </div>
      </div>
    </QueryBoundary>
  );
};
