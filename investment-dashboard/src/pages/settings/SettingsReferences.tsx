import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  references,
  onSave,
  onAdd,
  onDelete,
}: {
  title: string;
  references: Reference[];
  onSave: (id: number, label: string) => void;
  onAdd: (label: string) => void;
  onDelete: (id: number) => void;
}) => {
  const [newLabel, setNewLabel] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  const [label, setLabel] = useState("");

  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            className="min-w-0"
            placeholder="Nouveau libellé"
            value={newLabel}
            onChange={(event) => setNewLabel(event.target.value)}
          />
          <Button
            className="w-full sm:w-auto"
            disabled={!newLabel.trim()}
            onClick={() => {
              onAdd(newLabel.trim());
              setNewLabel("");
            }}
          >
            Ajouter
          </Button>
        </div>
        {references.map((reference) => (
          <div key={reference.id} className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <span className="w-full shrink-0 font-mono text-xs sm:w-32">{reference.code}</span>
            {editing === reference.id ? (
              <>
                <Input
                  className="min-w-0 flex-1"
                  value={label}
                  onChange={(event) => setLabel(event.target.value)}
                />
                <div className="flex gap-2 sm:shrink-0">
                  <Button
                    className="flex-1 sm:flex-none"
                    onClick={() => { onSave(reference.id, label); setEditing(null); }}
                  >
                    Sauvegarder
                  </Button>
                  <Button
                    className="flex-1 sm:flex-none"
                    variant="ghost"
                    onClick={() => setEditing(null)}
                  >
                    Annuler
                  </Button>
                </div>
              </>
            ) : (
              <>
                <span className="min-w-0 flex-1 break-words">{reference.label}</span>
                <div className="flex gap-2 sm:shrink-0">
                  <Button
                    className="flex-1 sm:flex-none"
                    variant="outline"
                    onClick={() => { setEditing(reference.id); setLabel(reference.label); }}
                  >
                    Éditer
                  </Button>
                  <Button
                    className="flex-1 sm:flex-none"
                    variant="destructive"
                    onClick={() => onDelete(reference.id)}
                  >
                    Supprimer
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export const SettingsReferences = () => {
  const queryClient = useQueryClient();
  const { data: types = [] } = useQuery({
    queryKey: ["investment-types-ref"],
    queryFn: getInvestmentTypesRefApi,
  });
  const { data: categories = [] } = useQuery({
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
        references={types}
        onSave={(id, label) => referenceMutation.mutate({ kind: "type", operation: "save", id, label })}
        onAdd={(label) => referenceMutation.mutate({ kind: "type", operation: "add", label })}
        onDelete={(id) => referenceMutation.mutate({ kind: "type", operation: "delete", id })}
      />
      <ReferenceList
        title="Catégories"
        references={categories.filter(({ code }) => code !== "ALL")}
        onSave={(id, label) => referenceMutation.mutate({ kind: "category", operation: "save", id, label })}
        onAdd={(label) => referenceMutation.mutate({ kind: "category", operation: "add", label })}
        onDelete={(id) => referenceMutation.mutate({ kind: "category", operation: "delete", id })}
      />
    </MainContainer>
  );
};

export default SettingsReferences;
