import { MainContainer } from "@/components/custom/containers/MainContainer";
import { DataTable } from "@/components/custom/DataTable/DataTable";
import { CustomCheckbox } from "@/components/custom/fields/CustomCheckbox/CustomCheckbox";
import { CustomSelect } from "@/components/custom/fields/CustomSelect/CustomSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getInvestmentTypesRefApi } from "@/services/investments/investment-types-ref.service";
import {
  getAccountsApi,
  patchAccountApi,
} from "@/services/accounts/accounts.service";
import { INVESTMENT_CATEGORIES } from "@investments/shared";
import type {
  AccountResponseDto,
  InvestmentTypeRefResponseDto,
  UpdateAccountRequestDto,
} from "@investments/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Check, Edit, X } from "lucide-react";
import { useState } from "react";

type AccountForm = UpdateAccountRequestDto;
type EditableAccountCategory = Exclude<AccountForm["category"], "ALL">;

export const AccountsList = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<AccountForm>>({});

  const { data: accounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: getAccountsApi,
  });
  const { data: investmentTypes } = useQuery<InvestmentTypeRefResponseDto[]>({
    queryKey: ["investment-types-ref"],
    queryFn: getInvestmentTypesRefApi,
  });

  const patchMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AccountForm }) =>
      patchAccountApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["investments"] });
      queryClient.invalidateQueries({ queryKey: ["investmentsOverview"] });
    },
  });

  const startEdit = (account: AccountResponseDto) => {
    setEditingId(account.id);
    setForm({
      name: account.name,
      type: account.type,
      category: account.category,
      isClosed: account.isClosed,
    });
  };

  const updateForm = <K extends keyof AccountForm>(
    field: K,
    value: AccountForm[K],
  ) => setForm((current) => ({ ...current, [field]: value }));

  const save = (id: number) => {
    if (
      !form.name ||
      !form.type ||
      !form.category ||
      form.isClosed === undefined
    ) {
      return;
    }

    patchMutation.mutate({ id, payload: form as AccountForm });
    setEditingId(null);
  };

  const columns: ColumnDef<AccountResponseDto>[] = [
    {
      accessorKey: "name",
      header: "Nom",
      cell: ({ row }) =>
        editingId === row.original.id ? (
          <Input
            value={form.name ?? ""}
            onChange={(event) => updateForm("name", event.target.value)}
            aria-label="Nom du compte"
          />
        ) : (
          row.original.name
        ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) =>
        editingId === row.original.id ? (
          <CustomSelect
            value={form.type as AccountForm["type"]}
            options={
              investmentTypes?.map(({ code, label }) => ({ code, label })) ?? []
            }
            onValueChange={(value) =>
              updateForm("type", value as AccountForm["type"])
            }
          />
        ) : (
          (investmentTypes?.find((type) => type.code === row.original.type)
            ?.label ?? row.original.type)
        ),
    },
    {
      accessorKey: "category",
      header: "Catégorie",
      cell: ({ row }) =>
        editingId === row.original.id ? (
          <CustomSelect
            value={form.category as EditableAccountCategory}
            options={INVESTMENT_CATEGORIES.filter(
              (category) => category.code !== "ALL",
            )}
            onValueChange={(value) =>
              updateForm("category", value as EditableAccountCategory)
            }
          />
        ) : (
          (INVESTMENT_CATEGORIES.find(
            (category) => category.code === row.original.category,
          )?.label ?? row.original.category)
        ),
    },
    {
      accessorKey: "isClosed",
      header: "Statut",
      cell: ({ row }) =>
        editingId === row.original.id ? (
          <CustomCheckbox
            label="Fermé"
            checked={form.isClosed ?? false}
            setChecked={(checked) => updateForm("isClosed", checked)}
          />
        ) : row.original.isClosed ? (
          "Fermé"
        ) : (
          "Ouvert"
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
              onClick={() => save(row.original.id)}
              disabled={patchMutation.isPending}
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
          <Button
            size="sm"
            variant="outline"
            onClick={() => startEdit(row.original)}
          >
            <Edit size={16} /> Éditer
          </Button>
        ),
    },
  ];

  return (
    <MainContainer columns={1}>
      <DataTable columns={columns} data={accounts ?? []} />
    </MainContainer>
  );
};

export default AccountsList;
