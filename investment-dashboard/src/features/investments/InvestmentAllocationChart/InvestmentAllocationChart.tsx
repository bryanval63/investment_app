import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { CardContainer } from "@/components/custom/containers/CardContainer";
import { getInvestmentCategoriesRefApi } from "@/services/investments/investment-categories-ref.service";
import { getInvestmentsTotalGroupedByCategoryMonthlyApi } from "@/services/investments/investments-total.service";
import { formatToEuro, formatToPercentage } from "@/utils/format.utils";
import { useQuery } from "@tanstack/react-query";
import { Cell, Pie, PieChart, Tooltip } from "recharts";

const chartConfig = {} satisfies ChartConfig;

export const InvestmentAllocationChart = () => {
  const { data: investmentsByCategory, isPending: isInvestmentsPending } =
    useQuery({
      queryKey: ["investmentsTotalGroupedByCategory", "totalAmount"],
      queryFn: () => getInvestmentsTotalGroupedByCategoryMonthlyApi("totalAmount"),
    });
  const { data: categories, isPending: areCategoriesPending } = useQuery({
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
        {isInvestmentsPending || areCategoriesPending ? (
          <p className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            Chargement de la répartition...
          </p>
        ) : chartData.length === 0 ? (
          <p className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            Aucune donnée d’investissement par catégorie.
          </p>
        ) : (
          <div className="grid items-center gap-4 sm:grid-cols-2">
            <div className="relative h-64 min-w-0">
              <ChartContainer
                config={chartConfig}
                className="h-full w-full aspect-auto"
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
                    formatter={(value, name) => [
                      `${formatToEuro(Number(value))} (${formatToPercentage(Number(value) / totalAmount)})`,
                      name,
                    ]}
                  />
                </PieChart>
              </ChartContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
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
