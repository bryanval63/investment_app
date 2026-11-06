import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useController, useFormContext } from "react-hook-form";
import { InputWithSuffix } from "./InputWithSuffix";

type FormInputProps = {
  name: string;
  label: string;
  /** Unité affichée à droite dans le champ (%, €, ans…). */
  suffix?: string;
} & React.ComponentProps<"input">;

export function FormInput({ name, label, suffix, ...props }: FormInputProps) {
  const { control } = useFormContext();

  const { field, fieldState } = useController({
    name,
    control,
  });

  return (
    <Field className="gap-2" data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <InputWithSuffix
        id={name}
        suffix={suffix}
        {...field}
        {...props}
        aria-invalid={fieldState.invalid}
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
