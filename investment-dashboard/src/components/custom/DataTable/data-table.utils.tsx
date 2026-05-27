import { Button } from "@/components/ui/button";
import { formatToEuro, formatToReadableDate } from "@/utils/format.utils";
import type { Column, Row, SortingFn, Table } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

const ARROW_STYLES = "ml-2 h-4 w-4 opacity-40";

export function formatAmountCell<TData>(
  row: Row<TData>,
  column: string = "amount",
) {
  const amount = row.getValue<number | undefined>(column);

  return formatAmount(amount);
}

export function formatAmount(amount = 0, className?: string) {
  const formatted = formatToEuro(amount);

  return <div className={`text-right ${className}`}>{formatted}</div>;
}

export function formatDateCell<TData>(row: Row<TData>) {
  const date = row.getValue<Date>("date");
  const formatted = formatToReadableDate(date);
  const formattedText = formatted.charAt(0).toUpperCase() + formatted.slice(1);

  return <div className="text-center">{formattedText}</div>;
}

export function addSorting<TData, TValue>(
  column: Column<TData, TValue>,
  label: React.ReactNode,
) {
  if (!column.getCanSort()) {
    return label;
  }

  const isSorted = column.getIsSorted();

  return (
    <Button
      variant="ghost"
      className="cursor-pointer"
      onClick={column.getToggleSortingHandler()}
    >
      {label}

      {isSorted === "asc" && <ArrowUp className={ARROW_STYLES} />}
      {isSorted === "desc" && <ArrowDown className={ARROW_STYLES} />}
      {!isSorted && <ArrowUpDown className={ARROW_STYLES} />}
    </Button>
  );
}

export function calculateTotalAmount<TData>(
  table: Table<TData>,
  column: string = "amount",
) {
  {
    const total = table.getFilteredRowModel().rows.reduce((sum, row) => {
      return sum + (row.getValue<number | undefined>(column) || 0);
    }, 0);

    return formatAmount(total, "font-medium");
  }
}

export const safeSort =
  <TData,>(): SortingFn<TData> =>
  (rowA, rowB, columnId) => {
    const a = rowA.getValue(columnId);
    const b = rowB.getValue(columnId);

    const aNum = Number(a);
    const bNum = Number(b);

    const aIsNumber = Number.isFinite(aNum);
    const bIsNumber = Number.isFinite(bNum);

    if (aIsNumber && bIsNumber) {
      return bNum - aNum;
    }

    return String(b ?? "").localeCompare(String(a ?? ""));
  };
