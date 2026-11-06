import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  addSorting,
  CELL_PADDING,
  getAlignClass,
  STICKY_CELL,
} from "./data-table.utils";
import { flexRender, type Table } from "@tanstack/react-table";

interface DataTableHeaderProps<TData> {
  table: Table<TData>;
  sticky?: boolean;
}

export function DataTableHeader<TData>({
  table,
  sticky = false,
}: DataTableHeaderProps<TData>) {
  return (
    <TableHeader className="bg-slate-50/80 dark:bg-slate-800/50">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id} className="hover:bg-transparent">
          {headerGroup.headers.map((header, index) => {
            const isSorted = header.column.getIsSorted();

            return (
              <TableHead
                key={header.id}
                aria-sort={
                  isSorted === "asc"
                    ? "ascending"
                    : isSorted === "desc"
                      ? "descending"
                      : undefined
                }
                className={cn(
                  "h-10 text-xs font-medium uppercase tracking-wide text-muted-foreground",
                  CELL_PADDING,
                  getAlignClass(header.column),
                  sticky &&
                    index === 0 &&
                    cn(STICKY_CELL, "bg-slate-50 dark:bg-slate-800"),
                )}
              >
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
