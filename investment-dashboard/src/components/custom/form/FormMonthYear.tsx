import { CalendarDays } from "lucide-react";
import { MONTHS } from "@investments/shared";
import { SectionCard } from "@/components/custom/containers/SectionCard";
import { SelectItem } from "@/components/ui/select";
import { FormSelect } from "./FormSelect";
import { FormInput } from "./FormInput";

export const FormMonthYear = () => {
  return (
    <SectionCard
      icon={CalendarDays}
      title="Période"
      contentClassName="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      <FormSelect name="month" label="Mois">
        {MONTHS?.map(({ code, label }) => (
          <SelectItem key={code} value={code}>
            {label}
          </SelectItem>
        ))}
      </FormSelect>

      <FormInput name="year" required label="Année" inputMode="numeric" />
    </SectionCard>
  );
};
