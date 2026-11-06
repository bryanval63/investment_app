import { MainContainer } from "@/components/custom/containers/MainContainer";
import { PageToolbar, ToolbarField } from "@/components/custom/containers/PageToolbar";
import { CustomSelect } from "@/components/custom/fields/CustomSelect/CustomSelect";
import { IncomesByDateChart } from "@/features/incomes/charts/IncomesByDateChart/IncomesByDateChart";
import { IncomesByTypeChart } from "@/features/incomes/charts/IncomesByTypeChart/IncomesByTypeChart";
import { IncomesMonthlyAverageChart } from "@/features/incomes/charts/IncomesMonthlyAverageChart/IncomesMonthlyAverageChart";
import type { IncomeUnit } from "@investments/shared";
import { INCOME_UNIT } from "@investments/shared/constants/income.constant";
import { Switch } from "@/components/ui/switch";
import { startTransition, useState } from "react";

type IncomeUnitOmitType = Exclude<IncomeUnit, "type">;

export const IncomesOverview = () => {
  const [unit, setUnit] = useState<IncomeUnitOmitType>(INCOME_UNIT[0].code);
  const [hasTaxes, setHasTaxes] = useState(true);

  const filteredUnits = INCOME_UNIT.filter((unit) => unit.code !== "type");

  return (
    <MainContainer>
      <PageToolbar>
        <ToolbarField label="Regroupement" htmlFor="income-unit">
          <CustomSelect
            id="income-unit"
            variant="pill"
            value={unit}
            // Transition : garde les graphiques affichés pendant le chargement
            // des nouvelles données au lieu de repasser sur « Chargement... ».
            onValueChange={(value) => startTransition(() => setUnit(value))}
            options={filteredUnits}
          />
        </ToolbarField>
        <ToolbarField label="Impôts inclus" htmlFor="with-taxes">
          <Switch
            id="with-taxes"
            checked={hasTaxes}
            onCheckedChange={(value) =>
              startTransition(() => setHasTaxes(value === true))
            }
          />
        </ToolbarField>
      </PageToolbar>
      <IncomesByDateChart unit={unit} hasTaxes={hasTaxes} />
      <IncomesByTypeChart />
      <IncomesMonthlyAverageChart hasTaxes={hasTaxes} />
    </MainContainer>
  );
};
