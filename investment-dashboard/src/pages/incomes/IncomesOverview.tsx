import { MainContainer } from "@/components/custom/containers/MainContainer";
import { CustomCheckbox } from "@/components/custom/fields/CustomCheckbox/CustomCheckbox";
import { CustomSelect } from "@/components/custom/fields/CustomSelect/CustomSelect";
import { IncomesByDateChart } from "@/features/incomes/charts/IncomesByDateChart/IncomesByDateChart";
import { IncomesByTypeChart } from "@/features/incomes/charts/IncomesByTypeChart/IncomesByTypeChart";
import { IncomesMonthlyAverageChart } from "@/features/incomes/charts/IncomesMonthlyAverageChart/IncomesMonthlyAverageChart";
import type { IncomeUnit } from "@investments/shared";
import { INCOME_UNIT } from "@investments/shared/constants/income.constant";
import { useState } from "react";

type IncomeUnitOmitType = Exclude<IncomeUnit, "type">;

export const IncomesOverview = () => {
  const [unit, setUnit] = useState<IncomeUnitOmitType>(INCOME_UNIT[0].code);
  const [hasTaxes, setHasTaxes] = useState(true);

  const filteredUnits = INCOME_UNIT.filter((unit) => unit.code !== "type");

  return (
    <MainContainer>
      <div className="col-span-2 justify-center flex items-center gap-4">
        <CustomSelect
          value={unit}
          onValueChange={setUnit}
          options={filteredUnits}
        />
        <CustomCheckbox
          label="Impôts"
          checked={hasTaxes}
          setChecked={setHasTaxes}
        />
      </div>
      <IncomesByDateChart unit={unit} hasTaxes={hasTaxes} />
      <IncomesByTypeChart />
      <IncomesMonthlyAverageChart hasTaxes={hasTaxes} />
    </MainContainer>
  );
};
