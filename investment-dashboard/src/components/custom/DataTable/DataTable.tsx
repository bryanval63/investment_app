import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";

import { Table } from "@/components/ui/table";

import { useState } from "react";
import { safeSort } from "./data-table.utils";
import { DataTableHeader } from "./DataTableHeader";
import { DataTableBody } from "./DataTableBody";
import { DataTableFooter } from "./DataTableFooter";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
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
      <div className="rounded-md border dark:bg-slate-900 ">
        <Table>
          <DataTableHeader table={table} />
          <DataTableBody table={table} columns={columns} />
          <DataTableFooter table={table} />
        </Table>
      </div>
    </div>
  );
}
