import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { flexRender, type ColumnDef, type Table } from "@tanstack/react-table";
import { CELL_PADDING, getAlignClass, STICKY_CELL } from "./data-table.utils";

interface DataTableBodyProps<TData, TValue> {
  table: Table<TData>;
  columns: ColumnDef<TData, TValue>[];
  sticky?: boolean;
}

export function DataTableBody<TData, TValue>({
  table,
  columns,
  sticky = false,
}: DataTableBodyProps<TData, TValue>) {
  const rows = table.getRowModel().rows;

  return (
    <TableBody>
      {rows?.length ? (
        rows.map((row) => (
          <TableRow
            key={row.id}
            data-state={row.getIsSelected() && "selected"}
            className="group hover:bg-slate-50 dark:hover:bg-slate-800/60"
          >
            {row.getVisibleCells().map((cell, index) => (
              <TableCell
                key={cell.id}
                className={cn(
                  CELL_PADDING,
                  getAlignClass(cell.column),
                  index === 0 && "font-medium text-foreground",
                  sticky &&
                    index === 0 &&
                    cn(
                      STICKY_CELL,
                      "bg-card transition-colors group-hover:bg-slate-50 dark:group-hover:bg-slate-800",
                    ),
                )}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow className="hover:bg-transparent">
          <TableCell
            colSpan={columns.length}
            className="h-24 text-center text-muted-foreground"
          >
            Aucun résultat trouvé.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
}
