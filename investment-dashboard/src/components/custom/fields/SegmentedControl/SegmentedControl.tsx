import { cn } from "@/lib/utils";

type SegmentedOption<T extends string> = {
  readonly code: T;
  readonly label: string;
};

type SegmentedControlProps<T extends string> = {
  value: T;
  options: readonly SegmentedOption<T>[];
  onValueChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
};

/** Choix exclusif parmi quelques options, en pastilles (même style que la navigation). */
export function SegmentedControl<T extends string>({
  value,
  options,
  onValueChange,
  ariaLabel,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full bg-slate-100/80 p-1",
        className,
      )}
    >
      {options.map((option) => {
        const isActive = option.code === value;

        return (
          <button
            key={option.code}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onValueChange(option.code)}
            className={cn(
              "cursor-pointer rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors",
              isActive
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
