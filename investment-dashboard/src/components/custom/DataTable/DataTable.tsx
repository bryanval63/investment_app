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
}

export function DataTable<TData, TValue>({
  columns,
  data,
  meta,
  mobileCards = false,
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
    <div>
      <div
        className={`rounded-md border dark:bg-slate-900 ${mobileCards ? "hidden lg:block" : ""}`}
      >
        <Table>
          <DataTableHeader table={table} />
          <DataTableBody table={table} columns={columns} />
          <DataTableFooter table={table} />
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
