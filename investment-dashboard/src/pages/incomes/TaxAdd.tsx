import { AddTaxForm } from "@/features/incomes/AddTaxForm/AddTaxForm";
import { TaxesList } from "@/features/incomes/TaxesList/TaxesList";

export const TaxAdd = () => {
  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <AddTaxForm />
      <div className="w-full max-w-5xl m-auto">
        <TaxesList />
      </div>
    </div>
  );
};
