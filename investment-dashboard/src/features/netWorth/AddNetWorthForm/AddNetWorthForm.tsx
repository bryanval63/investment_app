import { FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/custom/form/FormInput";
import { Card, CardContent } from "@/components/ui/card";
import { useAddNetWorthForm } from "./useAddNetWorthForm";
import { FormMonthYear } from "@/components/custom/form/FormMonthYear";

export const AddNetWorthForm = () => {
  const { form, onSubmit, isSubmitting, error } = useAddNetWorthForm();

  return (
    <div className="max-w-5xl m-auto flex flex-col justify-between h-full">
      <FormProvider {...form}>
        <form
          id="add-net-worth-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
        >
          <FormMonthYear />

          <Card>
            <CardContent className="flex gap-8">
              <FormInput name="amount" required label="Montant" />
            </CardContent>
          </Card>

          {error && (
            <div className="text-red-500 text-sm">
              Erreur:{" "}
              {error instanceof Error
                ? error.message
                : "Une erreur est survenue"}
            </div>
          )}
        </form>
      </FormProvider>

      <div className="flex justify-end gap-4">
        <Button type="submit" form="add-net-worth-form" disabled={isSubmitting}>
          {isSubmitting ? "Création..." : "Valider"}
        </Button>
      </div>
    </div>
  );
};
