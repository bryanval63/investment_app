import {
  calculateTotalAmount,
  formatAmountCell,
} from "@/components/custom/DataTable/data-table.utils";
import type { ColumnDef, Row, Table } from "@tanstack/react-table";
import type { PivotIncome } from "./income-columns.type";
import { MONTHS } from "@investments/shared/constants/date.constant";

export const INCOMES_DATA_TABLE_COLUMNS: ColumnDef<PivotIncome>[] = [
  {
    accessorKey: "type",
    header: "Type",
  },
  ...MONTHS.map(({ code, label }) => ({
    accessorKey: code,
    header: label,
    cell: ({ row }: { row: Row<PivotIncome> }) =>
      formatAmountCell<PivotIncome>(row, code),
    footer: ({ table }: { table: Table<PivotIncome> }) =>
      calculateTotalAmount<PivotIncome>(table, code),
  })),
];
