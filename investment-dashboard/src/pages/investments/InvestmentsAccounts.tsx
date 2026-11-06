import { MainContainer } from "@/components/custom/containers/MainContainer";
import { PageToolbar, ToolbarField } from "@/components/custom/containers/PageToolbar";
import { CustomSelect } from "@/components/custom/fields/CustomSelect/CustomSelect";
import { getAccountsApi } from "@/services/accounts/accounts.service";
import { useSuspenseQuery } from "@tanstack/react-query";
import { startTransition, useState } from "react";
import { InvestmentsAreaChartAccount } from "@/features/investments/charts/accounts/InvestmentsAreaChartAccount";
import { InvestmentsBarChartAccountProps } from "@/features/investments/charts/accounts/InvestmentsBarChartAccount";
import { InvestmentsYearlyBarChartAccount } from "@/features/investments/charts/accounts/InvestmentsYearlyBarChartAccount";
import { InvestmentsAccountsCards } from "@/features/investments/InvestmentsAccountsCards/InvestmentsAccountsCards";

export const InvestmentsAccounts = () => {
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    null,
  );

  const { data: accounts } = useSuspenseQuery({
    queryKey: ["accounts"],
    queryFn: getAccountsApi,
  });

  const openAccounts = accounts
    .filter(({ isClosed }) => !isClosed)
    .map(({ id, name }) => ({ code: id.toString(), label: name }));

  // Par défaut : le premier compte ouvert (un id en dur pouvait désigner un
  // compte fermé ou supprimé).
  const accountId = selectedAccountId ?? Number(openAccounts[0]?.code);

  if (openAccounts.length === 0) {
    return (
      <p className="rounded-xl border bg-card p-6 text-center text-sm text-muted-foreground">
        Aucun compte ouvert.
      </p>
    );
  }

  return (
    <MainContainer columns={3}>
      <PageToolbar>
        <ToolbarField label="Compte" htmlFor="account">
          <CustomSelect
            id="account"
            variant="pill"
            value={accountId.toString()}
            // Transition : garde la page affichée pendant le chargement du compte.
            onValueChange={(value) =>
              startTransition(() => setSelectedAccountId(Number(value)))
            }
            options={openAccounts}
          />
        </ToolbarField>
      </PageToolbar>

      <div className="col-span-3">
        <InvestmentsAccountsCards type="totalAmount" accountId={accountId} />
      </div>

      <div className="col-span-3">
        <InvestmentsAreaChartAccount
          type="totalAmount"
          accountId={accountId}
          chartType="sum"
          title="Total"
        />
      </div>

      <div className="col-span-3 flex flex-col lg:grid lg:grid-cols-2 gap-3 lg:gap-4 xl:gap-8">
        <InvestmentsYearlyBarChartAccount
          accountId={accountId}
          title="Performances par années"
          unit="per"
          chartType="perf"
        />
        <InvestmentsYearlyBarChartAccount
          accountId={accountId}
          title="Plus values par années"
          chartType="sum"
        />
      </div>

      <InvestmentsAreaChartAccount
        type="totalAmount"
        accountId={accountId}
        chartType="cumulPerf"
        title="Cumul des performances"
        unit="per"
        tone="auto"
      />

      <InvestmentsBarChartAccountProps
        type="capitalGain"
        accountId={accountId}
        title="Variation des plus values"
        chartType="diff"
      />

      <InvestmentsBarChartAccountProps
        type="totalAmount"
        accountId={accountId}
        title="Variations totales"
        chartType="diff"
      />

      <InvestmentsBarChartAccountProps
        type="totalAmount"
        accountId={accountId}
        title="Performances"
        chartType="perf"
        unit="per"
      />

      <InvestmentsAreaChartAccount
        type="totalAmount"
        accountId={accountId}
        title="Cumul des plus values"
        chartType="capGain"
        tone="auto"
      />

      <InvestmentsAreaChartAccount
        type="capitalGain"
        accountId={accountId}
        title="Moyenne"
        chartType="avg"
      />
    </MainContainer>
  );
};
