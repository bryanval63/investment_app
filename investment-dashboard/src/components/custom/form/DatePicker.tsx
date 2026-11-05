import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MONTHS_LABEL } from "@investments/shared";
import {
  buildCalendarDays,
  buildPickerYears,
  parseInputValue,
  startOfMonth,
  toDate,
  toDisplayValue,
  toInputValue,
  toValue,
} from "./date-picker.utils";

const WEEK_DAYS = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

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
  const [month, setMonth] = useState(() =>
    startOfMonth(value ? toDate(value) : new Date()),
  );
  const [inputValue, setInputValue] = useState(() => toInputValue(value));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const years = useMemo(() => buildPickerYears(), []);
  const days = useMemo(() => buildCalendarDays(month), [month]);

  const commitInputValue = (nextValue: string) => {
    const parsedDate = parseInputValue(nextValue);
    if (!parsedDate) {
      setInputValue(toInputValue(value));
      return;
    }

    setInputValue(toDisplayValue(parsedDate));
    setMonth(startOfMonth(parsedDate));
    onChange(toValue(parsedDate));
  };

  return (
    <div ref={containerRef} className="relative">
      <span className="mb-1 block text-sm">{label}</span>
      <div className="flex gap-1">
        <Input
          value={inputValue}
          placeholder="jj/mm/aaaa"
          aria-label={label}
          onFocus={() => setOpen(true)}
          onChange={(event) => setInputValue(event.target.value)}
          onBlur={(event) => commitInputValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commitInputValue(event.currentTarget.value);
              setOpen(true);
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={`Ouvrir le calendrier pour ${label}`}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          <Calendar />
        </Button>
        {clearable && value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Effacer la date"
            onClick={() => {
              setInputValue("");
              onChange(null);
            }}
          >
            <X />
          </Button>
        )}
      </div>
      {open && (
        <div className="absolute z-20 mt-2 w-72 rounded-lg border bg-popover p-3 text-popover-foreground shadow-lg">
          <div className="mb-3 flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Mois précédent"
              onClick={() => setMonth(startOfMonth(month, -1))}
            >
              <ChevronLeft />
            </Button>
            <select
              className="h-8 min-w-0 flex-1 rounded-md border bg-background px-2 text-sm capitalize"
              aria-label="Mois"
              value={month.getMonth()}
              onChange={(event) =>
                setMonth(
                  new Date(
                    month.getFullYear(),
                    Number(event.target.value),
                    1,
                  ),
                )
              }
            >
              {MONTHS_LABEL.map((monthName, index) => (
                <option key={monthName} value={index}>
                  {monthName}
                </option>
              ))}
            </select>
            <select
              className="h-8 w-24 rounded-md border bg-background px-2 text-sm"
              aria-label="Année"
              value={month.getFullYear()}
              onChange={(event) =>
                setMonth(
                  new Date(
                    Number(event.target.value),
                    month.getMonth(),
                    1,
                  ),
                )
              }
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Mois suivant"
              onClick={() => setMonth(startOfMonth(month, 1))}
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
                      setInputValue(toDisplayValue(date));
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
