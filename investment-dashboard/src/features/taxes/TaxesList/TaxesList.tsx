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
  deleteTaxApi,
  getTaxesApi,
  patchTaxApi,
} from "@/services/taxes/taxes.service";
import { getColorAndBgColor } from "@/utils/style.utils";
import { normalizeDecimal } from "@/utils/zod.utils";
import type { TaxRequestDto, TaxResponseDto } from "@investments/shared";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

type TaxEditForm = {
  year: string;
  amount: string;
};

/** Requêtes à rafraîchir : liste et revenus « impôts inclus ». */
const TAX_QUERY_KEYS = [["taxes"], ["incomesGroupedByDate"]];

/** Convertit le formulaire en payload API ; `null` si une valeur est invalide. */
const toPayload = (form: TaxEditForm): TaxRequestDto | null => {
  const year = Number(form.year);
  const amount = Number(normalizeDecimal(form.amount));
  if (!Number.isInteger(year) || year < 2000 || year > 2100) return null;
  if (!Number.isFinite(amount) || amount === 0) return null;
  return { year, amount };
};

// Colonnes constantes (cf. row-editor) : l'état d'édition passe par `meta`.
const TAX_COLUMNS: ColumnDef<TaxResponseDto>[] = [
  {
    accessorKey: "year",
    header: "Année",
    cell: ({ row, table }) => {
      const form = getEditedForm<TaxResponseDto, TaxEditForm>(
        table,
        row.original.id,
      );
      return form ? (
        <Input
          inputMode="numeric"
          value={form.year}
          onChange={(e) =>
            getRowEditor<TaxResponseDto, TaxEditForm>(table)?.updateForm({
              year: e.target.value,
            })
          }
          aria-label="Année de l'impôt"
        />
      ) : (
        <span className="tabular-nums">{row.original.year}</span>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Montant",
    meta: { align: "right" },
    cell: ({ row, table }) => {
      const form = getEditedForm<TaxResponseDto, TaxEditForm>(
        table,
        row.original.id,
      );
      return form ? (
        <Input
          inputMode="decimal"
          value={form.amount}
          onChange={(e) =>
            getRowEditor<TaxResponseDto, TaxEditForm>(table)?.updateForm({
              amount: e.target.value,
            })
          }
          aria-label="Montant de l'impôt"
        />
      ) : (
        formatAmount(
          row.original.amount,
          getColorAndBgColor(row.original.amount, false),
        )
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

/** Impôts annuels saisis, modifiables et supprimables. */
export const TaxesList = () => {
  const queryClient = useQueryClient();
  const { data: taxes } = useSuspenseQuery({
    queryKey: ["taxes"],
    queryFn: getTaxesApi,
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<TaxEditForm | null>(null);

  const invalidate = () =>
    TAX_QUERY_KEYS.forEach((queryKey) =>
      queryClient.invalidateQueries({ queryKey }),
    );

  const patchMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: TaxRequestDto }) =>
      patchTaxApi(id, payload),
    onSuccess: () => {
      invalidate();
      setEditingId(null);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTaxApi(id),
    onSuccess: invalidate,
  });

  const sortedTaxes = [...taxes].sort((a, b) => b.year - a.year);

  return (
    <CardContainer
      title="Impôts saisis"
      description="Négatif : impôt payé ; positif : remboursement"
    >
      <>
        {patchMutation.error && (
          <p className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Modification impossible : une autre ligne existe peut-être déjà
            pour cette année.
          </p>
        )}
        <DataTable
          columns={TAX_COLUMNS}
          data={sortedTaxes}
          mobileCards
          meta={{
            rowEditor: {
              editingId,
              form,
              canSave: form !== null && toPayload(form) !== null,
              updateForm: (patch) =>
                setForm((prev) =>
                  prev ? { ...prev, ...(patch as Partial<TaxEditForm>) } : prev,
                ),
              startEdit: (row) => {
                const tax = row as TaxResponseDto;
                patchMutation.reset();
                setEditingId(tax.id);
                setForm({
                  year: tax.year.toString(),
                  amount: tax.amount.toString(),
                });
              },
              save: (id) => {
                const payload = form && toPayload(form);
                if (!payload) return;
                patchMutation.mutate({ id, payload });
              },
              cancelEdit: () => {
                patchMutation.reset();
                setEditingId(null);
              },
              remove: (id) => {
                if (!confirm("Confirmer la suppression de cet impôt ?")) return;
                deleteMutation.mutate(id);
              },
            },
          }}
        />
      </>
    </CardContainer>
  );
};
