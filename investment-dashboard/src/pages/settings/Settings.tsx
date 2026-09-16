import { MainContainer } from "@/components/custom/containers/MainContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  getInvestmentCategoriesRefApi,
  patchInvestmentCategoryRefApi,
  createInvestmentCategoryRefApi,
  deleteInvestmentCategoryRefApi,
} from "@/services/investments/investment-categories-ref.service";
import {
  getInvestmentTypesRefApi,
  patchInvestmentTypeRefApi,
  createInvestmentTypeRefApi,
  deleteInvestmentTypeRefApi,
} from "@/services/investments/investment-types-ref.service";
import type {
  InvestmentCategoryRefResponseDto,
  InvestmentTypeRefResponseDto,
} from "@investments/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Edit, Trash2, X } from "lucide-react";
import { useState } from "react";

type Reference =
  | InvestmentTypeRefResponseDto
  | InvestmentCategoryRefResponseDto;

const ReferenceEditor = ({
  reference,
  onSave,
  isSaving,
  onDelete,
  isDeleting,
}: {
  reference: Reference;
  onSave: (id: number, label: string, onSaved: () => void) => void;
  isSaving: boolean;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(reference.label);

  const cancel = () => {
    setLabel(reference.label);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <>
          <Input
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            aria-label={`Libellé ${reference.code}`}
            autoFocus
          />
          <Button
            size="sm"
            onClick={() =>
              onSave(reference.id, label, () => setIsEditing(false))
            }
            disabled={isSaving || !label.trim()}
          >
            <Check size={16} />
            Sauvegarder
          </Button>
          <Button size="sm" variant="ghost" onClick={cancel}>
            <X size={16} />
            Annuler
          </Button>
        </>
      ) : (
        <>
          <span className="flex-1">{reference.label}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditing(true)}
          >
            <Edit size={16} />
            Éditer
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              if (
                window.confirm(
                  `Supprimer « ${reference.label} » ? Cette action est irréversible.`,
                )
              ) {
                onDelete(reference.id);
              }
            }}
            disabled={isDeleting}
            aria-label={`Supprimer ${reference.label}`}
          >
            <Trash2 size={16} />
            Supprimer
          </Button>
        </>
      )}
    </div>
  );
};

const ReferenceSection = ({
  title,
  references,
  onSave,
  isSaving,
  onAdd,
  isAdding,
  onDelete,
  isDeleting,
}: {
  title: string;
  references: Reference[];
  onSave: (id: number, label: string, onSaved: () => void) => void;
  isSaving: boolean;
  onAdd: (label: string) => void;
  isAdding: boolean;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}) => {
  const [newLabel, setNewLabel] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-2 border-b pb-3">
          <Input
            placeholder="Nouveau libellé"
            aria-label={`Nouveau ${title}`}
            value={newLabel}
            onChange={(event) => setNewLabel(event.target.value)}
          />
          <Button
            onClick={() => {
              onAdd(newLabel);
              setNewLabel("");
            }}
            disabled={isAdding || !newLabel.trim()}
          >
            Ajouter
          </Button>
        </div>
        {references.map((reference) => (
          <div
            key={reference.id}
            className="grid grid-cols-[7rem_1fr] items-center gap-4 border-b pb-3 last:border-0"
          >
            <span className="font-mono text-sm text-muted-foreground">
              {reference.code}
            </span>
            <ReferenceEditor
              reference={reference}
              onSave={onSave}
              isSaving={isSaving}
              onDelete={onDelete}
              isDeleting={isDeleting}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export const Settings = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const { data: types = [] } = useQuery({
    queryKey: ["investment-types-ref"],
    queryFn: getInvestmentTypesRefApi,
  });
  const { data: categories = [] } = useQuery({
    queryKey: ["investment-categories-ref"],
    queryFn: getInvestmentCategoriesRefApi,
  });
  const editableCategories = categories.filter(({ code }) => code !== "ALL");

  const typeMutation = useMutation({
    mutationFn: ({ id, label }: { id: number; label: string }) =>
      patchInvestmentTypeRefApi(id, { label }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["investment-types-ref"] }),
    onError: (mutationError) =>
      setError(
        mutationError instanceof Error ? mutationError.message : "Erreur",
      ),
  });
  const categoryMutation = useMutation({
    mutationFn: ({ id, label }: { id: number; label: string }) =>
      patchInvestmentCategoryRefApi(id, { label }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["investment-categories-ref"],
      }),
    onError: (mutationError) =>
      setError(
        mutationError instanceof Error ? mutationError.message : "Erreur",
      ),
  });
  const typeDeleteMutation = useMutation({
    mutationFn: deleteInvestmentTypeRefApi,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["investment-types-ref"] }),
    onError: (mutationError) =>
      setError(
        mutationError instanceof Error ? mutationError.message : "Erreur",
      ),
  });
  const categoryDeleteMutation = useMutation({
    mutationFn: deleteInvestmentCategoryRefApi,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["investment-categories-ref"],
      }),
    onError: (mutationError) =>
      setError(
        mutationError instanceof Error ? mutationError.message : "Erreur",
      ),
  });
  const typeCreateMutation = useMutation({
    mutationFn: createInvestmentTypeRefApi,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["investment-types-ref"] }),
    onError: (mutationError) =>
      setError(
        mutationError instanceof Error ? mutationError.message : "Erreur",
      ),
  });
  const categoryCreateMutation = useMutation({
    mutationFn: createInvestmentCategoryRefApi,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["investment-categories-ref"],
      }),
    onError: (mutationError) =>
      setError(
        mutationError instanceof Error ? mutationError.message : "Erreur",
      ),
  });

  const saveType = (id: number, label: string, onSaved?: () => void) => {
    setError(null);
    typeMutation.mutate({ id, label }, { onSuccess: onSaved });
  };
  const saveCategory = (id: number, label: string, onSaved?: () => void) => {
    setError(null);
    categoryMutation.mutate({ id, label }, { onSuccess: onSaved });
  };
  const addType = (label: string) => {
    setError(null);
    typeCreateMutation.mutate({ label });
  };
  const addCategory = (label: string) => {
    setError(null);
    categoryCreateMutation.mutate({ label });
  };
  const deleteType = (id: number) => {
    setError(null);
    typeDeleteMutation.mutate(id);
  };
  const deleteCategory = (id: number) => {
    setError(null);
    categoryDeleteMutation.mutate(id);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Paramètres</h1>
        <p className="text-muted-foreground">
          Personnalisez les libellés utilisés dans vos comptes et graphiques.
        </p>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <MainContainer>
        <ReferenceSection
          title="Types de comptes"
          references={types}
          onSave={saveType}
          isSaving={typeMutation.isPending}
          onAdd={addType}
          isAdding={typeCreateMutation.isPending}
          onDelete={deleteType}
          isDeleting={typeDeleteMutation.isPending}
        />
        <ReferenceSection
          title="Catégories"
          references={editableCategories}
          onSave={saveCategory}
          isSaving={categoryMutation.isPending}
          onAdd={addCategory}
          isAdding={categoryCreateMutation.isPending}
          onDelete={deleteCategory}
          isDeleting={categoryDeleteMutation.isPending}
        />
      </MainContainer>
    </div>
  );
};

export default Settings;
