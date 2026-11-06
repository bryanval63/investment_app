import { useId, useState } from "react";
import { useMutation, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { Bitcoin, Building2, ChartLine, Scale, ShieldCheck } from "lucide-react";
import { Label } from "@/components/ui/label";
import { SectionCard } from "@/components/custom/containers/SectionCard";
import { InputWithSuffix } from "@/components/custom/form/InputWithSuffix";
import {
  FormFooter,
  SubmitButton,
} from "@/components/custom/form/FormActions";
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
  const { data: settings = EMPTY_SETTINGS } = useSuspenseQuery({
    queryKey: ["settings"],
    queryFn: getSettingsApi,
  });
  const { data: accounts = [] } = useSuspenseQuery({
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

  const globalInput = (key: string, label: string, suffix?: string) => (
    <SettingInput
      key={key}
      label={label}
      suffix={suffix}
      value={inputValue(GLOBAL_SCOPE, key)}
      onChange={(value) => changeValue(GLOBAL_SCOPE, key, value)}
      disabled={updateMutation.isPending}
    />
  );

  return (
    <MainContainer columns={1}>
      <form onSubmit={saveAll} className="flex flex-col gap-4 lg:gap-6">
        <h2 className="text-sm font-semibold text-slate-900">
          Impôts par type de compte
        </h2>

        <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
          <SectionCard
            icon={Scale}
            title="Règles communes"
            className="md:col-span-2"
            contentClassName="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {globalInput(SOCIAL_CONTRIBUTIONS_RATE, "Prélèvements sociaux", "%")}
            {globalInput(INCOME_TAX_RATE, "Impôt sur le revenu", "%")}
          </SectionCard>

          <SectionCard
            icon={ShieldCheck}
            title="Assurance-vie"
            className="md:col-span-2"
          >
            <div className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {globalInput(
                LIFE_INSURANCE_SOCIAL_CONTRIBUTIONS_RATE,
                "Prélèvements sociaux",
                "%",
              )}
              {globalInput(LIFE_INSURANCE_REDUCED_INCOME_TAX_RATE, "Taux réduit", "%")}
              {globalInput(LIFE_INSURANCE_ALLOWANCE, "Abattement", "€")}
              {globalInput(
                LIFE_INSURANCE_CONTRIBUTION_THRESHOLD,
                "Seuil de versements",
                "€",
              )}
              {globalInput(
                LIFE_INSURANCE_ALLOWANCE_DURATION_YEARS,
                "Durée avant abattement",
                "ans",
              )}
              {globalInput(
                LIFE_INSURANCE_COUPLE_ALLOWANCE_MULTIPLIER,
                "Multiplicateur couple",
                "×",
              )}
            </div>
          </SectionCard>

          <SectionCard icon={ChartLine} title="PEA">
            {globalInput(
              PEA_ALLOWANCE_DURATION_YEARS,
              "Durée minimale avant exonération",
              "ans",
            )}
          </SectionCard>

          <SectionCard icon={Bitcoin} title="Crypto-actifs">
            {globalInput(CRYPTO_CESSION_THRESHOLD, "Seuil d'exonération", "€")}
          </SectionCard>
        </div>

        <SectionCard
          icon={Building2}
          title="Frais d'entrée SCPI"
          contentClassName="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {scpiAccounts.length === 0 ? (
            <p className="text-sm text-muted-foreground sm:col-span-2 lg:col-span-3">
              Ajoutez un compte de type SCPI pour configurer ses frais.
            </p>
          ) : (
            scpiAccounts.map((account) => (
              <SettingInput
                key={account.id}
                label={account.name}
                suffix="%"
                value={inputValue(account.name, ENTRY_FEE_RATE)}
                onChange={(value) =>
                  changeValue(account.name, ENTRY_FEE_RATE, value)
                }
                disabled={updateMutation.isPending}
              />
            ))
          )}
        </SectionCard>

        {updateMutation.error && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            Impossible d&apos;enregistrer les paramètres.
          </p>
        )}

        <FormFooter>
          <SubmitButton disabled={updateMutation.isPending}>
            {updateMutation.isPending
              ? "Enregistrement..."
              : "Enregistrer les paramètres"}
          </SubmitButton>
        </FormFooter>
      </form>
    </MainContainer>
  );
};

const SettingInput = ({
  label,
  suffix,
  value,
  onChange,
  disabled,
}: {
  label: string;
  suffix?: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) => {
  const id = useId();
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <InputWithSuffix
        id={id}
        type="number"
        min="0"
        step="0.001"
        suffix={suffix}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      />
    </div>
  );
};

export default Settings;
