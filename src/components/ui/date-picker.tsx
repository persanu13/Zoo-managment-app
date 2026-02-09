"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

type DatePickerMode = "date" | "datetime";

type DatePickerProps = {
  name: string;
  defaultValue?: Date | string | null; // "2026-02-09" sau "2026-02-09T10:30:00Z" sau Date
  mode?: DatePickerMode; // default: "date"
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

function parseDefault(defaultValue?: Date | string | null) {
  if (!defaultValue) return undefined;
  const d =
    typeof defaultValue === "string" ? new Date(defaultValue) : defaultValue;
  return Number.isNaN(d.getTime()) ? undefined : d;
}

// pentru input hidden:
// - date: "YYYY-MM-DD"
// - datetime: "YYYY-MM-DDTHH:mm"
function buildHiddenValue(
  date?: Date,
  time?: string,
  mode: DatePickerMode = "date",
) {
  if (!date) return "";
  const datePart = format(date, "yyyy-MM-dd");
  if (mode === "date") return datePart;

  // datetime
  const t = time && time.length > 0 ? time : "00:00";
  return `${datePart}T${t}`;
}

function nowTimeHHmm() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function DatePicker({
  name,
  defaultValue,
  mode = "date",
  placeholder = "Pick a date",
  className,
  disabled,
}: DatePickerProps) {
  const initial = React.useMemo(
    () => parseDefault(defaultValue),
    [defaultValue],
  );

  const [date, setDate] = React.useState<Date | undefined>(initial);
  const [time, setTime] = React.useState<string>(() => {
    if (mode !== "datetime") return "";
    if (initial) return format(initial, "HH:mm");
    return nowTimeHHmm();
  });

  // dacă se schimbă defaultValue din exterior (edit page), sincronizează
  React.useEffect(() => {
    const d = parseDefault(defaultValue);
    setDate(d);

    if (mode === "datetime") {
      setTime(d ? format(d, "HH:mm") : nowTimeHHmm());
    }
  }, [defaultValue, mode]);

  const hiddenValue = buildHiddenValue(date, time, mode);

  const buttonLabel = React.useMemo(() => {
    if (!date) return placeholder;
    if (mode === "date") return format(date, "PPP");
    return `${format(date, "PPP")} • ${time}`;
  }, [date, mode, placeholder, time]);

  return (
    <>
      <input type="hidden" name={name} value={hiddenValue} />

      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            id={name}
            variant="outline"
            disabled={disabled}
            className={[
              "w-[280px] h-9 justify-start text-left font-normal gap-2",
              className ?? "",
            ].join(" ")}
          >
            <CalendarIcon className="h-4 w-4 shrink-0" />
            <span
              className={[
                "min-w-0 truncate",
                !date ? "text-muted-foreground" : "",
              ].join(" ")}
            >
              {buttonLabel}
            </span>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              autoFocus
            />

            {mode === "datetime" && (
              <div className="mt-3 flex items-center gap-2 border-t pt-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="h-9 rounded-md border bg-background px-3 text-sm"
                />
                <span className="text-xs text-muted-foreground">(HH:mm)</span>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
