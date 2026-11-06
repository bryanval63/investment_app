import { FormProvider } from "react-hook-form";
import { Landmark } from "lucide-react";
import { FormSelect } from "@/components/custom/form/FormSelect";
import { SelectItem } from "@/components/ui/select";
import { FormInput } from "@/components/custom/form/FormInput";
import { DatePicker } from "@/components/custom/form/DatePicker";
import {
  FormFooter,
  FormSubmitError,
  SubmitButton,
} from "@/components/custom/form/FormActions";
import { SectionCard } from "@/components/custom/containers/SectionCard";
import { useAddAccountForm } from "./useAddAccountForm";

export const AddAccountForm = () => {
  const {
    form,
    investmentTypes,
    isLoadingTypes,
    investmentCategories,
    onSubmit,
    isSubmitting,
    error,
  } = useAddAccountForm();

  return (
    <div className="max-w-5xl m-auto flex flex-col gap-4 lg:gap-6">
      <FormProvider {...form}>
        <form
          id="add-account-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 lg:gap-6"
        >
          <SectionCard
            icon={Landmark}
            title="Nouveau compte"
            contentClassName="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-5"
          >
            <FormInput
              name="name"
              required
              label="Nom du compte"
              placeholder="Ex: Mon PEA"
            />
            <FormInput
              name="defaultTransactionAmount"
              type="number"
              min="0"
              step="any"
              required
              label="Montant de transaction par défaut"
              suffix="€"
            />
            <DatePicker
              label="Date d'ouverture du compte"
              value={form.watch("openingDate")}
              onChange={(value) => form.setValue("openingDate", value ?? "")}
            />

            <FormSelect name="type" label="Type de compte">
              {investmentTypes?.map(({ id, code, label }) => (
                <SelectItem key={id} value={code}>
                  {label}
                </SelectItem>
              ))}
            </FormSelect>

            <FormSelect name="category" label="Catégorie">
              {investmentCategories.map(({ code, label }) => (
                <SelectItem key={code} value={code}>
                  {label}
                </SelectItem>
              ))}
            </FormSelect>
          </SectionCard>

          <FormSubmitError error={error} />
        </form>
      </FormProvider>

      <FormFooter>
        <SubmitButton
          form="add-account-form"
          disabled={isSubmitting || isLoadingTypes}
        >
          {isSubmitting ? "Création..." : "Créer le compte"}
        </SubmitButton>
      </FormFooter>
    </div>
  );
};
