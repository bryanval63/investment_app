import { CardContainer } from "@/components/custom/containers/CardContainer";
import { DataTable } from "@/components/custom/DataTable/DataTable";
import { formatAmount } from "@/components/custom/DataTable/data-table.utils";
import {
  getEditedForm,
  getRowEditor,
} from "@/components/custom/DataTable/row-editor";
import { RowEditorActions } from "@/components/custom/DataTable/RowEditorActions";
import { CustomSelect } from "@/components/custom/fields/CustomSelect/CustomSelect";
import { Input } from "@/components/ui/input";
import { getIncomeTypesRefApi } from "@/services/incomes/income-types-ref.service";
import {
  deleteIncomeApi,
  getIncomesApi,
  patchIncomeApi,
} from "@/services/incomes/incomes.service";
import {
  formatMonthYear,
  fromMonthInputValue,
  toMonthInputValue,
} from "@/utils/month.utils";
import { normalizeDecimal } from "@/utils/zod.utils";
import type {
  IncomeRequestDto,
  IncomeResponseDto,
  IncomeTypeRefResponseDto,
} from "@investments/shared";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

type IncomeEditForm = {
  month: string;
  type: IncomeRequestDto["type"];
  amount: string;
  /** Options du select de type (référentiel). */
  incomeTypes: IncomeTypeRefResponseDto[];
};

type IncomesListProps = {
  year: number;
};

/** Requêtes à rafraîchir après une modification : tableau et graphiques. */
const INCOME_QUERY_KEYS = [
  ["incomes"],
  ["incomesGroupedByDate"],
  ["incomesGroupedByType"],
];

/** Convertit le formulaire en payload API ; `null` si une valeur est invalide. */
const toPayload = (form: IncomeEditForm): IncomeRequestDto | null => {
  const date = fromMonthInputValue(form.month);
  const amount = Number(normalizeDecimal(form.amount));
  if (!date || !Number.isFinite(amount) || amount <= 0) return null;
  return { amount, type: form.type, date };
};

// Colonnes constantes (cf. row-editor) : l'état d'édition passe par `meta`.
const INCOME_COLUMNS: ColumnDef<IncomeResponseDto>[] = [
  {
    accessorKey: "date",
    header: "Mois",
    cell: ({ row, table }) => {
      const form = getEditedForm<IncomeResponseDto, IncomeEditForm>(
        table,
        row.original.id,
      );
      return form ? (
        <Input
          type="month"
          value={form.month}
          onChange={(e) =>
            getRowEditor<IncomeResponseDto, IncomeEditForm>(table)?.updateForm(
              { month: e.target.value },
            )
          }
          aria-label="Mois du revenu"
        />
      ) : (
        <span className="tabular-nums">{formatMonthYear(row.original.date)}</span>
      );
    },
  },
  {
    accessorFn: (row) => row.type.label,
    id: "type",
    header: "Type",
    cell: ({ row, table }) => {
      const form = getEditedForm<IncomeResponseDto, IncomeEditForm>(
        table,
        row.original.id,
      );
      return form ? (
        <CustomSelect
          value={form.type}
          options={form.incomeTypes}
          onValueChange={(type) =>
            getRowEditor<IncomeResponseDto, IncomeEditForm>(table)?.updateForm(
              { type },
            )
          }
        />
      ) : (
        row.original.type.label
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Montant",
    meta: { align: "right" },
    cell: ({ row, table }) => {
      const form = getEditedForm<IncomeResponseDto, IncomeEditForm>(
        table,
        row.original.id,
      );
      return form ? (
        <Input
          inputMode="decimal"
          value={form.amount}
          onChange={(e) =>
            getRowEditor<IncomeResponseDto, IncomeEditForm>(table)?.updateForm(
              { amount: e.target.value },
            )
          }
          aria-label="Montant du revenu"
        />
      ) : (
        formatAmount(row.original.amount)
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

/** Détail des saisies de revenus d'une année, modifiables et supprimables. */
export const IncomesList = ({ year }: IncomesListProps) => {
  const queryClient = useQueryClient();
  const { data: incomes } = useSuspenseQuery({
    queryKey: ["incomes", year],
    queryFn: () => getIncomesApi(year),
  });
  const { data: incomeTypes } = useSuspenseQuery({
    queryKey: ["incomeTypes"],
    queryFn: getIncomeTypesRefApi,
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<IncomeEditForm | null>(null);

  const invalidate = () =>
    INCOME_QUERY_KEYS.forEach((queryKey) =>
      queryClient.invalidateQueries({ queryKey }),
    );

  const patchMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: IncomeRequestDto }) =>
      patchIncomeApi(id, payload),
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteIncomeApi(id),
    onSuccess: invalidate,
  });

  const sortedIncomes = [...incomes].sort(
    (a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime() ||
      a.type.label.localeCompare(b.type.label),
  );

  return (
    <CardContainer
      title="Détail des saisies"
      description="Corriger ou supprimer un revenu saisi"
    >
      <DataTable
        columns={INCOME_COLUMNS}
        data={sortedIncomes}
        mobileCards
        meta={{
          rowEditor: {
            editingId,
            form,
            canSave: form !== null && toPayload(form) !== null,
            updateForm: (patch) =>
              setForm((prev) =>
                prev ? { ...prev, ...(patch as Partial<IncomeEditForm>) } : prev,
              ),
            startEdit: (row) => {
              const income = row as IncomeResponseDto;
              setEditingId(income.id);
              setForm({
                month: toMonthInputValue(income.date),
                type: income.type.code,
                amount: income.amount.toString(),
                incomeTypes,
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
              if (!confirm("Confirmer la suppression de ce revenu ?")) return;
              deleteMutation.mutate(id);
            },
          },
        }}
      />
    </CardContainer>
  );
};
