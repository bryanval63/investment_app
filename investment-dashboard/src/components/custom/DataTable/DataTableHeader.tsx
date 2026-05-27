import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { addSorting } from "./data-table.utils";
import { flexRender, type Table } from "@tanstack/react-table";

interface DataTableHeaderProps<TData> {
  table: Table<TData>;
}

export function DataTableHeader<TData>({ table }: DataTableHeaderProps<TData>) {
  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : addSorting(
                      header.column,
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      ),
                    )}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
}
