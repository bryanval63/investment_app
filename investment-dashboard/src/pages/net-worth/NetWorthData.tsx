import { PageToolbar, ToolbarField } from "@/components/custom/containers/PageToolbar";
import { CustomSelect } from "@/components/custom/fields/CustomSelect/CustomSelect";
import { NetWorthList } from "@/features/netWorth/NetWorthList/NetWorthList";
import {
  buildYearsUntilCurrent,
  getCurrentYear,
} from "@investments/shared/utils/date.utils";
import { startTransition, useState } from "react";

const years = buildYearsUntilCurrent().map((y) => ({
  code: y.toString(),
  label: y.toString(),
}));

export const NetWorthData = () => {
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear());

  return (
    <div className="flex flex-col gap-4">
      <PageToolbar>
        <ToolbarField label="Année" htmlFor="net-worth-year">
          <CustomSelect
            id="net-worth-year"
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

      <NetWorthList year={selectedYear} />
    </div>
  );
};
