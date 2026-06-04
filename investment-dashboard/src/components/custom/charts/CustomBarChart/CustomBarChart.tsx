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
import { useIsMobile } from "@/hooks/useIsMobile";
import { BarLabel } from "./BarLabel";

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
  const isMobile = useIsMobile();

  const isVertical = barLayout === "vertical";

  const typeXAxis = isVertical ? "number" : "category";
  const typeYAxis = isVertical ? "category" : "number";
  const dataKeyYAxis = isVertical ? "yAxis" : undefined;
  const dataKeyBar = isVertical ? "xAxis" : "yAxis";

  const tickFormatterYAxis = isVertical
    ? undefined
    : getTickFormatterYAxis(unit, isMobile);

  const getBarColor = (value: number) => {
    return value < 0 ? "var(--destructive)" : "var(--chart-2)";
  };

  const width = isMobile && isVertical ? 70 : !isMobile && isVertical ? 60 : 50;

  return (
    <ChartContainer config={chartConfig} className="h-70 w-full">
      <BarChart
        accessibilityLayer
        data={chartData}
        layout={barLayout}
        margin={{
          left: isMobile ? 0 : isVertical ? 40 : 12,
          right: isMobile ? 0 : 12,
        }}
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
          width={width}
        />
        <Bar dataKey={dataKeyBar} radius={4}>
          {chartData.map((entry, index) => {
            const value = (entry as CustomBarChartAxis)[dataKeyBar];

            return (
              <Cell key={`cell-${index}`} fill={getBarColor(Number(value))} />
            );
          })}
          {displayLabels && <LabelList content={<BarLabel unit={unit} />} />}
        </Bar>
        <Tooltip content={<CustomTooltip unit={unit} />} />
      </BarChart>
    </ChartContainer>
  );
}
