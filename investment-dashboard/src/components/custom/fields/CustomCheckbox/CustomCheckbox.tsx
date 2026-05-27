import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";

type CustomCheckboxProps = {
  label: string;
  checked: boolean;
  setChecked: (value: boolean) => void;
};

export const CustomCheckbox = ({
  label,
  checked,
  setChecked,
}: CustomCheckboxProps) => {
  return (
    <Field orientation="horizontal" className="w-fit">
      <Label htmlFor="with-taxes">{label}</Label>
      <Checkbox
        id="with-taxes"
        name="with-taxes"
        checked={checked}
        onCheckedChange={setChecked}
      />
    </Field>
  );
};
