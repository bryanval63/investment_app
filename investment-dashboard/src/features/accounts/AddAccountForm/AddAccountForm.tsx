import { FormProvider } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { FormSelect } from "@/components/custom/form/FormSelect";
import { SelectItem } from "@/components/ui/select";
import { FormInput } from "@/components/custom/form/FormInput";
import { Button } from "@/components/ui/button";
import { useAddAccountForm } from "./useAddAccountForm";
import { INVESTMENT_CATEGORIES } from "@investments/shared/constants/investments.constants";

export const AddAccountForm = () => {
  const {
    form,
    investmentTypes,
    isLoadingTypes,
    onSubmit,
    isSubmitting,
    error,
  } = useAddAccountForm();

  return (
    <div className="max-w-5xl m-auto flex flex-col justify-between h-full gap-8">
      <FormProvider {...form}>
        <form
          id="add-account-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
        >
          <Card>
            <CardContent className="flex flex-col gap-6 pt-6">
              <FormInput
                name="name"
                required
                label="Nom du compte"
                placeholder="Ex: Mon PEA"
              />

              <FormSelect name="type" label="Type de compte">
                {investmentTypes?.map(({ id, code, label }) => (
                  <SelectItem key={id} value={code}>
                    {label}
                  </SelectItem>
                ))}
              </FormSelect>

              <FormSelect name="category" label="Catégorie">
                {INVESTMENT_CATEGORIES.filter((cat) => cat.code !== "ALL").map(
                  ({ code, label }) => (
                    <SelectItem key={code} value={code}>
                      {label}
                    </SelectItem>
                  ),
                )}
              </FormSelect>
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
        <Button
          type="submit"
          form="add-account-form"
          disabled={isSubmitting || isLoadingTypes}
        >
          {isSubmitting ? "Création..." : "Créer le compte"}
        </Button>
      </div>
    </div>
  );
};
