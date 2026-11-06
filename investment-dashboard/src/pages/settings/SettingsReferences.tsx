import { useState } from "react";
import { useMutation, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  FolderTree,
  Landmark,
  Pencil,
  Plus,
  Trash2,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import { SectionCard } from "@/components/custom/containers/SectionCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MainContainer } from "@/components/custom/containers/MainContainer";
import {
  getInvestmentTypesRefApi,
  patchInvestmentTypeRefApi,
  createInvestmentTypeRefApi,
  deleteInvestmentTypeRefApi,
} from "@/services/investments/investment-types-ref.service";
import {
  getInvestmentCategoriesRefApi,
  patchInvestmentCategoryRefApi,
  createInvestmentCategoryRefApi,
  deleteInvestmentCategoryRefApi,
} from "@/services/investments/investment-categories-ref.service";
import {
  createIncomeTypeRefApi,
  deleteIncomeTypeRefApi,
  getIncomeTypesRefApi,
  patchIncomeTypeRefApi,
} from "@/services/incomes/income-types-ref.service";
import type {
  IncomeTypeRefResponseDto,
  InvestmentCategoryRefResponseDto,
  InvestmentTypeRefResponseDto,
} from "@investments/shared";

type Reference =
  | InvestmentTypeRefResponseDto
  | InvestmentCategoryRefResponseDto
  | IncomeTypeRefResponseDto;

const ReferenceList = ({
  title,
  icon,
  references,
  onSave,
  onAdd,
  onDelete,
}: {
  title: string;
  icon: LucideIcon;
  references: Reference[];
  onSave: (id: number, label: string) => void;
  onAdd: (label: string) => void;
  onDelete: (id: number) => void;
}) => {
  const [newLabel, setNewLabel] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  const [label, setLabel] = useState("");

  const add = () => {
    onAdd(newLabel.trim());
    setNewLabel("");
  };

  return (
    <SectionCard
      icon={icon}
      title={title}
      action={
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium tabular-nums text-slate-600">
          {references.length}
        </span>
      }
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          className="min-w-0"
          placeholder="Nouveau libellé"
          aria-label={`Nouveau libellé (${title})`}
          value={newLabel}
          onChange={(event) => setNewLabel(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && newLabel.trim()) add();
          }}
        />
        <Button
          className="w-full bg-indigo-600 text-white hover:bg-indigo-500 sm:w-auto"
          disabled={!newLabel.trim()}
          onClick={add}
        >
          <Plus />
          Ajouter
        </Button>
      </div>

      <ul className="flex flex-col divide-y divide-slate-100 rounded-lg border border-slate-200">
        {references.map((reference) => (
          <li
            key={reference.id}
            className="flex flex-col gap-2 px-3 py-2.5 sm:flex-row sm:items-center sm:gap-3"
          >
            <span className="w-fit max-w-full shrink-0 truncate rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600 sm:w-36">
              {reference.code}
            </span>
            {editing === reference.id ? (
              <div className="flex min-w-0 flex-1 items-center gap-1">
                <Input
                  className="h-8 min-w-0 flex-1"
                  aria-label={`Libellé de ${reference.code}`}
                  value={label}
                  autoFocus
                  onChange={(event) => setLabel(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      onSave(reference.id, label);
                      setEditing(null);
                    }
                    if (event.key === "Escape") setEditing(null);
                  }}
                />
                <Button
                  size="icon-sm"
                  aria-label="Sauvegarder"
                  title="Sauvegarder"
                  className="bg-indigo-600 text-white hover:bg-indigo-500"
                  onClick={() => {
                    onSave(reference.id, label);
                    setEditing(null);
                  }}
                >
                  <Check />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Annuler"
                  title="Annuler"
                  className="text-slate-500"
                  onClick={() => setEditing(null)}
                >
                  <X />
                </Button>
              </div>
            ) : (
              <div className="flex min-w-0 flex-1 items-center gap-1">
                <span className="min-w-0 flex-1 break-words text-sm text-slate-900">
                  {reference.label}
                </span>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Éditer"
                  title="Éditer"
                  className="text-slate-500 hover:text-indigo-600"
                  onClick={() => {
                    setEditing(reference.id);
                    setLabel(reference.label);
                  }}
                >
                  <Pencil />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Supprimer"
                  title="Supprimer"
                  className="text-slate-500 hover:bg-red-50 hover:text-red-600"
                  onClick={() => onDelete(reference.id)}
                >
                  <Trash2 />
                </Button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </SectionCard>
  );
};

type ReferenceKind = "type" | "category" | "incomeType";

/** API et clé de cache de chaque référentiel. */
const REFERENCE_APIS = {
  type: {
    queryKey: "investment-types-ref",
    create: createInvestmentTypeRefApi,
    update: patchInvestmentTypeRefApi,
    remove: deleteInvestmentTypeRefApi,
  },
  category: {
    queryKey: "investment-categories-ref",
    create: createInvestmentCategoryRefApi,
    update: patchInvestmentCategoryRefApi,
    remove: deleteInvestmentCategoryRefApi,
  },
  incomeType: {
    queryKey: "incomeTypes",
    create: createIncomeTypeRefApi,
    update: patchIncomeTypeRefApi,
    remove: deleteIncomeTypeRefApi,
  },
} satisfies Record<ReferenceKind, unknown>;

/** Requêtes affichant les libellés de types de revenus. */
const INCOME_LABEL_QUERY_KEYS = ["incomes", "incomesGroupedByType"];

export const SettingsReferences = () => {
  const queryClient = useQueryClient();
  const { data: types = [] } = useSuspenseQuery({
    queryKey: ["investment-types-ref"],
    queryFn: getInvestmentTypesRefApi,
  });
  const { data: categories = [] } = useSuspenseQuery({
    queryKey: ["investment-categories-ref"],
    queryFn: getInvestmentCategoriesRefApi,
  });
  const { data: incomeTypes = [] } = useSuspenseQuery({
    queryKey: ["incomeTypes"],
    queryFn: getIncomeTypesRefApi,
  });
  const referenceMutation = useMutation({
    mutationFn: async (action: {
      kind: ReferenceKind;
      operation: "save" | "add" | "delete";
      id?: number;
      label?: string;
    }) => {
      const api = REFERENCE_APIS[action.kind];
      if (action.operation === "save")
        return api.update(action.id!, { label: action.label! });
      if (action.operation === "add")
        return api.create({ label: action.label! });
      return api.remove(action.id!);
    },
    onSuccess: (_, action) => {
      queryClient.invalidateQueries({
        queryKey: [REFERENCE_APIS[action.kind].queryKey],
      });
      if (action.kind === "incomeType") {
        INCOME_LABEL_QUERY_KEYS.forEach((key) =>
          queryClient.invalidateQueries({ queryKey: [key] }),
        );
      }
    },
  });

  const handlers = (kind: ReferenceKind) => ({
    onSave: (id: number, label: string) =>
      referenceMutation.mutate({ kind, operation: "save", id, label }),
    onAdd: (label: string) =>
      referenceMutation.mutate({ kind, operation: "add", label }),
    onDelete: (id: number) =>
      referenceMutation.mutate({ kind, operation: "delete", id }),
  });

  return (
    <MainContainer columns={1}>
      <>
        {referenceMutation.error && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            Opération impossible : un élément utilisé ne peut pas être supprimé,
            et un libellé doit être unique.
          </p>
        )}
        <ReferenceList
          title="Types de comptes"
          icon={Landmark}
          references={types}
          {...handlers("type")}
        />
        <ReferenceList
          title="Catégories"
          icon={FolderTree}
          references={categories.filter(({ code }) => code !== "ALL")}
          {...handlers("category")}
        />
        <ReferenceList
          title="Types de revenus"
          icon={Wallet}
          references={incomeTypes}
          {...handlers("incomeType")}
        />
      </>
    </MainContainer>
  );
};

export default SettingsReferences;
