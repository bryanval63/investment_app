import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type SectionCardProps = {
  icon: LucideIcon;
  title: string;
  /** Texte d'aide affiché sous l'en-tête. */
  description?: string;
  /** Élément affiché à droite de l'en-tête (ex. bouton). */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

// Gabarit de section : même en-tête que les tuiles KPI (icône dans un carré + libellé uppercase).
export const SectionCard = ({
  icon: Icon,
  title,
  description,
  action,
  children,
  className,
  contentClassName,
}: SectionCardProps) => {
  return (
    <Card
      className={cn(
        "min-w-0 gap-4 lg:gap-5 border px-4 py-4 lg:px-5 lg:py-5",
        className,
      )}
    >
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <Icon className="size-4" />
            </span>
            <h2 className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground leading-tight">
              {title}
            </h2>
          </div>
          {action}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className={cn("flex flex-col gap-4", contentClassName)}>
        {children}
      </div>
    </Card>
  );
};
