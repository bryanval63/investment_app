import { MainContainer } from "@/components/custom/containers/MainContainer";
import { CustomSelect } from "@/components/custom/fields/CustomSelect/CustomSelect";
import { getAccountsApi } from "@/services/accounts/accounts.service";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { InvestmentsAreaChartAccount } from "@/features/investments/charts/accounts/InvestmentsAreaChartAccount";
import { InvestmentsBarChartAccountProps } from "@/features/investments/charts/accounts/InvestmentsBarChartAccount";
import { InvestmentsYearlyBarChartAccount } from "@/features/investments/charts/accounts/InvestmentsYearlyBarChartAccount";
import { InvestmentsAccountsCards } from "@/features/investments/InvestmentsAccountsCards/InvestmentsAccountsCards";

const BOURSO_CODE = "10";
const HSBC_CODE = "11";

export const InvestmentsAccounts = () => {
  const [accountId, setAccountId] = useState<number>(1);

  const { data: accounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: getAccountsApi,
  });

  const mappedAccounts =
    accounts?.map(({ id, name }) => ({
      code: id.toString(),
      label: name,
    })) || [];

  return (
    <MainContainer columns={3}>
      <div className="col-span-3 justify-center flex items-center gap-4">
        <CustomSelect
          value={accountId.toString()}
          onValueChange={(accountId) => setAccountId(Number(accountId))}
          options={mappedAccounts.filter(
            (acc) => acc.code !== BOURSO_CODE && acc.code !== HSBC_CODE,
          )}
        />
      </div>

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

      <div className="col-span-3 grid grid-cols-2 gap-8">
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
