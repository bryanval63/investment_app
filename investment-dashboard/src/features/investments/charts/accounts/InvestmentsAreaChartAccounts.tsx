import { CardContainer } from "@/components/custom/containers/CardContainer";
import {
  axisProps,
  CHART_COLORS,
  getSeriesColor,
  gridProps,
  zeroLineProps,
} from "@/components/custom/charts/chart-theme";
import { crossesZero } from "@/components/custom/charts/custom-chart.utils";
import { ChartTooltipCard } from "@/components/custom/charts/CustomTooltip/ChartTooltipCard";
import { SegmentedControl } from "@/components/custom/fields/SegmentedControl/SegmentedControl";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { getAccountsApi } from "@/services/accounts/accounts.service";
import { getInvestmentsTotalGroupedByAccountMonthlyApi } from "@/services/investments/investments-total.service";
import { formatToPercentage, formatToReadableDate } from "@/utils/format.utils";
import {
  getStartOfCurrentYear,
  type InvestmentCategory,
  type InvestmentTotalByMonthGroupByAccountResponseDto,
} from "@investments/shared";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipProps } from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { useState } from "react";

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
  { code: "yearToDate", label: "Cette année" },
  { code: "allTime", label: "Depuis toujours" },
] as const;

const AccountPerformanceTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (!active || !payload?.length) return null;

  return (
    <ChartTooltipCard
      title={label !== undefined ? String(label) : undefined}
      items={[...payload]
        .sort((first, second) => Number(second.value) - Number(first.value))
        .map((item) => ({
          key: String(item.dataKey),
          name: String(item.name),
          color: item.color,
          formatted: formatToPercentage(Number(item.value)),
          signedValue: Number(item.value),
        }))}
    />
  );
};

/** Dernière valeur connue de chaque série. */
const getLastValues = (chartData: ChartData[], series: AccountSeries[]) =>
  new Map(
    series.map((account) => {
      const last = [...chartData]
        .reverse()
        .find((data) => typeof data[account.dataKey] === "number");
      return [account.dataKey, last?.[account.dataKey] as number | undefined];
    }),
  );

const valueClass = (value: number) =>
  value > 0 ? "text-emerald-600" : value < 0 ? "text-red-500" : "text-slate-500";

const getChartData = (
  investments: InvestmentTotalByMonthGroupByAccountResponseDto[] | undefined,
  series: AccountSeries[],
  period: PerformancePeriod,
) => {
  const seriesById = new Map(series.map((account) => [account.id, account]));
  const dataByDate = new Map<number, ChartData>();
  const periodStart = getStartOfCurrentYear();
  const initialPerformanceByAccount = new Map<
    number,
    { value: number; date: number }
  >();
  const accountInvestments = investments?.filter((investment) =>
    seriesById.has(investment.accountId),
  ) ?? [];
  const periodInvestments = accountInvestments.filter((investment) => {
    const timestamp = new Date(investment.date).getTime();

    return period === "allTime" || timestamp >= periodStart;
  });

  if (period === "yearToDate") {
    accountInvestments
      .filter((investment) => new Date(investment.date).getTime() < periodStart)
      .forEach((investment) => {
        const currentBaseline = initialPerformanceByAccount.get(
          investment.accountId,
        );
        const investmentDate = new Date(investment.date).getTime();
        const currentBaselineDate =
          currentBaseline?.date ?? Number.NEGATIVE_INFINITY;

        if (investmentDate > currentBaselineDate) {
          initialPerformanceByAccount.set(
            investment.accountId,
            { value: investment.cumulativePerformance, date: investmentDate },
          );
        }
      });
  } else {
    periodInvestments.forEach((investment) => {
      if (!initialPerformanceByAccount.has(investment.accountId)) {
        initialPerformanceByAccount.set(
          investment.accountId,
          {
            value: investment.cumulativePerformance,
            date: new Date(investment.date).getTime(),
          },
        );
      }
    });
  }

  if (period === "yearToDate") {
    series.forEach((account) => {
      if (!initialPerformanceByAccount.has(account.id)) {
        initialPerformanceByAccount.set(account.id, { value: 0, date: 0 });
      }
    });
  }

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
            (1 + initialPerformance.value) -
          1;
    dataByDate.set(timestamp, data);
  });

  return [...dataByDate.entries()]
    .sort(([firstDate], [secondDate]) => firstDate - secondDate)
    .map(([, data]) => data);
};

type InvestmentsAreaChartAccountsProps = {
  category: InvestmentCategory;
};

export const InvestmentsAreaChartAccounts = ({
  category,
}: InvestmentsAreaChartAccountsProps) => {
  const [period, setPeriod] = useState<PerformancePeriod>("allTime");
  const [excludedAccountIds, setExcludedAccountIds] = useState<number[]>([]);
  const [highlightedKey, setHighlightedKey] = useState<string | null>(null);
  const { data: accounts } = useSuspenseQuery({
    queryKey: ["accounts"],
    queryFn: getAccountsApi,
  });
  const { data: investments } = useSuspenseQuery({
    queryKey: ["investmentsTotalGroupedByAccountMonthly", "totalAmount"],
    queryFn: () => getInvestmentsTotalGroupedByAccountMonthlyApi("totalAmount"),
  });

  const activeAccounts =
    accounts?.filter(
      (account) =>
        !account.isClosed &&
        (category === "ALL" || account.category === category),
    ) ?? [];

  // Toutes les séries sont calculées (couleurs stables, valeurs des pastilles),
  // seules les séries non exclues sont tracées.
  const allSeries = activeAccounts.map<AccountSeries>((account, index) => ({
    id: account.id,
    name: account.name,
    dataKey: `account_${account.id}`,
    color: getSeriesColor(index),
  }));
  const visibleSeries = allSeries.filter(
    (account) => !excludedAccountIds.includes(account.id),
  );
  const chartConfig = visibleSeries.reduce<ChartConfig>(
    (config, account) => ({
      ...config,
      [account.dataKey]: { label: account.name, color: account.color },
    }),
    {},
  );

  const chartData = getChartData(investments, allSeries, period);
  const lastValues = getLastValues(chartData, allSeries);
  const visibleValues = chartData.flatMap((data) =>
    visibleSeries.map((account) => data[account.dataKey] as number | undefined),
  );

  const toggleAccount = (accountId: number) => {
    setHighlightedKey(null);
    setExcludedAccountIds((current) =>
      current.includes(accountId)
        ? current.filter((id) => id !== accountId)
        : [...current, accountId],
    );
  };

  return (
    <CardContainer
      title="Cumul des performances par comptes"
      description="Cliquez sur un compte pour l'afficher ou le masquer"
      action={
        <SegmentedControl
          ariaLabel="Période"
          value={period}
          onValueChange={setPeriod}
          options={PERFORMANCE_PERIODS}
        />
      }
    >
      <div className="flex flex-col gap-4">
        <ChartContainer config={chartConfig} className="h-80 w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 0, right: 12, top: 12 }}
          >
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="xAxis" {...axisProps} minTickGap={24} />
            <YAxis
              {...axisProps}
              tickCount={5}
              tickFormatter={(value: number) =>
                formatToPercentage(value, { minimumFractionDigits: 0 })
              }
              width={48}
            />
            {crossesZero(visibleValues) && (
              <ReferenceLine {...zeroLineProps} />
            )}
            <Tooltip
              cursor={{ stroke: CHART_COLORS.tick, strokeDasharray: "4 4" }}
              content={<AccountPerformanceTooltip />}
            />
            {visibleSeries.map((account) => {
              const isDimmed =
                highlightedKey !== null && highlightedKey !== account.dataKey;

              return (
                <Line
                  key={account.dataKey}
                  dataKey={account.dataKey}
                  name={account.name}
                  type="monotone"
                  stroke={`var(--color-${account.dataKey})`}
                  strokeWidth={highlightedKey === account.dataKey ? 3 : 2}
                  strokeOpacity={isDimmed ? 0.15 : 1}
                  dot={false}
                  activeDot={
                    isDimmed ? false : { r: 4, strokeWidth: 2, stroke: "#fff" }
                  }
                  connectNulls
                  isAnimationActive={false}
                />
              );
            })}
          </LineChart>
        </ChartContainer>

        <ul className="flex flex-wrap gap-2" aria-label="Comptes affichés">
          {allSeries.map((account) => {
            const isVisible = !excludedAccountIds.includes(account.id);
            const lastValue = lastValues.get(account.dataKey);
            const highlight = () =>
              isVisible && setHighlightedKey(account.dataKey);

            return (
              <li key={account.dataKey}>
                <button
                  type="button"
                  aria-pressed={isVisible}
                  onClick={() => toggleAccount(account.id)}
                  onMouseEnter={highlight}
                  onMouseLeave={() => setHighlightedKey(null)}
                  onFocus={highlight}
                  onBlur={() => setHighlightedKey(null)}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-all",
                    isVisible
                      ? "border-slate-200 bg-white text-slate-700 shadow-xs hover:border-slate-300"
                      : "border-dashed border-slate-200 bg-transparent text-slate-400 hover:text-slate-600",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="size-2.5 shrink-0 rounded-full transition-opacity"
                    style={{
                      backgroundColor: account.color,
                      opacity: isVisible ? 1 : 0.3,
                    }}
                  />
                  <span>{account.name}</span>
                  {lastValue !== undefined && (
                    <span
                      className={cn(
                        "tabular-nums",
                        isVisible && valueClass(lastValue),
                      )}
                    >
                      {formatToPercentage(lastValue, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 1,
                      })}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </CardContainer>
  );
};
