import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { CardContainer } from "@/components/custom/containers/CardContainer";
import { getInvestmentCategoriesRefApi } from "@/services/investments/investment-categories-ref.service";
import { getInvestmentsTotalGroupedByCategoryMonthlyApi } from "@/services/investments/investments-total.service";
import { formatToEuro, formatToPercentage } from "@/utils/format.utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Cell, Pie, PieChart, Tooltip } from "recharts";

const chartConfig = {} satisfies ChartConfig;

export const InvestmentAllocationChart = () => {
  const { data: investmentsByCategory } = useSuspenseQuery({
    queryKey: ["investmentsTotalGroupedByCategory", "totalAmount"],
    queryFn: () => getInvestmentsTotalGroupedByCategoryMonthlyApi("totalAmount"),
  });
  const { data: categories } = useSuspenseQuery({
    queryKey: ["investment-categories-ref"],
    queryFn: getInvestmentCategoriesRefApi,
  });

  const latestAmountByCategory = new Map<
    string,
    { amount: number; date: number }
  >();

  investmentsByCategory
    ?.filter(({ category }) => category !== "ALL")
    .forEach(({ category, amount, date }) => {
      const dateValue = new Date(date).getTime();
      const current = latestAmountByCategory.get(category);

      if (!current || dateValue > current.date) {
        latestAmountByCategory.set(category, { amount, date: dateValue });
      }
    });

  const chartData = [...latestAmountByCategory.entries()]
    .filter(([, { amount }]) => amount > 0)
    .map(([code, { amount }], index) => ({
      code,
      label: categories?.find((category) => category.code === code)?.label ?? code,
      amount,
      color: `var(--chart-${(index % 5) + 1})`,
    }));
  const totalAmount = chartData.reduce((total, category) => total + category.amount, 0);

  return (
    <CardContainer title="Répartition des investissements par catégorie">
      <div>
        {chartData.length === 0 ? (
          <p className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            Aucune donnée d’investissement par catégorie.
          </p>
        ) : (
          <div className="grid items-center gap-4 sm:grid-cols-2">
            <div className="relative h-64 min-w-0">
              <ChartContainer
                config={chartConfig}
                className="relative z-10 h-full w-full aspect-auto"
              >
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="amount"
                    nameKey="label"
                    innerRadius="58%"
                    outerRadius="82%"
                    paddingAngle={2}
                    stroke="none"
                  >
                    {chartData.map((category) => (
                      <Cell key={category.code} fill={category.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const { name, value, payload: item } = payload[0];

                      return (
                        <div className="border rounded-md bg-background/80 backdrop-blur px-3 py-2 shadow-sm">
                          <p className="text-xs text-muted-foreground mb-1">
                            {name}
                          </p>
                          <div className="flex items-center gap-2">
                            <div
                              className="h-2 w-2 rounded-sm"
                              style={{ backgroundColor: item?.color }}
                            />
                            <p className="text-sm font-medium text-foreground">
                              {formatToEuro(Number(value))} (
                              {formatToPercentage(Number(value) / totalAmount)})
                            </p>
                          </div>
                        </div>
                      );
                    }}
                  />
                </PieChart>
              </ChartContainer>
              <div className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center">
                <span className="text-xs text-muted-foreground">Total</span>
                <span className="text-sm font-semibold">
                  {formatToEuro(totalAmount, { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
            <ul className="flex flex-col gap-3">
              {chartData.map((category) => (
                <li
                  key={category.code}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="truncate">{category.label}</span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="font-medium">
                      {formatToPercentage(category.amount / totalAmount)}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {formatToEuro(category.amount, { maximumFractionDigits: 0 })}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </CardContainer>
  );
};
