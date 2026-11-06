import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";

export type SparklinePoint = {
  xAxis: string;
  yAxis: number | undefined;
};

type SparklineProps = {
  chartData: SparklinePoint[];
  positive: boolean;
};

/** Mini-courbe d'évolution (sans axes ni grille). */
export const Sparkline = ({ chartData, positive }: SparklineProps) => {
  if (chartData.length < 2) return null;

  // Teintes claires (emerald-400 / red-400) : la courbe est posée sur le bandeau sombre.
  const color = positive ? "#34d399" : "#f87171";
  const gradientId = `sparkline-${positive ? "up" : "down"}`;

  return (
    <div className="h-20 lg:h-28 w-full" aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis hide domain={["dataMin", "dataMax"]} />
          <Area
            dataKey="yAxis"
            type="monotone"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
