import { MainContainer } from "@/components/custom/containers/MainContainer";
import { DataTable } from "@/components/custom/DataTable/DataTable";
import { CustomSelect } from "@/components/custom/fields/CustomSelect/CustomSelect";
import { formatAmount } from "@/components/custom/DataTable/data-table.utils";
import { IconActionButton } from "@/components/custom/DataTable/IconActionButton";
import { getColorAndBgColor } from "@/utils/style.utils";
import { Input } from "@/components/ui/input";
import {
  useMutation,
  useSuspenseQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  deleteInvestmentApi,
  getInvestmentsApi,
  patchInvestmentApi,
} from "@/services/investments/investments.service";
import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { getAccountsApi } from "@/services/accounts/accounts.service";
import type {
  InvestmentListItemResponseDto,
  InvestmentRequestDto,
} from "@investments/shared";

// Valeurs du formulaire d'édition en ligne (les inputs renvoient des chaînes).
type InvestmentEditForm = {
  totalAmount: number | string;
  capitalGain: number | string;
  transactionAmount: number | string;
  date: string;
  accountId: number;
};

export const InvestmentsList = () => {
  const queryClient = useQueryClient();
  const { data: investments } = useSuspenseQuery({
    queryKey: ["investments"],
    queryFn: () => getInvestmentsApi(),
  });
  const { data: accounts } = useSuspenseQuery({
    queryKey: ["accounts"],
    queryFn: getAccountsApi,
  });

  const patchMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: InvestmentRequestDto;
    }) => patchInvestmentApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["investments"] });
      queryClient.invalidateQueries({ queryKey: ["investmentsOverview"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteInvestmentApi(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["investments"] }),
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<InvestmentEditForm | null>(null);

  const updateForm = (patch: Partial<InvestmentEditForm>) =>
    setForm((prev) => (prev ? { ...prev, ...patch } : prev));

  const startEdit = (inv: InvestmentListItemResponseDto) => {
    setEditingId(inv.id);
    setForm({
      totalAmount: Number(inv.totalAmount),
      capitalGain: Number(inv.capitalGain),
      transactionAmount: Number(inv.transactionAmount),
      date: new Date(inv.date).toISOString().slice(0, 10),
      accountId: inv.accountId,
    });
  };

  const save = (id: number) => {
    if (!form) return;
    const payload: InvestmentRequestDto = {
      accountId: form.accountId,
      totalAmount: Number(form.totalAmount),
      capitalGain: Number(form.capitalGain),
      transactionAmount: Number(form.transactionAmount),
      date: new Date(form.date),
    };
    patchMutation.mutate({ id, payload });
    setEditingId(null);
  };

  const remove = (id: number) => {
    if (!confirm("Confirmer la suppression de cet investissement ?")) return;
    deleteMutation.mutate(id);
  };

  const columns: ColumnDef<InvestmentListItemResponseDto>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) =>
        editingId === row.original.id && form ? (
          <Input
            type="date"
            value={form.date}
            onChange={(e) => updateForm({ date: e.target.value })}
            aria-label="Date de l’investissement"
          />
        ) : (
          <span className="tabular-nums">
            {new Date(row.original.date).toLocaleDateString("fr-FR")}
          </span>
        ),
    },
    {
      accessorFn: (row) => row.account?.name,
      id: "account",
      header: "Compte",
      cell: ({ row }) =>
        editingId === row.original.id && form ? (
          <CustomSelect
            value={form.accountId.toString()}
            options={
              accounts?.map(({ id, name }) => ({
                code: id.toString(),
                label: name,
              })) ?? []
            }
            onValueChange={(value) =>
              updateForm({ accountId: Number(value) })
            }
          />
        ) : (
          row.original.account?.name
        ),
    },
    {
      accessorKey: "totalAmount",
      header: "Montant total",
      meta: { align: "right" },
      cell: ({ row }) =>
        editingId === row.original.id && form ? (
          <Input
            type="number"
            value={form.totalAmount}
            onChange={(e) => updateForm({ totalAmount: e.target.value })}
            aria-label="Montant total"
          />
        ) : (
          formatAmount(Number(row.original.totalAmount))
        ),
    },
    {
      accessorKey: "capitalGain",
      header: "Plus-value",
      meta: { align: "right" },
      cell: ({ row }) =>
        editingId === row.original.id && form ? (
          <Input
            type="number"
            value={form.capitalGain}
            onChange={(e) => updateForm({ capitalGain: e.target.value })}
            aria-label="Plus-value"
          />
        ) : (
          formatAmount(
            Number(row.original.capitalGain),
            getColorAndBgColor(Number(row.original.capitalGain), false),
          )
        ),
    },
    {
      accessorKey: "transactionAmount",
      header: "Transaction",
      meta: { align: "right" },
      cell: ({ row }) =>
        editingId === row.original.id && form ? (
          <Input
            type="number"
            value={form.transactionAmount}
            onChange={(e) =>
              updateForm({ transactionAmount: e.target.value })
            }
            aria-label="Montant de la transaction"
          />
        ) : (
          formatAmount(Number(row.original.transactionAmount))
        ),
    },
    {
      id: "actions",
      header: "Actions",
      meta: { align: "right" },
      cell: ({ row }) =>
        editingId === row.original.id ? (
          <div className="flex justify-end gap-1">
            <IconActionButton
              icon={Check}
              label="Sauvegarder"
              tone="primary"
              onClick={() => save(row.original.id)}
            />
            <IconActionButton
              icon={X}
              label="Annuler"
              onClick={() => setEditingId(null)}
            />
          </div>
        ) : (
          <div className="flex justify-end gap-1">
            <IconActionButton
              icon={Pencil}
              label="Éditer"
              onClick={() => startEdit(row.original)}
            />
            <IconActionButton
              icon={Trash2}
              label="Supprimer"
              tone="danger"
              onClick={() => remove(row.original.id)}
            />
          </div>
        ),
    },
  ];

  return (
    <MainContainer columns={1}>
      <div>
        <DataTable columns={columns} data={investments ?? []} mobileCards />
      </div>
    </MainContainer>
  );
};

export default InvestmentsList;
