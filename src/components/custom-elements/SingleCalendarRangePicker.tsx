"use client";

import { useState } from "react";
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, addMonths, subMonths, isSameMonth, isSameDay,
  isWithinInterval, isAfter, isBefore,
} from "date-fns";
import { CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

type Props = {
  from: Date | null;
  to: Date | null;
  onApply: (from: Date, to: Date) => void;
  onCancel?: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function buildCalendarDays(month: Date): Date[] {
  const start = startOfWeek(startOfMonth(month));
  const end = endOfWeek(endOfMonth(month));
  const days: Date[] = [];
  let cur = start;
  while (!isAfter(cur, end)) {
    days.push(cur);
    cur = addDays(cur, 1);
  }
  return days;
}

export default function SingleCalendarRangePicker({
  from, to, onApply, onCancel, open, onOpenChange,
}: Props) {
  const [month, setMonth] = useState(new Date());
  const [start, setStart] = useState<Date | null>(from);
  const [end, setEnd] = useState<Date | null>(to);
  const [hovered, setHovered] = useState<Date | null>(null);

  const today = new Date();
  const days = buildCalendarDays(month);

  // Effective end for preview while hovering
  const effectiveEnd = end ?? (start && hovered && !end ? hovered : null);
  // Normalize so rangeStart <= rangeEnd
  const [rangeStart, rangeEnd] = (() => {
    if (!start || !effectiveEnd) return [start, effectiveEnd];
    return isAfter(effectiveEnd, start)
      ? [start, effectiveEnd]
      : [effectiveEnd, start];
  })();

  const handleDayClick = (day: Date) => {
    if (isAfter(day, today)) return;
    if (!start || (start && end)) {
      setStart(day);
      setEnd(null);
    } else {
      if (isBefore(day, start)) {
        setEnd(start);
        setStart(day);
      } else {
        setEnd(day);
      }
    }
  };

  const isInRange = (day: Date) => {
    if (!rangeStart || !rangeEnd) return false;
    return isWithinInterval(day, { start: rangeStart, end: rangeEnd });
  };

  const isStart = (day: Date) => !!rangeStart && isSameDay(day, rangeStart);
  const isEnd = (day: Date) => !!rangeEnd && isSameDay(day, rangeEnd);

  const isSingleDay = rangeStart && rangeEnd && isSameDay(rangeStart, rangeEnd);



  const dayCount =
    start && end
      ? Math.round(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
      : null;

  return (
    <PopoverPrimitive.Root
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (o) {
          setStart(from);
          setEnd(to);
          setMonth(from ?? new Date());
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
          className="z-50 w-auto rounded-xl border border-border bg-white p-4 shadow-xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          {/* Month navigation */}
          <div className="mb-3 flex items-center justify-between">
            <button
              onClick={() => setMonth(subMonths(month, 1))}
              className="rounded-md p-1 text-muted hover:bg-surface hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-semibold text-foreground">
              {format(month, "MMMM yyyy")}
            </span>
            <button
              onClick={() => setMonth(addMonths(month, 1))}
              disabled={isSameMonth(month, today)}
              className="rounded-md p-1 text-muted hover:bg-surface hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map((d) => (
              <div
                key={d}
                className="h-8 w-9 flex items-center justify-center text-[11px] font-medium text-muted"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7">
            {days.map((day, i) => {
              const isCurrentMonth = isSameMonth(day, month);
              const isToday = isSameDay(day, today);
              const isFuture = isAfter(day, today);
              const dayIsStart = isStart(day);
              const dayIsEnd = isEnd(day);
              const inRange = isInRange(day);
              const isSelected = dayIsStart || dayIsEnd;
              const isOnlySelected = isSingleDay && dayIsStart;

              // Range strip visibility: show bg on days strictly between start and end
              const showRangeBg = inRange && !isOnlySelected;

              return (
                <div
                  key={i}
                  className="relative h-9 w-9 flex items-center justify-center"
                  onMouseEnter={() => !end && start && setHovered(day)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Range strip — two half-width bands behind the circle */}
                  {showRangeBg && (
                    <>
                      {/* Left half: always show unless this is the start day */}
                      {!dayIsStart && (
                        <span className="absolute inset-y-1 left-0 w-1/2 bg-primary/12 pointer-events-none" />
                      )}
                      {/* Right half: always show unless this is the end day */}
                      {!dayIsEnd && (
                        <span className="absolute inset-y-1 right-0 w-1/2 bg-primary/12 pointer-events-none" />
                      )}
                    </>
                  )}

                  {/* Start cap: fill right half so strip continues into range */}
                  {dayIsStart && !isOnlySelected && rangeEnd && (
                    <span className="absolute inset-y-1 right-0 w-1/2 bg-primary/12 pointer-events-none" />
                  )}

                  {/* End cap: fill left half so strip connects back from range */}
                  {dayIsEnd && !isOnlySelected && (
                    <span className="absolute inset-y-1 left-0 w-1/2 bg-primary/12 pointer-events-none" />
                  )}

                  <button
                    onClick={() => handleDayClick(day)}
                    disabled={isFuture || !isCurrentMonth}
                    className={cn(
                      "relative z-10 h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-150",
                      // Hidden for out-of-month
                      !isCurrentMonth && "opacity-0 pointer-events-none",
                      // Future days
                      isFuture && isCurrentMonth && "opacity-25 cursor-not-allowed text-foreground",
                      // Default state
                      !isSelected && !isFuture && isCurrentMonth && "hover:bg-surface text-foreground",
                      // Today ring
                      isToday && !isSelected && "ring-1 ring-primary text-primary font-semibold",
                      // In-range (not endpoints)
                      inRange && !isSelected && "text-primary font-medium",
                      // Selected endpoints — solid filled circle
                      isSelected &&
                        "bg-primary text-white font-semibold shadow-md shadow-primary/30 scale-105",
                    )}
                  >
                    {format(day, "d")}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3 gap-4">
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-foreground font-medium truncate">
                {start && end
                  ? `${format(start, "dd MMM")} – ${format(end, "dd MMM yyyy")}`
                  : start
                  ? `${format(start, "dd MMM yyyy")} → ?`
                  : "Select start date"}
              </span>
              {dayCount && (
                <span className="text-[11px] text-muted mt-0.5">
                  {dayCount} {dayCount === 1 ? "day" : "days"} selected
                </span>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                className="rounded-md border border-border bg-white px-3 py-1.5 text-xs font-medium text-muted hover:bg-surface transition-colors"
                onClick={() => {
                  setStart(null);
                  setEnd(null);
                  onCancel?.();
                  onOpenChange(false);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!start || !end}
                className="rounded-md bg-gradient-brand px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                onClick={() => {
                  if (start && end) {
                    onApply(start, end);
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