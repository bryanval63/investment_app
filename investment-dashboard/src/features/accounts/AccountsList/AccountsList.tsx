import { MainContainer } from "@/components/custom/containers/MainContainer";
import { DataTable } from "@/components/custom/DataTable/DataTable";
import { CustomCheckbox } from "@/components/custom/fields/CustomCheckbox/CustomCheckbox";
import { CustomSelect } from "@/components/custom/fields/CustomSelect/CustomSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getInvestmentTypesRefApi } from "@/services/investments/investment-types-ref.service";
import { getInvestmentCategoriesRefApi } from "@/services/investments/investment-categories-ref.service";
import {
  getAccountsApi,
  patchAccountApi,
} from "@/services/accounts/accounts.service";
import type {
  AccountResponseDto,
  InvestmentCategoryRefResponseDto,
  InvestmentTypeRefResponseDto,
  UpdateAccountRequestDto,
} from "@investments/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef, RowData } from "@tanstack/react-table";
import { Check, Edit, X } from "lucide-react";
import { useState } from "react";
import { DatePicker } from "@/components/custom/form/DatePicker";

type AccountForm = UpdateAccountRequestDto;
type EditableAccountCategory = Exclude<AccountForm["category"], "ALL">;

type AccountEditorMeta<TData> = {
  editingId: number | null;
  form: Partial<AccountForm>;
  investmentTypes?: InvestmentTypeRefResponseDto[];
  investmentCategories?: InvestmentCategoryRefResponseDto[];
  updateForm: <K extends keyof AccountForm>(
    field: K,
    value: AccountForm[K],
  ) => void;
  startEdit: (account: TData) => void;
  save: (id: number) => void;
  cancelEdit: () => void;
  isSaving: boolean;
};

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    accountEditor?: AccountEditorMeta<TData>;
  }
}

const ACCOUNT_COLUMNS: ColumnDef<AccountResponseDto>[] = [
  {
    accessorKey: "name",
    header: "Nom",
    cell: ({ row, table }) => {
      const editor = table.options.meta?.accountEditor;
      return editor?.editingId === row.original.id ? (
        <Input
          value={editor.form.name ?? ""}
          onChange={(event) => editor.updateForm("name", event.target.value)}
          aria-label="Nom du compte"
        />
      ) : (
        row.original.name
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row, table }) => {
      const editor = table.options.meta?.accountEditor;
      return editor?.editingId === row.original.id ? (
        <CustomSelect
          value={editor.form.type as AccountForm["type"]}
          options={
            editor.investmentTypes?.map(({ code, label }) => ({
              code,
              label,
            })) ?? []
          }
          onValueChange={(value) =>
            editor.updateForm("type", value as AccountForm["type"])
          }
        />
      ) : (
        (editor?.investmentTypes?.find(
          (type) => type.code === row.original.type,
        )?.label ?? row.original.type)
      );
    },
  },
  {
    accessorKey: "category",
    header: "Catégorie",
    cell: ({ row, table }) => {
      const editor = table.options.meta?.accountEditor;
      return editor?.editingId === row.original.id ? (
        <CustomSelect
          value={editor.form.category as EditableAccountCategory}
          options={
            editor.investmentCategories?.filter(
              (category) => category.code !== "ALL",
            ) ?? []
          }
          onValueChange={(value) =>
            editor.updateForm("category", value as EditableAccountCategory)
          }
        />
      ) : (
        (editor?.investmentCategories?.find(
          (category) => category.code === row.original.category,
        )?.label ?? row.original.category)
      );
    },
  },
  {
    accessorKey: "openingDate",
    header: "Ouverture",
    cell: ({ row, table }) => {
      const editor = table.options.meta?.accountEditor;
      return editor?.editingId === row.original.id ? (
        <DatePicker
          label="Date d'ouverture"
          value={editor.form.openingDate}
          clearable
          onChange={(value) => editor.updateForm("openingDate", value)}
        />
      ) : row.original.openingDate ? (
        new Date(row.original.openingDate).toLocaleDateString("fr-FR")
      ) : (
        "-"
      );
    },
  },
  {
    accessorKey: "defaultTransactionAmount",
    header: "Montant par défaut",
    cell: ({ row, table }) => {
      const editor = table.options.meta?.accountEditor;
      return editor?.editingId === row.original.id ? (
        <Input
          type="number"
          min="0"
          step="any"
          value={editor.form.defaultTransactionAmount ?? 0}
          onChange={(event) =>
            editor.updateForm(
              "defaultTransactionAmount",
              Number(event.target.value),
            )
          }
          aria-label="Montant de transaction par défaut"
        />
      ) : (
        row.original.defaultTransactionAmount
      );
    },
  },
  {
    accessorKey: "isClosed",
    header: "Statut",
    cell: ({ row, table }) => {
      const editor = table.options.meta?.accountEditor;
      return editor?.editingId === row.original.id ? (
        <CustomCheckbox
          label="Fermé"
          checked={editor.form.isClosed ?? false}
          setChecked={(checked) => editor.updateForm("isClosed", checked)}
        />
      ) : row.original.isClosed ? (
        "Fermé"
      ) : (
        "Ouvert"
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const editor = table.options.meta?.accountEditor;
      return editor?.editingId === row.original.id ? (
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => editor.save(row.original.id)}
            disabled={editor.isSaving}
          >
            <Check size={16} /> Sauvegarder
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.cancelEdit()}
          >
            <X size={16} /> Annuler
          </Button>
        </div>
      ) : (
        <Button
          size="sm"
          variant="outline"
          onClick={() => editor?.startEdit(row.original)}
        >
          <Edit size={16} /> Éditer
        </Button>
      );
    },
  },
];

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
  const { data: investmentCategories } = useQuery({
    queryKey: ["investment-categories-ref"],
    queryFn: getInvestmentCategoriesRefApi,
  });

  const patchMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AccountForm }) =>
      patchAccountApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["investments"] });
      queryClient.invalidateQueries({ queryKey: ["investmentsOverview"] });
      setEditingId(null);
    },
  });

  const startEdit = (account: AccountResponseDto) => {
    patchMutation.reset();
    setEditingId(account.id);
    setForm({
      name: account.name,
      type: account.type,
      category: account.category,
      isClosed: account.isClosed,
      openingDate: account.openingDate?.slice(0, 10) ?? "",
      defaultTransactionAmount: account.defaultTransactionAmount,
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
  };

  return (
    <MainContainer columns={1}>
      <>
        {patchMutation.error && (
          <div className="text-red-500 text-sm">
            Erreur:{" "}
            {patchMutation.error instanceof Error
              ? patchMutation.error.message
              : "Une erreur est survenue"}
          </div>
        )}
        <DataTable
          columns={ACCOUNT_COLUMNS}
          data={accounts ?? []}
          meta={{
            accountEditor: {
              editingId,
              form,
              investmentTypes,
              investmentCategories,
              updateForm,
              startEdit,
              save,
              cancelEdit: () => {
                patchMutation.reset();
                setEditingId(null);
              },
              isSaving: patchMutation.isPending,
            },
          }}
        />
      </>
    </MainContainer>
  );
};

export default AccountsList;
