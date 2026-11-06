import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ReactNode } from "react";
import { useController, useFormContext } from "react-hook-form";

type FormSelectProps = {
  name: string;
  label: string;
  children: ReactNode;
  onSelectChange?: (value: unknown) => void;
};

export const FormSelect = ({
  name,
  label,
  children,
  onSelectChange,
}: FormSelectProps) => {
  const { control } = useFormContext();

  const { field, fieldState } = useController({
    name,
    control,
  });

  const handleSelectChange = (value: unknown) => {
    field.onChange(value);
    onSelectChange?.(value);
  };

  return (
    <Field className="gap-2" data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Select value={field.value} onValueChange={handleSelectChange}>
        <SelectTrigger
          id={name}
          className="w-full"
          aria-invalid={fieldState.invalid}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>

      {fieldState.error && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
};
