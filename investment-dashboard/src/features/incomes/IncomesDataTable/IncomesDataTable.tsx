import { DataTable } from "@/components/custom/DataTable/DataTable";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getIncomesApi } from "@/services/incomes/incomes.service";
import { INCOMES_DATA_TABLE_COLUMNS } from "./income-columns";
import { pivotIncomes } from "./incomes-data-table.utils";

type IncomesDataTableProps = {
  year: number;
};

export const IncomesDataTable = ({ year }: IncomesDataTableProps) => {
  const { data: incomes } = useSuspenseQuery({
    queryKey: ["incomes", year],
    queryFn: () => getIncomesApi(year),
  });

  return (
    <div className="flex ">
      <DataTable
        columns={INCOMES_DATA_TABLE_COLUMNS}
        data={pivotIncomes(incomes ?? [])}
      />
    </div>
  );
};
