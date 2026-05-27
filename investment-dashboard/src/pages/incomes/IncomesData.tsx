import { CustomSelect } from "@/components/custom/fields/CustomSelect/CustomSelect";
import { IncomesDataTable } from "@/features/incomes/IncomesDataTable/IncomesDataTable";
import {
  buildYearsUntilCurrent,
  getCurrentYear,
} from "@investments/shared/utils/date.utils";
import { useState } from "react";

const years = buildYearsUntilCurrent().map((y) => ({
  code: y.toString(),
  label: y.toString(),
}));

export const IncomesData = () => {
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear());

  return (
    <div className="flex gap-8 justify-center flex-wrap">
      <CustomSelect
        value={selectedYear.toString()}
        options={years}
        onValueChange={(value) => setSelectedYear(parseInt(value))}
      />

      <IncomesDataTable year={selectedYear} />
    </div>
  );
};
