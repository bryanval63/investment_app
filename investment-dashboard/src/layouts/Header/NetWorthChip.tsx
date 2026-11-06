import { cn } from "@/lib/utils";
import { getNetWorthesApi } from "@/services/net-worthes/net-worthes.service";
import { formatToEuro, formatToPercentage } from "@/utils/format.utils";
import { getColorAndBgColor } from "@/utils/style.utils";
import {
  findLastItemByDate,
  findSecondLastItemByDate,
} from "@investments/shared";
import { useQuery } from "@tanstack/react-query";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

/** Patrimoine total + variation du mois, affiché dans le header. */
export const NetWorthChip = () => {
  // Même queryKey que la page Capital : données partagées en cache.
  // Pas de suspense : le header ne doit jamais bloquer l'affichage.
  const { data: netWorthes } = useQuery({
    queryKey: ["net-worthes"],
    queryFn: () => getNetWorthesApi(),
  });

  if (!netWorthes?.length) return null;

  const last = findLastItemByDate(netWorthes)?.amount ?? 0;
  const previous =
    netWorthes.length >= 2
      ? (findSecondLastItemByDate(netWorthes)?.amount ?? 0)
      : 0;
  const performance = previous !== 0 ? (last - previous) / previous : 0;
  const TrendIcon =
    performance > 0 ? TrendingUp : performance < 0 ? TrendingDown : Minus;

  return (
    <Link
      to="/net-worth"
      title="Patrimoine financier total"
      className="hidden md:flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm transition-shadow hover:shadow-md"
    >
      <span className="font-semibold tabular-nums text-slate-900">
        {formatToEuro(last, { maximumFractionDigits: 0 })}
      </span>
      <span
        className={cn(
          "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums",
          getColorAndBgColor(performance),
        )}
      >
        <TrendIcon className="size-3" />
        {formatToPercentage(performance)}
      </span>
    </Link>
  );
};
