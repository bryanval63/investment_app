import { cn } from "@/lib/utils";
import { formatToEuro, formatToReadableDate } from "@/utils/format.utils";
import type {
  Column,
  Row,
  RowData,
  SortingFn,
  Table,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    /** Alignement de l'en-tête, des cellules et du pied de colonne. */
    align?: "left" | "center" | "right";
  }
}

/** Padding homogène partagé par l'en-tête, le corps et le pied du tableau. */
export const CELL_PADDING = "px-3 py-2.5 first:pl-4 last:pr-4";

/**
 * Première colonne figée lors du défilement horizontal. Le fond (opaque) est
 * ajouté par chaque section, l'ombre marque la séparation avec le contenu défilant.
 */
export const STICKY_CELL =
  "sticky left-0 z-10 shadow-[inset_-1px_0_0_var(--color-border)]";

export function getAlignClass<TData, TValue>(column: Column<TData, TValue>) {
  const align = column.columnDef.meta?.align;
  if (align === "right") return "text-right";
  if (align === "center") return "text-center";
  return "text-left";
}

export function formatAmountCell<TData>(
  row: Row<TData>,
  column: string = "amount",
) {
  const amount = row.getValue<number | undefined>(column);

  return formatAmount(amount);
}

export function formatAmount(amount = 0, className?: string) {
  const formatted = formatToEuro(amount);

  return (
    <div className={cn("text-right tabular-nums", className)}>{formatted}</div>
  );
}

export function formatDateCell<TData>(row: Row<TData>) {
  const date = row.getValue<Date>("date");
  const formatted = formatToReadableDate(date);
  const formattedText = formatted.charAt(0).toUpperCase() + formatted.slice(1);

  return <div className="text-center tabular-nums">{formattedText}</div>;
}

const SORT_ICON_STYLES = "size-3.5 shrink-0 transition-opacity";

// Bouton de tri discret : l'icône n'apparaît qu'au survol, ou en permanence
// quand la colonne est triée.
export function addSorting<TData, TValue>(
  column: Column<TData, TValue>,
  label: React.ReactNode,
) {
  if (!column.getCanSort()) {
    return label;
  }

  const isSorted = column.getIsSorted();
  const isRight = column.columnDef.meta?.align === "right";
  const Icon =
    isSorted === "asc"
      ? ArrowUp
      : isSorted === "desc"
        ? ArrowDown
        : ArrowUpDown;

  return (
    <button
      type="button"
      onClick={column.getToggleSortingHandler()}
      className={cn(
        "group/sort -mx-1 inline-flex cursor-pointer items-center gap-1 rounded px-1 uppercase tracking-wide outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50",
        isRight && "flex-row-reverse",
        isSorted && "text-foreground",
      )}
    >
      {label}
      <Icon
        aria-hidden
        className={cn(
          SORT_ICON_STYLES,
          isSorted
            ? "opacity-70"
            : "opacity-0 group-hover/sort:opacity-50 group-focus-visible/sort:opacity-50",
        )}
      />
    </button>
  );
}

export function calculateTotalAmount<TData>(
  table: Table<TData>,
  column: string = "amount",
) {
  const total = table.getFilteredRowModel().rows.reduce((sum, row) => {
    return sum + (row.getValue<number | undefined>(column) || 0);
  }, 0);

  return formatAmount(total, "font-semibold");
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
