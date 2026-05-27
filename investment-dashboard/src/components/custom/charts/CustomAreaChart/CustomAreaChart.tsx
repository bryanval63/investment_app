import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CustomTooltip } from "../CustomTooltip/CustomTooltip";
import type { CustomChartUnit } from "../custom-chart.type";
import { getTickFormatterYAxis } from "../custom-chart.utils";

type CustomAreaChartProps<T> = {
  chartData: T[];
  unit?: CustomChartUnit;
};

const chartConfig = {} satisfies ChartConfig;

export function CustomAreaChart<T>({
  chartData,
  unit = "eur",
}: CustomAreaChartProps<T>) {
  return (
    <ChartContainer config={chartConfig} className="h-70 w-full">
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{ left: 12, right: 12, top: 12 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="xAxis"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          tickLine={false}
          tickCount={6}
          axisLine={false}
          tickFormatter={getTickFormatterYAxis(unit)}
        />
        <Area dataKey="yAxis" type="natural" fillOpacity={0.4} stackId="a" />
        <Tooltip content={<CustomTooltip unit={unit} />} />
      </AreaChart>
    </ChartContainer>
  );
}
