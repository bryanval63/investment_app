import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { useId } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CustomTooltip } from "../CustomTooltip/CustomTooltip";
import type { CustomChartUnit } from "../custom-chart.type";
import { crossesZero, getTickFormatterYAxis } from "../custom-chart.utils";
import {
  axisProps,
  CHART_COLORS,
  getValueColor,
  gridProps,
  zeroLineProps,
} from "../chart-theme";
import { useIsMobile } from "@/hooks/useIsMobile";

type CustomAreaChartProps<T> = {
  chartData: T[];
  unit?: CustomChartUnit;
  /**
   * `accent` : couleur de l'application.
   * `auto` : vert ou rouge selon le signe de la dernière valeur
   * (performances, plus-values).
   */
  tone?: "accent" | "auto";
};

const chartConfig = {} satisfies ChartConfig;

export function CustomAreaChart<T>({
  chartData,
  unit = "eur",
  tone = "accent",
}: CustomAreaChartProps<T>) {
  const isMobile = useIsMobile();
  const gradientId = `area-${useId().replace(/:/g, "")}`;

  const values = chartData.map(
    (point) => (point as { yAxis?: number }).yAxis,
  );
  const lastValue = [...values].reverse().find(Number.isFinite) ?? 0;
  const color =
    tone === "auto" ? getValueColor(lastValue) : CHART_COLORS.accent;

  return (
    <ChartContainer config={chartConfig} className="h-70 w-full">
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{ left: 0, right: isMobile ? 4 : 12, top: 12 }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.28} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="xAxis" {...axisProps} minTickGap={24} />
        <YAxis
          {...axisProps}
          tickCount={5}
          tickFormatter={getTickFormatterYAxis(unit)}
          width={52}
        />
        {crossesZero(values) && <ReferenceLine {...zeroLineProps} />}
        <Area
          dataKey="yAxis"
          type="monotone"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff", fill: color }}
        />
        <Tooltip
          cursor={{ stroke: CHART_COLORS.tick, strokeDasharray: "4 4" }}
          content={<CustomTooltip unit={unit} signed={tone === "auto"} />}
        />
      </AreaChart>
    </ChartContainer>
  );
}
