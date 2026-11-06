import { TableCell, TableFooter, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { flexRender, type Table } from "@tanstack/react-table";
import { CELL_PADDING, getAlignClass, STICKY_CELL } from "./data-table.utils";

interface DataTableFooterProps<TData> {
  table: Table<TData>;
  sticky?: boolean;
}

export function DataTableFooter<TData>({
  table,
  sticky = false,
}: DataTableFooterProps<TData>) {
  const hasFooter = table
    .getAllColumns()
    .some((column) => column.columnDef.footer);

  if (!hasFooter) {
    return null;
  }

  return (
    <TableFooter className="bg-slate-50/80 font-semibold text-foreground dark:bg-slate-800/50">
      {table.getFooterGroups().map((footerGroup) => (
        <TableRow key={footerGroup.id} className="hover:bg-transparent">
          {footerGroup.headers.map((header, index) => (
            <TableCell
              key={header.id}
              className={cn(
                CELL_PADDING,
                "tabular-nums",
                getAlignClass(header.column),
                sticky &&
                  index === 0 &&
                  cn(STICKY_CELL, "bg-slate-50 dark:bg-slate-800"),
              )}
            >
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
  );
}
