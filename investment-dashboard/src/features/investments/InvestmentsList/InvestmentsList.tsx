import { MainContainer } from "@/components/custom/containers/MainContainer";
import { DataTable } from "@/components/custom/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteInvestmentApi,
  getInvestmentsApi,
  patchInvestmentApi,
} from "@/services/investments/investments.service";
import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2, Check, X } from "lucide-react";

export const InvestmentsList = () => {
  const queryClient = useQueryClient();
  const { data: investments } = useQuery({
    queryKey: ["investments"],
    queryFn: () => getInvestmentsApi(),
  });

  const patchMutation = useMutation({
    mutationFn: ({ id, payload }: any) => patchInvestmentApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["investments"]);
      queryClient.invalidateQueries(["investmentsOverview"]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteInvestmentApi(id),
    onSuccess: () => queryClient.invalidateQueries(["investments"]),
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<any>({});

  const startEdit = (inv: any) => {
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
    const payload = {
      ...form,
      date: new Date(form.date),
    };
    patchMutation.mutate({ id, payload });
    setEditingId(null);
  };

  const remove = (id: number) => {
    if (!confirm("Confirmer la suppression de cet investissement ?")) return;
    deleteMutation.mutate(id);
  };

  const columns: ColumnDef<any, any>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) =>
        editingId === row.original.id ? (
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="input input-sm"
          />
        ) : (
          new Date(row.original.date).toLocaleDateString()
        ),
    },
    {
      accessorFn: (row) => row.account?.name,
      id: "account",
      header: "Compte",
    },
    {
      accessorKey: "totalAmount",
      header: "Montant total",
      cell: ({ row }) =>
        editingId === row.original.id ? (
          <input
            type="number"
            value={form.totalAmount}
            onChange={(e) => setForm({ ...form, totalAmount: e.target.value })}
            className="input input-sm"
          />
        ) : (
          Number(row.original.totalAmount).toFixed(2)
        ),
    },
    {
      accessorKey: "capitalGain",
      header: "Plus-value",
      cell: ({ row }) =>
        editingId === row.original.id ? (
          <input
            type="number"
            value={form.capitalGain}
            onChange={(e) => setForm({ ...form, capitalGain: e.target.value })}
            className="input input-sm"
          />
        ) : (
          Number(row.original.capitalGain).toFixed(2)
        ),
    },
    {
      accessorKey: "transactionAmount",
      header: "Transaction",
      cell: ({ row }) =>
        editingId === row.original.id ? (
          <input
            type="number"
            value={form.transactionAmount}
            onChange={(e) =>
              setForm({ ...form, transactionAmount: e.target.value })
            }
            className="input input-sm"
          />
        ) : (
          Number(row.original.transactionAmount).toFixed(2)
        ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) =>
        editingId === row.original.id ? (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="default"
              onClick={() => save(row.original.id)}
            >
              <Check size={16} /> Sauvegarder
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setEditingId(null)}
            >
              <X size={16} /> Annuler
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => startEdit(row.original)}
            >
              <Edit size={16} /> Éditer
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => remove(row.original.id)}
            >
              <Trash2 size={16} /> Supprimer
            </Button>
          </div>
        ),
    },
  ];

  return (
    <MainContainer>
      <div>
        <DataTable columns={columns} data={investments ?? []} />
      </div>
    </MainContainer>
  );
};

export default InvestmentsList;
