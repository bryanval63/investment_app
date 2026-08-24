import { DataTable } from "@/components/custom/DataTable/DataTable";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getIncomesApi } from "@/services/incomes/incomes.service";
import { INCOMES_DATA_TABLE_COLUMNS } from "./income-columns";
import { pivotIncomes } from "./incomes-data-table.utils";
import { MONTHS } from "@investments/shared/constants/date.constant";

type IncomesDataTableProps = {
  year: number;
};

export const IncomesDataTable = ({ year }: IncomesDataTableProps) => {
  const { data: incomes } = useSuspenseQuery({
    queryKey: ["incomes", year],
    queryFn: () => getIncomesApi(year),
  });
  const pivot = pivotIncomes(incomes ?? []);

  return (
    <div>
      {/* Desktop / large screens: full DataTable */}
      <div className="hidden lg:block">
        <DataTable columns={INCOMES_DATA_TABLE_COLUMNS} data={pivot} />
      </div>

      {/* Mobile: compact cards */}
      <div className="block lg:hidden space-y-3">
        {pivot.map((row) => (
          <div
            key={row.type}
            className="rounded-md border bg-background p-3 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">{row.type}</div>
              <div className="text-sm text-muted-foreground">
                Total:{" "}
                {Object.values(MONTHS)
                  .reduce(
                    (sum, m) => sum + (Number((row as any)[m.code]) || 0),
                    0,
                  )
                  .toFixed(2)}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {MONTHS.map(({ code, label }) => (
                <div key={code} className="flex flex-col items-start">
                  <div className="text-xs text-muted-foreground">
                    {label.slice(0, 3)}
                  </div>
                  <div className="text-sm font-medium">
                    {Number((row as any)[code] || 0).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
