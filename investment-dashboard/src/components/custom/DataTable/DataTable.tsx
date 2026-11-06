import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type TableMeta,
} from "@tanstack/react-table";

import { Table } from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { useState } from "react";
import { safeSort } from "./data-table.utils";
import { DataTableHeader } from "./DataTableHeader";
import { DataTableBody } from "./DataTableBody";
import { DataTableFooter } from "./DataTableFooter";
import { DataTableMobileCards } from "./DataTableMobileCards";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  meta?: TableMeta<TData>;
  /** Sous `lg`, affiche une carte par ligne au lieu du tableau. */
  mobileCards?: boolean;
  /** Fige la première colonne quand le tableau défile horizontalement. */
  stickyFirstColumn?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  meta,
  mobileCards = false,
  stickyFirstColumn = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    meta,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    defaultColumn: {
      sortDescFirst: true,
      sortingFn: safeSort(),
    },
    state: {
      sorting,
    },
  });

  return (
    <div className="min-w-0">
      <div
        className={cn(
          "overflow-hidden rounded-xl border bg-card shadow-xs",
          mobileCards && "hidden lg:block",
        )}
      >
        <Table>
          <DataTableHeader table={table} sticky={stickyFirstColumn} />
          <DataTableBody
            table={table}
            columns={columns}
            sticky={stickyFirstColumn}
          />
          <DataTableFooter table={table} sticky={stickyFirstColumn} />
        </Table>
      </div>
      {mobileCards && (
        <div className="lg:hidden">
          <DataTableMobileCards table={table} />
        </div>
      )}
    </div>
  );
}
