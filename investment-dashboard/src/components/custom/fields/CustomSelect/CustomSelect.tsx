import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Option<T extends string = string> = {
  readonly code: T;
  readonly label: string;
};

type ExtractValue<T extends readonly Option[]> = T[number]["code"];

type CustomSelectProps<T extends readonly Option[]> = {
  value: ExtractValue<T>;
  options: T;
  onValueChange: (value: ExtractValue<T>) => void;
  id?: string;
  /** `pill` : style des barres de filtres (arrondi, compact). */
  variant?: "default" | "pill";
};

export function CustomSelect<T extends readonly Option[]>({
  value,
  options,
  onValueChange,
  id,
  variant = "default",
}: CustomSelectProps<T>) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        id={id}
        size={variant === "pill" ? "sm" : "default"}
        className={cn(
          variant === "pill" &&
            "rounded-full border-slate-200 bg-white px-3.5 font-medium text-slate-900 hover:border-slate-300",
        )}
      >
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        {options.map(({ code, label }) => (
          <SelectItem key={code} value={code}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
