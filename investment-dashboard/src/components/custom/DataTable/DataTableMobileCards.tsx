import { cn } from "@/lib/utils";
import { flexRender, type Table } from "@tanstack/react-table";

interface DataTableMobileCardsProps<TData> {
  table: Table<TData>;
}

// Vue cartes pour petits écrans : une carte par ligne. La première cellule sert
// de titre (avec les actions à droite), les autres colonnes deviennent des paires
// libellé/valeur. Réutilise les définitions de colonnes (cellules éditables comprises).
export function DataTableMobileCards<TData>({
  table,
}: DataTableMobileCardsProps<TData>) {
  const rows = table.getRowModel().rows;

  if (!rows.length) {
    return (
      <div className="rounded-xl border bg-card p-6 text-center text-sm text-muted-foreground">
        Aucun résultat trouvé.
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {rows.map((row) => {
        const cells = row.getVisibleCells();
        const actionsCell = cells.find((cell) => cell.column.id === "actions");
        const [titleCell, ...fieldCells] = cells.filter(
          (cell) => cell.column.id !== "actions",
        );

        return (
          <li
            key={row.id}
            className="rounded-xl border bg-card p-4 shadow-xs transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-3">
              {titleCell && (
                <div className="min-w-0 flex-1 break-words font-semibold text-foreground">
                  {flexRender(
                    titleCell.column.columnDef.cell,
                    titleCell.getContext(),
                  )}
                </div>
              )}
              {actionsCell && (
                <div className="-mr-1.5 shrink-0">
                  {flexRender(
                    actionsCell.column.columnDef.cell,
                    actionsCell.getContext(),
                  )}
                </div>
              )}
            </div>

            {fieldCells.length > 0 && (
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 border-t pt-3 text-sm">
                {fieldCells.map((cell) => {
                  const header = cell.column.columnDef.header;

                  return (
                    <div key={cell.id} className="flex min-w-0 flex-col gap-1">
                      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {typeof header === "string" ? header : cell.column.id}
                      </dt>
                      <dd
                        className={cn(
                          "min-w-0 break-words font-medium tabular-nums",
                          // Les montants alignés à droite sur desktop restent à gauche dans la carte.
                          "[&_.text-right]:text-left",
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            )}
          </li>
        );
      })}
    </ul>
  );
}
