import { TableCell, TableFooter, TableRow } from "@/components/ui/table";
import { flexRender, type Table } from "@tanstack/react-table";

interface DataTableFooterProps<TData> {
  table: Table<TData>;
}

export function DataTableFooter<TData>({ table }: DataTableFooterProps<TData>) {
  const hasFooter = table
    .getAllColumns()
    .some((column) => column.columnDef.footer);

  return (
    <>
      {hasFooter && (
        <TableFooter>
          {table.getFooterGroups().map((footerGroup) => (
            <TableRow key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <TableCell key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext(),
                      )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableFooter>
      )}
    </>
  );
}
