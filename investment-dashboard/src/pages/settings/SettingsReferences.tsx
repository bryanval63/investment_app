import { useState } from "react";
import { useMutation, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  FolderTree,
  Landmark,
  Pencil,
  Plus,
  Trash2,
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
import type {
  InvestmentCategoryRefResponseDto,
  InvestmentTypeRefResponseDto,
} from "@investments/shared";

type Reference = InvestmentTypeRefResponseDto | InvestmentCategoryRefResponseDto;

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
  const referenceMutation = useMutation({
    mutationFn: async (action: {
      kind: "type" | "category";
      operation: "save" | "add" | "delete";
      id?: number;
      label?: string;
    }) => {
      if (action.kind === "type") {
        if (action.operation === "save") return patchInvestmentTypeRefApi(action.id!, { label: action.label! });
        if (action.operation === "add") return createInvestmentTypeRefApi({ label: action.label! });
        return deleteInvestmentTypeRefApi(action.id!);
      }
      if (action.operation === "save") return patchInvestmentCategoryRefApi(action.id!, { label: action.label! });
      if (action.operation === "add") return createInvestmentCategoryRefApi({ label: action.label! });
      return deleteInvestmentCategoryRefApi(action.id!);
    },
    onSuccess: (_, action) => {
      queryClient.invalidateQueries({
        queryKey: [action.kind === "type" ? "investment-types-ref" : "investment-categories-ref"],
      });
    },
  });

  return (
    <MainContainer columns={1}>
      <ReferenceList
        title="Types de comptes"
        icon={Landmark}
        references={types}
        onSave={(id, label) => referenceMutation.mutate({ kind: "type", operation: "save", id, label })}
        onAdd={(label) => referenceMutation.mutate({ kind: "type", operation: "add", label })}
        onDelete={(id) => referenceMutation.mutate({ kind: "type", operation: "delete", id })}
      />
      <ReferenceList
        title="Catégories"
        icon={FolderTree}
        references={categories.filter(({ code }) => code !== "ALL")}
        onSave={(id, label) => referenceMutation.mutate({ kind: "category", operation: "save", id, label })}
        onAdd={(label) => referenceMutation.mutate({ kind: "category", operation: "add", label })}
        onDelete={(id) => referenceMutation.mutate({ kind: "category", operation: "delete", id })}
      />
    </MainContainer>
  );
};

export default SettingsReferences;
