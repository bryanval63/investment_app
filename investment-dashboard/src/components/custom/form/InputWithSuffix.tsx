import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type InputWithSuffixProps = {
  /** Unité affichée à droite dans le champ (%, €, ans…). */
  suffix?: string;
} & ComponentProps<typeof Input>;

export const InputWithSuffix = ({
  suffix,
  className,
  ...props
}: InputWithSuffixProps) => {
  if (!suffix) return <Input className={className} {...props} />;

  return (
    <div className="relative">
      <Input className={cn("pr-12 tabular-nums", className)} {...props} />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground"
      >
        {suffix}
      </span>
    </div>
  );
};
