import { FormProvider } from "react-hook-form";
import { DEFAULT_INVESTMENT } from "./investments-form.schema";

import { QueryBoundary } from "@/components/custom/QueryBoundary/QueryBoundary";
import { Card, CardContent } from "@/components/ui/card";
import { FormSelect } from "@/components/custom/form/FormSelect";
import { SelectItem } from "@/components/ui/select";
import { FormInput } from "@/components/custom/form/FormInput";
import { Fragment } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FormMonthYear } from "@/components/custom/form/FormMonthYear";
import { useAddInvestmentsForm } from "./useAddInvestmentsForm";

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
  } = useAddInvestmentsForm();

  return (
    <QueryBoundary query={{ error, fetchStatus }}>
      <div className="max-w-5xl m-auto flex flex-col justify-between h-full gap-8">
        <FormProvider {...form}>
          <form
            id="add-investments-form"
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
                        />

                        <FormInput
                          name={`investments.${index}.capitalGain`}
                          required
                          label="Plus value"
                        />

                        <FormInput
                          name={`investments.${index}.transactionAmount`}
                          required
                          label="Montant de la transaction"
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
              onClick={() => append(DEFAULT_INVESTMENT)}
            >
              Ajouter un investissement
            </Button>
          </form>
        </FormProvider>

        <div className="flex justify-end gap-4">
          <Button type="submit" form="add-investments-form">
            Valider
          </Button>
        </div>
      </div>
    </QueryBoundary>
  );
};
