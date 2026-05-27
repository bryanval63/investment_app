import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { flexRender, type ColumnDef, type Table } from "@tanstack/react-table";

interface DataTableBodyProps<TData, TValue> {
  table: Table<TData>;
  columns: ColumnDef<TData, TValue>[];
}

export function DataTableBody<TData, TValue>({
  table,
  columns,
}: DataTableBodyProps<TData, TValue>) {
  const rows = table.getRowModel().rows;

  return (
    <TableBody>
      {rows?.length ? (
        rows.map((row) => (
          <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            Aucun résultat trouvé.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
}
