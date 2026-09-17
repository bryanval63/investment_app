import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MainContainer } from "@/components/custom/containers/MainContainer";
import { getAccountsApi } from "@/services/accounts/accounts.service";
import {
  getSettingsApi,
  updateSettingApi,
} from "@/services/settings/settings.service";
import type { SettingResponseDto } from "@investments/shared";
import type { UpdateSettingRequestDto } from "@investments/shared";

const GLOBAL_SCOPE = "GLOBAL";
const ENTRY_FEE_RATE = "ENTRY_FEE_RATE";
const SOCIAL_CONTRIBUTIONS_RATE = "SOCIAL_CONTRIBUTIONS_RATE";
const INCOME_TAX_RATE = "INCOME_TAX_RATE";
const LIFE_INSURANCE_ALLOWANCE = "LIFE_INSURANCE_ALLOWANCE";
const LIFE_INSURANCE_SOCIAL_CONTRIBUTIONS_RATE =
  "LIFE_INSURANCE_SOCIAL_CONTRIBUTIONS_RATE";
const LIFE_INSURANCE_REDUCED_INCOME_TAX_RATE =
  "LIFE_INSURANCE_REDUCED_INCOME_TAX_RATE";
const LIFE_INSURANCE_CONTRIBUTION_THRESHOLD =
  "LIFE_INSURANCE_CONTRIBUTION_THRESHOLD";
const LIFE_INSURANCE_ALLOWANCE_DURATION_YEARS =
  "LIFE_INSURANCE_ALLOWANCE_DURATION_YEARS";
const LIFE_INSURANCE_COUPLE_ALLOWANCE_MULTIPLIER =
  "LIFE_INSURANCE_COUPLE_ALLOWANCE_MULTIPLIER";
const PEA_ALLOWANCE_DURATION_YEARS = "PEA_ALLOWANCE_DURATION_YEARS";
const CRYPTO_CESSION_THRESHOLD = "CRYPTO_CESSION_THRESHOLD";
const EMPTY_SETTINGS: SettingResponseDto[] = [];

const DEFAULT_VALUES: Record<string, number> = {
  [`${GLOBAL_SCOPE}:${SOCIAL_CONTRIBUTIONS_RATE}`]: 0.186,
  [`${GLOBAL_SCOPE}:${INCOME_TAX_RATE}`]: 0.128,
  [`${GLOBAL_SCOPE}:${LIFE_INSURANCE_ALLOWANCE}`]: 4600,
  [`${GLOBAL_SCOPE}:${LIFE_INSURANCE_SOCIAL_CONTRIBUTIONS_RATE}`]: 0.172,
  [`${GLOBAL_SCOPE}:${LIFE_INSURANCE_REDUCED_INCOME_TAX_RATE}`]: 0.075,
  [`${GLOBAL_SCOPE}:${LIFE_INSURANCE_CONTRIBUTION_THRESHOLD}`]: 150000,
  [`${GLOBAL_SCOPE}:${LIFE_INSURANCE_ALLOWANCE_DURATION_YEARS}`]: 8,
  [`${GLOBAL_SCOPE}:${LIFE_INSURANCE_COUPLE_ALLOWANCE_MULTIPLIER}`]: 2,
  [`${GLOBAL_SCOPE}:${PEA_ALLOWANCE_DURATION_YEARS}`]: 5,
  [`${GLOBAL_SCOPE}:${CRYPTO_CESSION_THRESHOLD}`]: 305,
};

const percentKeys = new Set([
  ENTRY_FEE_RATE,
  SOCIAL_CONTRIBUTIONS_RATE,
  INCOME_TAX_RATE,
  LIFE_INSURANCE_SOCIAL_CONTRIBUTIONS_RATE,
  LIFE_INSURANCE_REDUCED_INCOME_TAX_RATE,
]);

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

  const updateMutation = useMutation({
    mutationFn: (updatedSettings: UpdateSettingRequestDto[]) =>
      Promise.all(updatedSettings.map(updateSettingApi)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      queryClient.invalidateQueries({ queryKey: ["investmentsOverview"] });
      queryClient.invalidateQueries({ queryKey: ["investments"] });
    },
  });

  const settingValue = (scope: string, key: string) =>
    settings.find((setting) => setting.scope === scope && setting.key === key)
      ?.value ?? DEFAULT_VALUES[`${scope}:${key}`];

  const entryFeeValue = (accountName: string) => {
    const configuredValue = settingValue(accountName, ENTRY_FEE_RATE);
    if (configuredValue !== undefined) return configuredValue;

    const normalizedName = accountName.toLocaleLowerCase("fr-FR");
    return normalizedName.includes("corum origin")
      ? 0.11966
      : normalizedName.includes("corum xl")
        ? 0.12
        : undefined;
  };

  const inputValue = (scope: string, key: string) => {
    const rawValue = inputValues[`${scope}:${key}`];
    if (rawValue !== undefined) return rawValue;

    const value = key === ENTRY_FEE_RATE
      ? entryFeeValue(scope)
      : settingValue(scope, key);
    return value === undefined
      ? ""
      : percentKeys.has(key)
        ? String(value * 100)
        : String(value);
  };

  const changeValue = (scope: string, key: string, value: string) => {
    setInputValues((current) => ({
      ...current,
      [`${scope}:${key}`]: value,
    }));
  };

  const saveAll = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const settingKeys = [
      [GLOBAL_SCOPE, SOCIAL_CONTRIBUTIONS_RATE],
      [GLOBAL_SCOPE, INCOME_TAX_RATE],
      [GLOBAL_SCOPE, LIFE_INSURANCE_SOCIAL_CONTRIBUTIONS_RATE],
      [GLOBAL_SCOPE, LIFE_INSURANCE_REDUCED_INCOME_TAX_RATE],
      [GLOBAL_SCOPE, LIFE_INSURANCE_ALLOWANCE],
      [GLOBAL_SCOPE, LIFE_INSURANCE_CONTRIBUTION_THRESHOLD],
      [GLOBAL_SCOPE, LIFE_INSURANCE_ALLOWANCE_DURATION_YEARS],
      [GLOBAL_SCOPE, LIFE_INSURANCE_COUPLE_ALLOWANCE_MULTIPLIER],
      [GLOBAL_SCOPE, PEA_ALLOWANCE_DURATION_YEARS],
      [GLOBAL_SCOPE, CRYPTO_CESSION_THRESHOLD],
      ...scpiAccounts.map((account) => [account.name, ENTRY_FEE_RATE]),
    ];
    const updatedSettings = settingKeys.map(([scope, key]) => {
      const rawValue = inputValues[`${scope}:${key}`] ?? inputValue(scope, key);
      return {
        scope,
        key,
        value: Number(rawValue) / (percentKeys.has(key) ? 100 : 1),
      };
    });

    if (
      updatedSettings.some(
        ({ value }) => !Number.isFinite(value) || value < 0,
      )
    ) {
      return;
    }

    updateMutation.mutate(updatedSettings);
  };

  const scpiAccounts = accounts.filter((account) => account.type === "SCPI");

  return (
    <MainContainer columns={1}>
      <form onSubmit={saveAll} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Impôts par type de compte</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <section className="rounded-lg border p-4">
            <h3 className="mb-4 font-semibold">Règles communes</h3>
            <div className="grid gap-4">
              {[
                [SOCIAL_CONTRIBUTIONS_RATE, "Prélèvements sociaux (%)"],
                [INCOME_TAX_RATE, "Impôt sur le revenu (%)"],
              ].map(([key, label]) => (
                <SettingInput
                  key={key}
                  label={label}
                  value={inputValue(GLOBAL_SCOPE, key)}
                  onChange={(value) => changeValue(GLOBAL_SCOPE, key, value)}
                  disabled={updateMutation.isPending}
                />
              ))}
            </div>
          </section>

          <section className="rounded-lg border p-4">
            <h3 className="mb-4 font-semibold">Assurance-vie</h3>
            <div className="grid gap-4">
              {[
                [LIFE_INSURANCE_SOCIAL_CONTRIBUTIONS_RATE, "Prélèvements sociaux (%)"],
                [LIFE_INSURANCE_REDUCED_INCOME_TAX_RATE, "Taux réduit (%)"],
                [LIFE_INSURANCE_ALLOWANCE, "Abattement (€)"],
                [LIFE_INSURANCE_CONTRIBUTION_THRESHOLD, "Seuil de versements (€)"],
                [LIFE_INSURANCE_ALLOWANCE_DURATION_YEARS, "Durée avant abattement (années)"],
                [LIFE_INSURANCE_COUPLE_ALLOWANCE_MULTIPLIER, "Multiplicateur couple"],
              ].map(([key, label]) => (
                <SettingInput
                  key={key}
                  label={label}
                  value={inputValue(GLOBAL_SCOPE, key)}
                  onChange={(value) => changeValue(GLOBAL_SCOPE, key, value)}
                  disabled={updateMutation.isPending}
                />
              ))}
            </div>
          </section>

          <section className="rounded-lg border p-4">
            <h3 className="mb-4 font-semibold">PEA</h3>
            <SettingInput
              label="Durée minimale avant exonération (années)"
              value={inputValue(GLOBAL_SCOPE, PEA_ALLOWANCE_DURATION_YEARS)}
              onChange={(value) =>
                changeValue(GLOBAL_SCOPE, PEA_ALLOWANCE_DURATION_YEARS, value)
              }
              disabled={updateMutation.isPending}
            />
          </section>

          <section className="rounded-lg border p-4">
            <h3 className="mb-4 font-semibold">Crypto-actifs</h3>
            <SettingInput
              label="Seuil d'exonération (€)"
              value={inputValue(GLOBAL_SCOPE, CRYPTO_CESSION_THRESHOLD)}
              onChange={(value) =>
                changeValue(GLOBAL_SCOPE, CRYPTO_CESSION_THRESHOLD, value)
              }
              disabled={updateMutation.isPending}
            />
          </section>
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
            scpiAccounts.map((account) => (
              <SettingInput
                key={account.id}
                label={`${account.name} (%)`}
                value={inputValue(account.name, ENTRY_FEE_RATE)}
                onChange={(value) =>
                  changeValue(account.name, ENTRY_FEE_RATE, value)
                }
                disabled={updateMutation.isPending}
              />
            ))
          )}
        </CardContent>
      </Card>
      {updateMutation.error && (
        <p className="text-sm text-destructive">
          Impossible d&apos;enregistrer les paramètres.
        </p>
      )}
      <div className="flex justify-end">
        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? "Enregistrement..." : "Enregistrer les paramètres"}
        </Button>
      </div>
      </form>
    </MainContainer>
  );
};

const SettingInput = ({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) => (
  <div>
    <label className="block w-full max-w-sm text-sm">
      {label}
      <Input
        type="number"
        min="0"
        step="0.001"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      />
    </label>
  </div>
);

export default Settings;
