import { getColorAndBgColor } from "@/utils/style.utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type StatValueProps = {
  value: number;
  formatted: string;
  style?: string;
};

const getTrendIcon = (value: number) => {
  const baseClass =
    "w-4 h-4 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-0.5";

  if (value > 0) return <TrendingUp className={baseClass} />;
  if (value < 0) return <TrendingDown className={baseClass} />;
  return <Minus className={baseClass} />;
};

export const StatValue = ({ value, formatted, style }: StatValueProps) => {
  const baseColor = getColorAndBgColor(value);

  return (
    <div
      className={`
        group
        flex items-center justify-center gap-2
        px-3 py-1 rounded-lg
        font-semibold

        transition-all duration-300

        ${baseColor}

        hover:shadow-md

        ${style}
      `}
    >
      {getTrendIcon(value)}
      <span>{formatted}</span>
    </div>
  );
};
