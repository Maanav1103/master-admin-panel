"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, ChevronDown } from "lucide-react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

type Props = {
  from: Date | null;
  to: Date | null;
  onApply: (from: Date, to: Date) => void;
  onCancel?: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// Override the Calendar's internal cell layout directly via classNames.
// We cannot reliably override --cell-size via className prop because the
// Calendar component sets it inline in its own className string at the same
// specificity level — so we target the structural classes instead.
const calendarClassNames = {
  month: "flex w-full flex-col gap-3",
  weekdays: "flex w-full",
  weekday:
    "w-9 h-9 flex items-center justify-center text-[0.8rem] font-normal text-muted-foreground select-none",
  week: "flex w-full mt-1",
  day: "w-9 h-9 flex items-center justify-center p-0 text-center select-none relative",
};

export default function CustomDateRangePicker({
  from,
  to,
  onApply,
  onCancel,
  open,
  onOpenChange,
}: Props) {
  const [tempFrom, setTempFrom] = useState<Date | null>(from);
  const [tempTo, setTempTo] = useState<Date | null>(to);

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  // 7 day columns × 2.25rem each + 1.5rem padding on each side
  const calendarWidth = "calc(7 * 2.25rem + 3rem)";

  return (
    <PopoverPrimitive.Root
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (o) {
          setTempFrom(from);
          setTempTo(to);
        }
      }}
    >
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          className="flex h-[38px] cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
        >
          <CalendarIcon className="h-4 w-4 shrink-0 text-gray-400" />
          <span className={from && to ? "text-gray-900" : "text-gray-400"}>
            {from && to
              ? `${format(from, "dd MMM yyyy")} – ${format(to, "dd MMM yyyy")}`
              : "Pick range"}
          </span>
          <ChevronDown
            className={cn(
              "ml-1 h-4 w-4 text-gray-400 transition-transform",
              open && "rotate-180"
            )}
          />
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={6}
          className="z-50 w-auto min-w-max rounded-xl border border-[#e6ebf1] bg-white p-5 shadow-xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          <p className="mb-4 text-sm font-semibold text-gray-800">
            Select Custom Range
          </p>

          <div className="flex gap-8">
            {/* From */}
            <div style={{ width: calendarWidth }}>
              <p className="mb-2 text-xs font-medium text-gray-500">From</p>
              <Calendar
                mode="single"
                selected={tempFrom ?? undefined}
                onSelect={(d) => setTempFrom(d ?? null)}
                disabled={(d) => d > today || (tempTo ? d > tempTo : false)}
                initialFocus
                classNames={calendarClassNames}
              />
            </div>

            <div className="w-px self-stretch bg-gray-200" />

            {/* To */}
            <div style={{ width: calendarWidth }}>
              <p className="mb-2 text-xs font-medium text-gray-500">To</p>
              <Calendar
                mode="single"
                selected={tempTo ?? undefined}
                onSelect={(d) => setTempTo(d ?? null)}
                disabled={(d) => d > today || (tempFrom ? d < tempFrom : false)}
                classNames={calendarClassNames}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
            <span className="text-xs text-gray-400">
              {tempFrom && tempTo
                ? `${format(tempFrom, "dd MMM yyyy")} – ${format(
                    tempTo,
                    "dd MMM yyyy"
                  )}`
                : "No range selected"}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                onClick={() => {
                  setTempFrom(null);
                  setTempTo(null);
                  onCancel?.();
                  onOpenChange(false);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!tempFrom || !tempTo}
                className="rounded-md bg-gradient-brand px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={() => {
                  if (tempFrom && tempTo) {
                    onApply(tempFrom, tempTo);
                    onOpenChange(false);
                  }
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}