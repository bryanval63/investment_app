import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useController, useFormContext } from "react-hook-form";

type FormInputProps = {
  name: string;
  label: string;
} & React.ComponentProps<"input">;

export function FormInput({ name, label, ...props }: FormInputProps) {
  const { control } = useFormContext();

  const { field, fieldState } = useController({
    name,
    control,
  });

  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Input {...field} {...props} aria-invalid={fieldState.invalid} />
      {fieldState.invalid && (
        <FieldError errors={[fieldState.error]} className="min-h-9" />
      )}
    </Field>
  );
}
