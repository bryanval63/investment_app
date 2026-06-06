import { Card } from "@/components/ui/card";
import { formatToEuro, formatToPercentage } from "@/utils/format.utils";
import { getColorAndBgColor } from "@/utils/style.utils";
import { Separator } from "@/components/ui/separator";
import { StatValue } from "../StatsValue/StatsValue";

type SummaryCardProps = {
  title: string;
  totalAmount: number;
  totalCapitalGain: number;
  totalPerf: number;
  img: string;
  cardStyle?: string;
};

export const SummaryCard = ({
  title,
  totalAmount,
  totalCapitalGain,
  totalPerf,
  img,
  cardStyle,
}: SummaryCardProps) => {
  const formattedTotalAmount = formatToEuro(totalAmount);
  const formattedTotalCapitalGain = formatToEuro(totalCapitalGain, {
    signDisplay: "always",
  });
  const formattedTotalPerf = formatToPercentage(totalPerf);

  return (
    <Card className={`${cardStyle || "px-2 lg:px-16"}`}>
      <div className="flex items-center">
        <img
          className="hidden lg:block"
          src={img}
          alt="chart"
          width="250"
          height="250"
        />

        <div className="flex flex-col gap-4 p-6 w-full">
          <span className="text-md text-slate-500">{title}</span>

          <Separator />

          <div className="text-4xl font-semibold text-slate-900">
            {formattedTotalAmount}
          </div>

          <div className="flex items-center gap-3 lg:gap-8 flex-wrap">
            <span
              className={`text-xl font-normal text-white py-1 px-2 rounded-2xl ${getColorAndBgColor(totalCapitalGain, true, true)}`}
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

