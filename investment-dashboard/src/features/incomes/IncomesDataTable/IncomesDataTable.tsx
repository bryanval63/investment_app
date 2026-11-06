import { DataTable } from "@/components/custom/DataTable/DataTable";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getIncomesApi } from "@/services/incomes/incomes.service";
import { INCOMES_DATA_TABLE_COLUMNS } from "./income-columns";
import { pivotIncomes } from "./incomes-data-table.utils";
import { MONTHS } from "@investments/shared/constants/date.constant";
import { formatToEuro } from "@/utils/format.utils";
import { cn } from "@/lib/utils";

// Abréviations fr-FR sans ambiguïté (« juin » / « juil. »).
const SHORT_MONTH_LABELS = MONTHS.map((_, index) =>
  new Date(2000, index, 1).toLocaleDateString("fr-FR", { month: "short" }),
);

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
    // w-full + min-w-0 : contraint le tableau à la largeur disponible pour que
    // seul le tableau défile horizontalement (parent en flex-wrap).
    <div className="w-full min-w-0">
      {/* Desktop / grands écrans : tableau complet, colonne « Type » figée */}
      <div className="hidden lg:block">
        <DataTable
          columns={INCOMES_DATA_TABLE_COLUMNS}
          data={pivot}
          stickyFirstColumn
        />
      </div>

      {/* Mobile : cartes compactes, le type de revenu sert de titre */}
      <ul className="flex flex-col gap-3 lg:hidden">
        {pivot.length === 0 && (
          <li className="rounded-xl border bg-card p-6 text-center text-sm text-muted-foreground">
            Aucun résultat trouvé.
          </li>
        )}
        {pivot.map((row) => (
          <li
            key={row.type}
            className="rounded-xl border bg-card p-4 shadow-xs"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <span className="font-semibold text-foreground">{row.type}</span>
              <span className="text-sm font-semibold tabular-nums text-foreground">
                <span className="mr-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Total
                </span>
                {formatToEuro(
                  MONTHS.reduce(
                    (sum, m) => sum + (Number(row[m.code]) || 0),
                    0,
                  ),
                )}
              </span>
            </div>

            <dl className="mt-3 grid grid-cols-3 gap-x-3 gap-y-2.5 border-t pt-3 min-[420px]:grid-cols-4">
              {MONTHS.map(({ code }, monthIndex) => {
                const amount = Number(row[code]) || 0;

                return (
                  <div key={code} className="flex min-w-0 flex-col">
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {SHORT_MONTH_LABELS[monthIndex]}
                    </dt>
                    <dd
                      className={cn(
                        "whitespace-nowrap text-sm font-medium tabular-nums",
                        amount === 0 && "text-muted-foreground/60",
                      )}
                    >
                      {formatToEuro(amount, { maximumFractionDigits: 0 })}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
};
