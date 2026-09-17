import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const WEEK_DAYS = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];
const MONTHS = Array.from({ length: 12 }, (_, month) =>
  new Intl.DateTimeFormat("fr-FR", { month: "long" }).format(
    new Date(2020, month, 1),
  ),
);
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 201 }, (_, index) => CURRENT_YEAR + 100 - index);

const toDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const toValue = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;

const toInputValue = (value?: string | null) =>
  value ? toDate(value).toLocaleDateString("fr-FR") : "";

const parseInputValue = (value: string) => {
  const match = value.trim().match(/^(\d{1,2})[/. -](\d{1,2})[/. -](\d{4})$/);
  if (!match) return null;

  const [, day, month, year] = match.map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
    ? date
    : null;
};

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

  const days = useMemo(() => {
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const offset = (firstDay.getDay() + 6) % 7;
    const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    return [
      ...Array.from({ length: offset }, () => null),
      ...Array.from({ length: count }, (_, index) => index + 1),
    ];
  }, [month]);

  const commitInputValue = (nextValue: string) => {
    const parsedDate = parseInputValue(nextValue);
    if (!parsedDate) {
      setInputValue(toInputValue(value));
      return;
    }

    setInputValue(parsedDate.toLocaleDateString("fr-FR"));
    setMonth(new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1));
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
              onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
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
              {MONTHS.map((monthName, index) => (
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
              {YEARS.map((year) => (
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
                      setInputValue(date.toLocaleDateString("fr-FR"));
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
