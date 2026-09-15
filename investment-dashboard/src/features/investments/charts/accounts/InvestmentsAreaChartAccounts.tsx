import { CardContainer } from "@/components/custom/containers/CardContainer";
import { ChartContainer, type ChartConfig, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { CustomCheckbox } from "@/components/custom/fields/CustomCheckbox/CustomCheckbox";
import { CustomSelect } from "@/components/custom/fields/CustomSelect/CustomSelect";
import { getAccountsApi } from "@/services/accounts/accounts.service";
import { getInvestmentsTotalGroupedByAccountMonthlyApi } from "@/services/investments/investments-total.service";
import { formatToPercentage, formatToReadableDate } from "@/utils/format.utils";
import type { InvestmentTotalByMonthGroupByAccountResponseDto } from "@investments/shared";
import { useQuery } from "@tanstack/react-query";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import type { TooltipProps } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { useState } from "react";

const ACCOUNT_COLORS = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#9333ea",
  "#ea580c",
  "#0891b2",
  "#ca8a04",
  "#db2777",
];

type AccountSeries = {
  id: number;
  name: string;
  dataKey: string;
  color: string;
};

type ChartData = {
  xAxis: string;
  [dataKey: string]: string | number;
};

type PerformancePeriod = "yearToDate" | "allTime";

const PERFORMANCE_PERIODS = [
  { code: "yearToDate", label: "Depuis le début de l'année" },
  { code: "allTime", label: "Depuis toujours" },
] as const;

const AccountPerformanceTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="border rounded-md bg-background/80 backdrop-blur px-3 py-2 shadow-sm">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="flex flex-col gap-1">
        {[...payload]
          .sort((first, second) => Number(second.value) - Number(first.value))
          .map((item) => (
          <div className="flex items-center gap-2" key={item.dataKey?.toString()}>
            <div
              className="h-2 w-2 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <p className="text-sm font-medium text-foreground">
              {item.name}: {formatToPercentage(Number(item.value))}
            </p>
          </div>
          ))}
      </div>
    </div>
  );
};

const getChartData = (
  investments: InvestmentTotalByMonthGroupByAccountResponseDto[] | undefined,
  series: AccountSeries[],
  period: PerformancePeriod,
) => {
  const seriesById = new Map(series.map((account) => [account.id, account]));
  const dataByDate = new Map<number, ChartData>();
  const periodStart = new Date(new Date().getFullYear(), 0, 1).getTime();
  const initialPerformanceByAccount = new Map<number, number>();
  const periodInvestments =
    investments?.filter((investment) => {
      const timestamp = new Date(investment.date).getTime();

      return (
        seriesById.has(investment.accountId) &&
        (period === "allTime" || timestamp >= periodStart)
      );
    }) ?? [];

  periodInvestments.forEach((investment) => {
    if (!initialPerformanceByAccount.has(investment.accountId)) {
      initialPerformanceByAccount.set(
        investment.accountId,
        investment.cumulativePerformance,
      );
    }
  });

  periodInvestments.forEach((investment) => {
    const timestamp = new Date(investment.date).getTime();
    const account = seriesById.get(investment.accountId);
    const initialPerformance = initialPerformanceByAccount.get(
      investment.accountId,
    );

    if (!account || initialPerformance === undefined) return;

    const data = dataByDate.get(timestamp) ?? {
      xAxis: formatToReadableDate(new Date(investment.date), {
        year: "numeric",
        month: "short",
      }),
    };
    data[account.dataKey] =
      period === "allTime"
        ? investment.cumulativePerformance
        : (1 + investment.cumulativePerformance) /
            (1 + initialPerformance) -
          1;
    dataByDate.set(timestamp, data);
  });

  return [...dataByDate.entries()]
    .sort(([firstDate], [secondDate]) => firstDate - secondDate)
    .map(([, data]) => data);
};

export const InvestmentsAreaChartAccounts = () => {
  const [period, setPeriod] = useState<PerformancePeriod>("allTime");
  const [excludedAccountIds, setExcludedAccountIds] = useState<number[]>([]);
  const { data: accounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: getAccountsApi,
  });
  const { data: investments } = useQuery({
    queryKey: ["investmentsTotalGroupedByAccountMonthly", "totalAmount"],
    queryFn: () => getInvestmentsTotalGroupedByAccountMonthlyApi("totalAmount"),
  });

  const activeAccounts = accounts?.filter((account) => !account.isClosed) ?? [];
  const series = activeAccounts
    .filter((account) => !excludedAccountIds.includes(account.id))
    .map<AccountSeries>((account) => ({
      id: account.id,
      name: account.name,
      dataKey: `account_${account.id}`,
      color:
        ACCOUNT_COLORS[
          activeAccounts.findIndex(
            (activeAccount) => activeAccount.id === account.id,
          ) % ACCOUNT_COLORS.length
        ],
    }));
  const chartConfig = series.reduce<ChartConfig>(
    (config, account) => ({
      ...config,
      [account.dataKey]: { label: account.name, color: account.color },
    }),
    {},
  );

  const chartData = getChartData(investments, series, period);
  const toggleAccount = (accountId: number, checked: boolean) => {
    const nextIds = checked
      ? excludedAccountIds.filter((id) => id !== accountId)
      : [...excludedAccountIds, accountId];

    setExcludedAccountIds(nextIds);
  };

  return (
    <CardContainer title="Cumul des performances par comptes">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <CustomSelect
            value={period}
            onValueChange={(value) => setPeriod(value as PerformancePeriod)}
            options={PERFORMANCE_PERIODS}
          />
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {activeAccounts.map((account) => (
              <CustomCheckbox
                key={account.id}
                id={`performance-account-${account.id}`}
                label={account.name}
                checked={!excludedAccountIds.includes(account.id)}
                setChecked={(checked) => toggleAccount(account.id, checked)}
              />
            ))}
          </div>
        </div>
        <ChartContainer config={chartConfig} className="h-70 w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12, top: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="xAxis" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis
              tickLine={false}
              tickCount={6}
              axisLine={false}
              tickFormatter={(value: number) =>
                formatToPercentage(value, { minimumFractionDigits: 0 })
              }
              width={45}
            />
            <Tooltip content={<AccountPerformanceTooltip />} />
            <ChartLegend content={<ChartLegendContent />} />
            {series.map((account) => (
              <Line
                key={account.dataKey}
                dataKey={account.dataKey}
                name={account.name}
                type="monotone"
                stroke={`var(--color-${account.dataKey})`}
                strokeWidth={2}
                dot={false}
                connectNulls
              />
            ))}
          </LineChart>
        </ChartContainer>
      </div>
    </CardContainer>
  );
};
