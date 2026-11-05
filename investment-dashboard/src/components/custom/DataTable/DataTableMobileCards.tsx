import { flexRender, type Table } from "@tanstack/react-table";

interface DataTableMobileCardsProps<TData> {
  table: Table<TData>;
}

// Vue cartes pour petits écrans : une carte par ligne, une paire libellé/valeur par colonne.
// Réutilise les définitions de colonnes (cellules éditables comprises).
export function DataTableMobileCards<TData>({
  table,
}: DataTableMobileCardsProps<TData>) {
  const rows = table.getRowModel().rows;

  if (!rows.length) {
    return (
      <div className="rounded-md border p-6 text-center text-sm">
        Aucun résultat trouvé.
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {rows.map((row) => (
        <li
          key={row.id}
          className="rounded-md border bg-background p-3 shadow-sm dark:bg-slate-900"
        >
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {row.getVisibleCells().map((cell) => {
              const header = cell.column.columnDef.header;
              const isActions = cell.column.id === "actions";

              return (
                <div
                  key={cell.id}
                  className={`flex min-w-0 flex-col gap-0.5 ${isActions ? "col-span-2 items-end" : ""}`}
                >
                  {!isActions && (
                    <dt className="text-xs text-muted-foreground">
                      {typeof header === "string" ? header : cell.column.id}
                    </dt>
                  )}
                  <dd className="min-w-0 break-words font-medium">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </dd>
                </div>
              );
            })}
          </dl>
        </li>
      ))}
    </ul>
  );
}
