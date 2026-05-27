import { Card, CardContent } from "@/components/ui/card";
import { FormSelect } from "./FormSelect";
import { MONTHS } from "@investments/shared";
import { SelectItem } from "@/components/ui/select";
import { FormInput } from "./FormInput";

export const FormMonthYear = () => {
  return (
    <Card>
      <CardContent className="flex gap-8">
        <FormSelect name="month" label="Mois">
          {MONTHS?.map(({ code, label }) => (
            <SelectItem key={code} value={code}>
              {label}
            </SelectItem>
          ))}
        </FormSelect>

        <FormInput name="year" required label="Année" />
      </CardContent>
    </Card>
  );
};
