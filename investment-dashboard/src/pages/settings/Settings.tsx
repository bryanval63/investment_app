import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MainContainer } from "@/components/custom/containers/MainContainer";
import { getAccountsApi } from "@/services/accounts/accounts.service";
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
  getSettingsApi,
  updateSettingApi,
} from "@/services/settings/settings.service";
import type {
  InvestmentCategoryRefResponseDto,
  InvestmentTypeRefResponseDto,
  SettingResponseDto,
} from "@investments/shared";

const GLOBAL_SCOPE = "GLOBAL";
const SOCIAL_CONTRIBUTIONS_RATE = "SOCIAL_CONTRIBUTIONS_RATE";
const INCOME_TAX_RATE = "INCOME_TAX_RATE";
const LIFE_INSURANCE_ALLOWANCE = "LIFE_INSURANCE_ALLOWANCE";
const ENTRY_FEE_RATE = "ENTRY_FEE_RATE";
const EMPTY_SETTINGS: SettingResponseDto[] = [];

const DEFAULT_VALUES: Record<string, number> = {
  [`${GLOBAL_SCOPE}:${SOCIAL_CONTRIBUTIONS_RATE}`]: 0.186,
  [`${GLOBAL_SCOPE}:${INCOME_TAX_RATE}`]: 0.128,
  [`${GLOBAL_SCOPE}:${LIFE_INSURANCE_ALLOWANCE}`]: 4600,
};

const ReferenceList = ({
  title,
  references,
  onSave,
  onAdd,
  onDelete,
}: {
  title: string;
  references: (
    | InvestmentTypeRefResponseDto
    | InvestmentCategoryRefResponseDto
  )[];
  onSave: (id: number, label: string) => void;
  onAdd: (label: string) => void;
  onDelete: (id: number) => void;
}) => {
  const [newLabel, setNewLabel] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  const [label, setLabel] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex gap-2">
          <Input
            placeholder="Nouveau libellé"
            value={newLabel}
            onChange={(event) => setNewLabel(event.target.value)}
          />
          <Button
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
          <div key={reference.id} className="flex gap-2 items-center">
            <span className="font-mono text-xs w-32">{reference.code}</span>
            {editing === reference.id ? (
              <>
                <Input
                  value={label}
                  onChange={(event) => setLabel(event.target.value)}
                />
                <Button
                  onClick={() => {
                    onSave(reference.id, label);
                    setEditing(null);
                  }}
                >
                  Sauvegarder
                </Button>
                <Button variant="ghost" onClick={() => setEditing(null)}>
                  Annuler
                </Button>
              </>
            ) : (
              <>
                <span className="flex-1">{reference.label}</span>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditing(reference.id);
                    setLabel(reference.label);
                  }}
                >
                  Éditer
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => onDelete(reference.id)}
                >
                  Supprimer
                </Button>
              </>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export const Settings = () => {
  const queryClient = useQueryClient();
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const { data: settings = EMPTY_SETTINGS } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettingsApi,
  });
  const { data: accounts = [] } = useQuery({
    queryKey: ["accounts"],
    queryFn: getAccountsApi,
  });
  const { data: types = [] } = useQuery({
    queryKey: ["investment-types-ref"],
    queryFn: getInvestmentTypesRefApi,
  });
  const { data: categories = [] } = useQuery({
    queryKey: ["investment-categories-ref"],
    queryFn: getInvestmentCategoriesRefApi,
  });

  useEffect(() => {
    setInputValues(
      Object.fromEntries(
        settings.map((setting) => {
          const isPercent =
            setting.key === ENTRY_FEE_RATE ||
            setting.key === SOCIAL_CONTRIBUTIONS_RATE ||
            setting.key === INCOME_TAX_RATE;
          return [
            `${setting.scope}:${setting.key}`,
            isPercent ? String(setting.value * 100) : String(setting.value),
          ];
        }),
      ),
    );
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: updateSettingApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      queryClient.invalidateQueries({ queryKey: ["investmentsOverview"] });
      queryClient.invalidateQueries({ queryKey: ["investments"] });
    },
  });
  const referenceMutation = useMutation({
    mutationFn: async (action: {
      kind: "type" | "category";
      operation: "save" | "add" | "delete";
      id?: number;
      label?: string;
    }) => {
      if (action.kind === "type") {
        if (action.operation === "save")
          return patchInvestmentTypeRefApi(action.id!, {
            label: action.label!,
          });
        if (action.operation === "add")
          return createInvestmentTypeRefApi({ label: action.label! });
        return deleteInvestmentTypeRefApi(action.id!);
      }
      if (action.operation === "save")
        return patchInvestmentCategoryRefApi(action.id!, {
          label: action.label!,
        });
      if (action.operation === "add")
        return createInvestmentCategoryRefApi({ label: action.label! });
      return deleteInvestmentCategoryRefApi(action.id!);
    },
    onSuccess: (_, action) => {
      queryClient.invalidateQueries({
        queryKey: [
          action.kind === "type"
            ? "investment-types-ref"
            : "investment-categories-ref",
        ],
      });
    },
  });

  const settingValue = (scope: string, key: string) =>
    settings.find((setting) => setting.scope === scope && setting.key === key)
      ?.value ?? DEFAULT_VALUES[`${scope}:${key}`];

  const entryFeeValue = (accountName: string) => {
    const configuredValue = settingValue(accountName, ENTRY_FEE_RATE);
    if (configuredValue !== undefined) {
      return configuredValue;
    }

    const normalizedName = accountName.toLocaleLowerCase("fr-FR");
    return normalizedName.includes("corum origin")
      ? 0.11966
      : normalizedName.includes("corum xl")
        ? 0.12
        : undefined;
  };

  const inputValue = (scope: string, key: string, asPercent = false) => {
    const keyName = `${scope}:${key}`;
    const rawValue = inputValues[keyName];
    if (rawValue !== undefined) {
      return rawValue;
    }

    const value =
      key === ENTRY_FEE_RATE ? entryFeeValue(scope) : settingValue(scope, key);
    return value === undefined
      ? ""
      : asPercent
        ? String(value * 100)
        : String(value);
  };

  const changeValue = (scope: string, key: string, value: string) => {
    setInputValues((current) => ({
      ...current,
      [`${scope}:${key}`]: value,
    }));
  };

  const save = (scope: string, key: string, asPercent = false) => {
    const rawValue = inputValues[`${scope}:${key}`];
    const value = Number(rawValue) / (asPercent ? 100 : 1);
    if (!Number.isFinite(value) || value < 0) return;
    updateMutation.mutate({ scope, key, value });
  };

  const scpiAccounts = accounts.filter((account) => account.type === "SCPI");

  return (
    <MainContainer columns={1}>
      <Card>
        <CardHeader>
          <CardTitle>Impôts</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {[
            [SOCIAL_CONTRIBUTIONS_RATE, "Prélèvements sociaux (%)"],
            [INCOME_TAX_RATE, "Impôt sur le revenu (%)"],
          ].map(([key, label]) => (
            <div key={key} className="flex gap-2 items-end">
              <label className="flex-1 text-sm">
                {label}
                <Input
                  type="number"
                  min="0"
                  step="0.001"
                  value={inputValue(GLOBAL_SCOPE, key, true)}
                  onChange={(event) =>
                    changeValue(GLOBAL_SCOPE, key, event.target.value)
                  }
                />
              </label>
              <Button
                onClick={() => save(GLOBAL_SCOPE, key, true)}
                disabled={updateMutation.isPending}
              >
                Enregistrer
              </Button>
            </div>
          ))}
          <div className="flex gap-2 items-end">
            <label className="flex-1 text-sm">
              Abattement assurance-vie (€)
              <Input
                type="number"
                min="0"
                value={inputValue(GLOBAL_SCOPE, LIFE_INSURANCE_ALLOWANCE)}
                onChange={(event) =>
                  changeValue(
                    GLOBAL_SCOPE,
                    LIFE_INSURANCE_ALLOWANCE,
                    event.target.value,
                  )
                }
              />
            </label>
            <Button
              onClick={() => save(GLOBAL_SCOPE, LIFE_INSURANCE_ALLOWANCE)}
              disabled={updateMutation.isPending}
            >
              Enregistrer
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Frais d&apos;entrée SCPI</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {scpiAccounts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Ajoutez un compte de type SCPI pour configurer ses frais.
            </p>
          ) : (
            scpiAccounts.map((account) => {
              return (
                <div key={account.id} className="flex gap-2 items-end max-w-xl">
                  <label className="flex-1 text-sm">
                    {account.name} (%)
                    <Input
                      type="number"
                      min="0"
                      step="0.001"
                      value={inputValue(account.name, ENTRY_FEE_RATE, true)}
                      onChange={(event) =>
                        changeValue(
                          account.name,
                          ENTRY_FEE_RATE,
                          event.target.value,
                        )
                      }
                    />
                  </label>
                  <Button
                    onClick={() => save(account.name, ENTRY_FEE_RATE, true)}
                    disabled={updateMutation.isPending}
                  >
                    Enregistrer
                  </Button>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
      <ReferenceList
        title="Types de comptes"
        references={types}
        onSave={(id, label) =>
          referenceMutation.mutate({
            kind: "type",
            operation: "save",
            id,
            label,
          })
        }
        onAdd={(label) =>
          referenceMutation.mutate({ kind: "type", operation: "add", label })
        }
        onDelete={(id) =>
          referenceMutation.mutate({ kind: "type", operation: "delete", id })
        }
      />
      <ReferenceList
        title="Catégories"
        references={categories.filter(({ code }) => code !== "ALL")}
        onSave={(id, label) =>
          referenceMutation.mutate({
            kind: "category",
            operation: "save",
            id,
            label,
          })
        }
        onAdd={(label) =>
          referenceMutation.mutate({
            kind: "category",
            operation: "add",
            label,
          })
        }
        onDelete={(id) =>
          referenceMutation.mutate({
            kind: "category",
            operation: "delete",
            id,
          })
        }
      />
    </MainContainer>
  );
};

export default Settings;
