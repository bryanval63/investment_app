import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LabelList,
} from "recharts";
import { CustomTooltip } from "../CustomTooltip/CustomTooltip";
import type { CustomBarChartAxis } from "./custom-bar-chart.type";
import type { CustomChartUnit } from "../custom-chart.type";
import { getTickFormatterYAxis } from "../custom-chart.utils";
import { formatToEuro, formatToPercentage } from "@/utils/format.utils";

type CustomBarChartProps<T> = {
  chartData: T[];
  barLayout?: "horizontal" | "vertical";
  tickFormatterXAxis?: (value: string, index: number) => string;
  unit?: CustomChartUnit;
  displayLabels?: boolean;
};

const chartConfig = {} satisfies ChartConfig;

export function CustomBarChart<T>({
  chartData,
  barLayout = "horizontal",
  tickFormatterXAxis,
  unit = "eur",
  displayLabels = false,
}: CustomBarChartProps<T>) {
  const isVertical = barLayout === "vertical";

  const typeXAxis = isVertical ? "number" : "category";
  const typeYAxis = isVertical ? "category" : "number";
  const dataKeyYAxis = isVertical ? "yAxis" : undefined;
  const dataKeyBar = isVertical ? "xAxis" : "yAxis";

  const tickFormatterYAxis = isVertical
    ? undefined
    : getTickFormatterYAxis(unit);

  const getBarColor = (value: number) => {
    return value < 0 ? "var(--destructive)" : "var(--chart-2)";
  };

  return (
    <ChartContainer config={chartConfig} className="h-70 w-full">
      <BarChart
        accessibilityLayer
        data={chartData}
        layout={barLayout}
        margin={{ left: isVertical ? 40 : 12, right: 12 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="xAxis"
          tickLine={false}
          tickFormatter={tickFormatterXAxis}
          type={typeXAxis}
          axisLine={false}
        />
        <YAxis
          type={typeYAxis}
          dataKey={dataKeyYAxis}
          tickLine={false}
          tickCount={6}
          axisLine={false}
          tickFormatter={tickFormatterYAxis}
        />
        <Bar dataKey={dataKeyBar} radius={4}>
          {chartData.map((entry, index) => {
            const value = (entry as CustomBarChartAxis)[dataKeyBar];

            return (
              <Cell key={`cell-${index}`} fill={getBarColor(Number(value))} />
            );
          })}
          {displayLabels && (
            <LabelList
              fill={"#fff"}
              dataKey={dataKeyBar}
              position="center"
              formatter={(value: number) =>
                unit === "per" ? formatToPercentage(value) : formatToEuro(value)
              }
            />
          )}
        </Bar>
        <Tooltip content={<CustomTooltip unit={unit} />} />
      </BarChart>
    </ChartContainer>
  );
}
