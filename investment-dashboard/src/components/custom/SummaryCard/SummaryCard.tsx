import { Card } from "@/components/ui/card";
import { formatToEuro, formatToPercentage } from "@/utils/format.utils";
import { getColorAndBgColor } from "@/utils/style.utils";
import { Separator } from "@/components/ui/separator";
import { StatValue } from "../StatsValue/StatsValue";

type SummaryCardProps = {
  title: string;
  totalAmount: number;
  totalNetAmount: number;
  totalCapitalGain: number;
  totalPerf: number;
  img: string;
  cardStyle?: string;
};

export const SummaryCard = ({
  title,
  totalAmount,
  totalNetAmount,
  totalCapitalGain,
  totalPerf,
  img,
  cardStyle,
}: SummaryCardProps) => {
  const formattedTotalAmount = formatToEuro(totalAmount);
  const formattedTotalNetAmount = formatToEuro(totalNetAmount);
  const formattedTotalCapitalGain = formatToEuro(totalCapitalGain, {
    signDisplay: "always",
  });
  const formattedTotalPerf = formatToPercentage(totalPerf);

  return (
    <Card className={`min-w-0 ${cardStyle || "px-2 xl:px-16"}`}>
      <div className="flex items-center justify-center">
        <img
          className="hidden xl:block shrink-0 w-40 h-40 2xl:w-62.5 2xl:h-62.5"
          src={img}
          alt="chart"
          width="250"
          height="250"
        />

        <div className="flex flex-col gap-4 p-3 sm:p-6 min-w-0">
          <span className="text-md text-muted-foreground">{title}</span>

          <Separator />

          <div className="text-3xl sm:text-4xl font-semibold text-foreground whitespace-nowrap">
            {formattedTotalAmount}
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">
              Montant net estimé après impôts
            </span>
            <span className="text-xl sm:text-2xl font-semibold text-foreground whitespace-nowrap">
              {formattedTotalNetAmount}
            </span>
          </div>

          <div className="flex items-center gap-3 lg:gap-8 flex-wrap">
            <span
              className={`text-lg sm:text-xl font-normal text-white py-1 px-2 rounded-2xl whitespace-nowrap ${getColorAndBgColor(totalCapitalGain, true, true)}`}
            >
              {formattedTotalCapitalGain}
            </span>

            <StatValue
              value={totalPerf}
              formatted={formattedTotalPerf}
              style="text-md"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
