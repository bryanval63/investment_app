import { MainContainer } from "@/components/custom/containers/MainContainer";
import { DataTable } from "@/components/custom/DataTable/DataTable";
import { CustomCheckbox } from "@/components/custom/fields/CustomCheckbox/CustomCheckbox";
import { CustomSelect } from "@/components/custom/fields/CustomSelect/CustomSelect";
import { formatAmount } from "@/components/custom/DataTable/data-table.utils";
import { IconActionButton } from "@/components/custom/DataTable/IconActionButton";
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
import {
  useMutation,
  useSuspenseQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { ColumnDef, RowData } from "@tanstack/react-table";
import { Check, Pencil, X } from "lucide-react";
import { useState } from "react";
import { DatePicker } from "@/components/custom/form/DatePicker";
import { cn } from "@/lib/utils";

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

// Statut du compte en pastille : emerald si ouvert, slate si fermé.
const AccountStatusBadge = ({ isClosed }: { isClosed: boolean }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
      isClosed
        ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
        : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    )}
  >
    <span
      aria-hidden
      className={cn(
        "size-1.5 rounded-full",
        isClosed ? "bg-slate-400" : "bg-emerald-500",
      )}
    />
    {isClosed ? "Fermé" : "Ouvert"}
  </span>
);

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
    meta: { align: "right" },
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
        formatAmount(row.original.defaultTransactionAmount)
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
      ) : (
        <AccountStatusBadge isClosed={row.original.isClosed} />
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    meta: { align: "right" },
    cell: ({ row, table }) => {
      const editor = table.options.meta?.accountEditor;
      return editor?.editingId === row.original.id ? (
        <div className="flex justify-end gap-1">
          <IconActionButton
            icon={Check}
            label="Sauvegarder"
            tone="primary"
            onClick={() => editor.save(row.original.id)}
            disabled={editor.isSaving}
          />
          <IconActionButton
            icon={X}
            label="Annuler"
            onClick={() => editor.cancelEdit()}
          />
        </div>
      ) : (
        <div className="flex justify-end">
          <IconActionButton
            icon={Pencil}
            label="Éditer"
            onClick={() => editor?.startEdit(row.original)}
          />
        </div>
      );
    },
  },
];

export const AccountsList = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<AccountForm>>({});

  const { data: accounts } = useSuspenseQuery({
    queryKey: ["accounts"],
    queryFn: getAccountsApi,
  });
  const { data: investmentTypes } = useSuspenseQuery<
    InvestmentTypeRefResponseDto[]
  >({
    queryKey: ["investment-types-ref"],
    queryFn: getInvestmentTypesRefApi,
  });
  const { data: investmentCategories } = useSuspenseQuery({
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
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Erreur:{" "}
            {patchMutation.error instanceof Error
              ? patchMutation.error.message
              : "Une erreur est survenue"}
          </div>
        )}
        <DataTable
          columns={ACCOUNT_COLUMNS}
          data={accounts ?? []}
          mobileCards
          stickyFirstColumn
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
