import { FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/custom/form/FormInput";
import { Card, CardContent } from "@/components/ui/card";
import { useAddTaxForm } from "./useAddTaxForm";

export const AddTaxForm = () => {
  const { form, onSubmit } = useAddTaxForm();

  return (
    <div className="max-w-5xl m-auto flex flex-col justify-between h-full">
      <FormProvider {...form}>
        <form
          id="add-tax-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
        >
          <Card>
            <CardContent className="flex gap-8">
              <FormInput name="year" required label="Année" />

              <FormInput name="amount" required label="Montant" />
            </CardContent>
          </Card>
        </form>
      </FormProvider>

      <div className="flex justify-end gap-4">
        <Button type="submit" form="add-tax-form">
          Valider
        </Button>
      </div>
    </div>
  );
};
