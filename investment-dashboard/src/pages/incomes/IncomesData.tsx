import { PageToolbar, ToolbarField } from "@/components/custom/containers/PageToolbar";
import { CustomSelect } from "@/components/custom/fields/CustomSelect/CustomSelect";
import { IncomesDataTable } from "@/features/incomes/IncomesDataTable/IncomesDataTable";
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

export const IncomesData = () => {
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear());

  return (
    <div className="flex flex-col gap-4">
      <PageToolbar>
        <ToolbarField label="Année" htmlFor="income-year">
          <CustomSelect
            id="income-year"
            variant="pill"
            value={selectedYear.toString()}
            options={years}
            // Transition : garde le tableau affiché pendant le chargement de l'année.
            onValueChange={(value) =>
              startTransition(() => setSelectedYear(parseInt(value)))
            }
          />
        </ToolbarField>
      </PageToolbar>

      <IncomesDataTable year={selectedYear} />
      <IncomesList year={selectedYear} />
    </div>
  );
};
