import { CardContainer } from "@/components/custom/containers/CardContainer";
import { DataTable } from "@/components/custom/DataTable/DataTable";
import { formatAmount } from "@/components/custom/DataTable/data-table.utils";
import {
  getEditedForm,
  getRowEditor,
} from "@/components/custom/DataTable/row-editor";
import { RowEditorActions } from "@/components/custom/DataTable/RowEditorActions";
import { Input } from "@/components/ui/input";
import {
  deleteNetWorthApi,
  getNetWorthesApi,
  patchNetWorthApi,
} from "@/services/net-worthes/net-worthes.service";
import {
  formatMonthYear,
  fromMonthInputValue,
  toMonthInputValue,
} from "@/utils/month.utils";
import { cn } from "@/lib/utils";
import { formatToEuro } from "@/utils/format.utils";
import { getColorAndBgColor } from "@/utils/style.utils";
import { normalizeDecimal } from "@/utils/zod.utils";
import type {
  NetWorthRequestDto,
  NetWorthResponseDto,
} from "@investments/shared";
import {
  useMutation,
  useQueryClient,
  useSuspenseQueries,
} from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

type NetWorthRow = NetWorthResponseDto & {
  /** Écart avec le mois saisi précédent ; `null` pour le premier. */
  variation: number | null;
};

type NetWorthEditForm = {
  month: string;
  amount: string;
};

/** Convertit le formulaire en payload API ; `null` si une valeur est invalide. */
const toPayload = (form: NetWorthEditForm): NetWorthRequestDto | null => {
  const date = fromMonthInputValue(form.month);
  const amount = Number(normalizeDecimal(form.amount));
  if (!date || !Number.isFinite(amount) || amount <= 0) return null;
  return { amount, date };
};

const byDate = (a: NetWorthResponseDto, b: NetWorthResponseDto) =>
  new Date(a.date).getTime() - new Date(b.date).getTime();

/**
 * Lignes de l'année, de la plus récente à la plus ancienne, avec l'écart par
 * rapport à la saisie précédente (la dernière de l'année d'avant pour la
 * première de l'année).
 */
const toRows = (
  netWorthes: NetWorthResponseDto[],
  previousYear: NetWorthResponseDto[],
): NetWorthRow[] => {
  const lastOfPreviousYear = [...previousYear].sort(byDate).at(-1);

  return [...netWorthes]
    .sort(byDate)
    .map((netWorth, index, sorted) => {
      const previous = index === 0 ? lastOfPreviousYear : sorted[index - 1];
      return {
        ...netWorth,
        variation: previous ? netWorth.amount - previous.amount : null,
      };
    })
    .reverse();
};

// Colonnes constantes (cf. row-editor) : l'état d'édition passe par `meta`.
const NET_WORTH_COLUMNS: ColumnDef<NetWorthRow>[] = [
  {
    accessorKey: "date",
    header: "Mois",
    cell: ({ row, table }) => {
      const form = getEditedForm<NetWorthRow, NetWorthEditForm>(
        table,
        row.original.id,
      );
      return form ? (
        <Input
          type="month"
          value={form.month}
          onChange={(e) =>
            getRowEditor<NetWorthRow, NetWorthEditForm>(table)?.updateForm({
              month: e.target.value,
            })
          }
          aria-label="Mois du patrimoine"
        />
      ) : (
        <span className="tabular-nums">{formatMonthYear(row.original.date)}</span>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Montant",
    meta: { align: "right" },
    cell: ({ row, table }) => {
      const form = getEditedForm<NetWorthRow, NetWorthEditForm>(
        table,
        row.original.id,
      );
      return form ? (
        <Input
          inputMode="decimal"
          value={form.amount}
          onChange={(e) =>
            getRowEditor<NetWorthRow, NetWorthEditForm>(table)?.updateForm({
              amount: e.target.value,
            })
          }
          aria-label="Montant du patrimoine"
        />
      ) : (
        formatAmount(row.original.amount)
      );
    },
  },
  {
    accessorKey: "variation",
    header: "Variation",
    meta: { align: "right" },
    cell: ({ row }) => {
      const { variation } = row.original;
      if (variation === null) {
        return <div className="text-right text-muted-foreground">—</div>;
      }
      return (
        <div
          className={cn(
            "text-right tabular-nums",
            getColorAndBgColor(variation, false),
          )}
        >
          {formatToEuro(variation, { signDisplay: "exceptZero" })}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    meta: { align: "right" },
    cell: ({ row, table }) => (
      <RowEditorActions table={table} row={row.original} />
    ),
  },
];

type NetWorthListProps = {
  year: number;
};

/** Historique d'une année de patrimoine, modifiable et supprimable. */
export const NetWorthList = ({ year }: NetWorthListProps) => {
  const queryClient = useQueryClient();
  // Année précédente : uniquement pour la variation du premier mois affiché.
  const [{ data: netWorthes }, { data: previousYear }] = useSuspenseQueries({
    queries: [year, year - 1].map((queryYear) => ({
      queryKey: ["net-worthes", queryYear],
      queryFn: () => getNetWorthesApi(queryYear),
    })),
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<NetWorthEditForm | null>(null);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["net-worthes"] });

  const patchMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: NetWorthRequestDto;
    }) => patchNetWorthApi(id, payload),
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteNetWorthApi(id),
    onSuccess: invalidate,
  });

  return (
    <CardContainer
      title="Historique du patrimoine"
      description="Corriger ou supprimer un montant saisi"
    >
      <DataTable
        columns={NET_WORTH_COLUMNS}
        data={toRows(netWorthes, previousYear)}
        mobileCards
        meta={{
          rowEditor: {
            editingId,
            form,
            canSave: form !== null && toPayload(form) !== null,
            updateForm: (patch) =>
              setForm((prev) =>
                prev
                  ? { ...prev, ...(patch as Partial<NetWorthEditForm>) }
                  : prev,
              ),
            startEdit: (row) => {
              const netWorth = row as NetWorthRow;
              setEditingId(netWorth.id);
              setForm({
                month: toMonthInputValue(netWorth.date),
                amount: netWorth.amount.toString(),
              });
            },
            save: (id) => {
              const payload = form && toPayload(form);
              if (!payload) return;
              patchMutation.mutate({ id, payload });
              setEditingId(null);
            },
            cancelEdit: () => setEditingId(null),
            remove: (id) => {
              if (!confirm("Confirmer la suppression de ce montant ?")) return;
              deleteMutation.mutate(id);
            },
          },
        }}
      />
    </CardContainer>
  );
};
