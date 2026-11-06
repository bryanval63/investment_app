import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Rectangle,
  LabelList,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RectangleProps } from "recharts";
import { CustomTooltip } from "../CustomTooltip/CustomTooltip";
import type { CustomBarChartAxis } from "./custom-bar-chart.type";
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
import { BarLabel } from "./BarLabel";

type CustomBarChartProps<T> = {
  chartData: T[];
  tickFormatterXAxis?: (value: string, index: number) => string;
  unit?: CustomChartUnit;
  /** Libellés au bout des barres (masqués automatiquement si trop serrés). */
  displayLabels?: boolean;
  labelFormatter?: (value: number) => string;
  isAnimationActive?: boolean;
};

const chartConfig = {} satisfies ChartConfig;

/** Histogramme vertical, barres vertes (positives) ou rouges (négatives). */
export function CustomBarChart<T>({
  chartData,
  tickFormatterXAxis,
  unit = "eur",
  displayLabels = false,
  labelFormatter,
  isAnimationActive = true,
}: CustomBarChartProps<T>) {
  const isMobile = useIsMobile();
  const values = chartData.map((entry) =>
    Number((entry as CustomBarChartAxis).yAxis),
  );

  return (
    <ChartContainer config={chartConfig} className="h-70 w-full">
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 0,
          right: isMobile ? 4 : 12,
          top: displayLabels ? 20 : 8,
          bottom: displayLabels ? 12 : 0,
        }}
      >
        <CartesianGrid {...gridProps} />
        <XAxis
          dataKey="xAxis"
          {...axisProps}
          tickFormatter={tickFormatterXAxis}
          minTickGap={16}
        />
        <YAxis
          {...axisProps}
          tickCount={5}
          tickFormatter={getTickFormatterYAxis(unit)}
          width={52}
        />
        {/* Avant les barres : Recharts dessine le fond de survol à la position
            du Tooltip, il passerait sinon par-dessus la barre survolée. */}
        <Tooltip
          cursor={{ fill: CHART_COLORS.cursor, radius: 6 }}
          content={<CustomTooltip unit={unit} signed />}
        />
        {crossesZero(values) && <ReferenceLine {...zeroLineProps} />}
        <Bar
          dataKey="yAxis"
          // Arrondi côté extrémité. Recharts passe ici une hauteur négative
          // (y = extrémité) pour les barres négatives : le même rayon
          // arrondit donc le haut des positives et le bas des négatives.
          shape={(props: unknown) => (
            <Rectangle {...(props as RectangleProps)} radius={[6, 6, 0, 0]} />
          )}
          maxBarSize={44}
          isAnimationActive={isAnimationActive}
        >
          {values.map((value, index) => (
            <Cell
              key={`cell-${index}`}
              fill={getValueColor(value)}
              fillOpacity={0.85}
            />
          ))}
          {displayLabels && (
            <LabelList
              dataKey="yAxis"
              content={
                <BarLabel unit={unit} labelFormatter={labelFormatter} />
              }
            />
          )}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
