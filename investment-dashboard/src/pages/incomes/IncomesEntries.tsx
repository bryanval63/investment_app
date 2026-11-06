import { PageToolbar, ToolbarField } from "@/components/custom/containers/PageToolbar";
import { CustomSelect } from "@/components/custom/fields/CustomSelect/CustomSelect";
import { IncomesList } from "@/features/incomes/IncomesList/IncomesList";
import {
  buildYearsUntilCurrent,
  getCurrentYear,
} from "@investments/shared/utils/date.utils";
import { startTransition, useState } from "react";

const years = buildYearsUntilCurrent().map((y) => ({
  code: y.toString(),
  label: y.toString(),
}));

export const IncomesEntries = () => {
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear());

  return (
    <div className="flex flex-col gap-4">
      <PageToolbar>
        <ToolbarField label="Année" htmlFor="income-entries-year">
          <CustomSelect
            id="income-entries-year"
            variant="pill"
            value={selectedYear.toString()}
            options={years}
            // Transition : garde la liste affichée pendant le chargement de l'année.
            onValueChange={(value) =>
              startTransition(() => setSelectedYear(parseInt(value)))
            }
          />
        </ToolbarField>
      </PageToolbar>

      <IncomesList year={selectedYear} />
    </div>
  );
};
