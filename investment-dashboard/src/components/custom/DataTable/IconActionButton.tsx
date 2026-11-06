import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { ComponentProps } from "react";

type IconActionButtonProps = {
  icon: LucideIcon;
  label: string;
  tone?: "default" | "danger" | "primary";
} & Omit<ComponentProps<typeof Button>, "children" | "variant" | "size">;

const TONE_STYLES = {
  default: "text-muted-foreground hover:text-foreground",
  primary:
    "text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 dark:text-indigo-400 dark:hover:bg-indigo-500/10",
  danger:
    "text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-500/10",
};

// Action de ligne : bouton icône discret avec libellé accessible et infobulle.
export function IconActionButton({
  icon: Icon,
  label,
  tone = "default",
  className,
  ...props
}: IconActionButtonProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={label}
            className={cn("size-8", TONE_STYLES[tone], className)}
            {...props}
          >
            <Icon className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={4}>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
