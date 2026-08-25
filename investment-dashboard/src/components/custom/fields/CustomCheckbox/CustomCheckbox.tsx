import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";

type CustomCheckboxProps = {
  label: string;
  checked: boolean;
  setChecked: (value: boolean) => void;
  id?: string;
};

export const CustomCheckbox = ({
  label,
  checked,
  setChecked,
  id = "with-taxes",
}: CustomCheckboxProps) => {
  return (
    <Field orientation="horizontal" className="w-fit">
      <Label htmlFor={id}>{label}</Label>
      <Checkbox
        id={id}
        name={id}
        checked={checked}
        onCheckedChange={setChecked}
      />
    </Field>
  );
};
