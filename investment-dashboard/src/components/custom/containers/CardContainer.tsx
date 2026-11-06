import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ReactElement, ReactNode } from "react";

type CardContainerProps = {
  cardStyle?: string;
  title: string;
  /** Sous-titre discret sous le titre. */
  description?: string;
  /** Élément affiché à droite du titre (période, pagination…). */
  action?: ReactNode;
  children: ReactElement;
};

/** Carte standard des graphiques et blocs de contenu. */
export const CardContainer = ({
  children,
  title,
  description,
  action,
  cardStyle = "w-full",
}: CardContainerProps) => {
  return (
    <Card
      className={cn(
        "min-w-0 gap-4 lg:gap-5 transition-shadow duration-300 hover:shadow-md",
        cardStyle,
      )}
    >
      <CardHeader className="flex flex-wrap items-start justify-between gap-3 px-4 lg:px-6">
        <div className="flex min-w-0 flex-col gap-1">
          <CardTitle className="text-sm lg:text-base font-semibold text-slate-900">
            {title}
          </CardTitle>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
      </CardHeader>
      <CardContent className="px-3 lg:px-6">{children}</CardContent>
    </Card>
  );
};
