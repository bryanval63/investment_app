import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option<T extends string = string> = {
  readonly code: T;
  readonly label: string;
};

type ExtractValue<T extends readonly Option[]> = T[number]["code"];

type CustomSelectProps<T extends readonly Option[]> = {
  value: ExtractValue<T>;
  options: T;
  onValueChange: (value: ExtractValue<T>) => void;
};

export function CustomSelect<T extends readonly Option[]>({
  value,
  options,
  onValueChange,
}: CustomSelectProps<T>) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
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
