import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const WEEK_DAYS = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];
const MONTH_FORMATTER = new Intl.DateTimeFormat("fr-FR", {
  month: "long",
  year: "numeric",
});

const toDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const toValue = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;

export const DatePicker = ({
  value,
  onChange,
  label,
  clearable = false,
}: {
  value?: string | null;
  onChange: (value: string | null) => void;
  label: string;
  clearable?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => {
    const date = value ? toDate(value) : new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const days = useMemo(() => {
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const offset = (firstDay.getDay() + 6) % 7;
    const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    return [
      ...Array.from({ length: offset }, () => null),
      ...Array.from({ length: count }, (_, index) => index + 1),
    ];
  }, [month]);

  const selectedDate = value ? toDate(value) : undefined;
  const labelValue = selectedDate
    ? selectedDate.toLocaleDateString("fr-FR")
    : "Choisir une date";

  return (
    <div ref={containerRef} className="relative">
      <span className="mb-1 block text-sm">{label}</span>
      <div className="flex gap-1">
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start font-normal"
          aria-label={label}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          {labelValue}
        </Button>
        {clearable && value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Effacer la date"
            onClick={() => onChange(null)}
          >
            <X />
          </Button>
        )}
      </div>
      {open && (
        <div className="absolute z-20 mt-2 w-72 rounded-lg border bg-popover p-3 text-popover-foreground shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Mois précédent"
              onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
            >
              <ChevronLeft />
            </Button>
            <span className="font-medium capitalize">{MONTH_FORMATTER.format(month)}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Mois suivant"
              onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
            >
              <ChevronRight />
            </Button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
            {WEEK_DAYS.map((day) => <span key={day} className="py-1">{day}</span>)}
            {days.map((day, index) => {
              const date = day
                ? new Date(month.getFullYear(), month.getMonth(), day)
                : undefined;
              const isSelected = date && value === toValue(date);
              return (
                <button
                  key={`${month.toISOString()}-${index}`}
                  type="button"
                  disabled={!date}
                  className={cn(
                    "h-8 rounded-md text-sm hover:bg-accent disabled:pointer-events-none",
                    isSelected && "bg-primary text-primary-foreground hover:bg-primary",
                  )}
                  onClick={() => {
                    if (date) {
                      onChange(toValue(date));
                      setOpen(false);
                    }
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
